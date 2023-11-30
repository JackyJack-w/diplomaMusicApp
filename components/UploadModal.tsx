"use client";

import uniqid from "uniqid";
import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
interface ArtistData {
    id: number;
    artist_name: string | null;
}
  
interface AlbumData {
    id: number | null;
    album_title: string | null;
}

interface SongData {
    album_id: number | null;
    artist_id: number | null;
    id: number | null;
    title: string | null;
}
const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const router = useRouter();
    //// Supabase Init for Downloading songs
    const supabaseClient = useSupabaseClient();
    
    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            artist_name: '',
            album_title: '',
            release_date: '',
            song_title: '',
            song: null,
            image: null,
        }
    })

    const onChange = (open: boolean) => {
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) =>{
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if(!imageFile || !songFile || !user){
                toast.error('Missing Files');
                return;
            }

            const uniqueID = uniqid();

            //// Upload Song
            const {
                data: songData,
                error: songError,
            } = await supabaseClient
            .storage
            .from('songs')
            .upload(`song-${values.artist_name}-${values.album_title}-${values.song_title}-${uniqueID}`, songFile, {
                cacheControl: '3600',
                upsert: false
            })

            if(songError) {
                setIsLoading(false);
                return toast.error('Failed song upload');
            }

            //// Upload image 
            const {
                data: imageData,
                error: imageError,
            } = await supabaseClient
            .storage
            .from('images')
            .upload(`image-${values.album_title}-${values.song_title}-${uniqueID}`, imageFile, {
                cacheControl: '3600',
                upsert: false
            })

            if(imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload');
            }

            let existingArtist: ArtistData | null = null;
            const { data: artistExists, error: artistExistsError } = await supabaseClient
              .from('artists')
              .select('id, artist_name')
              .eq('artist_name', values.artist_name)
              .single();
            
            // Handle artist check error
            if(artistExistsError) {
                setIsLoading(false);
                console.error(artistExistsError.message);
            }

            if (artistExists) {
                existingArtist = artistExists as ArtistData;
            } else {
                
                // Insert new artist if not exists
                const { data: newArtistData, error: newArtistError } = await supabaseClient
                  .from('artists')
                  .insert([{ 
                    user_id: user.id,
                    artist_name: values.artist_name
                    }])
                    .select('*')
                    console.log(newArtistData);
                    
                    if (newArtistError ) {
                        setIsLoading(false);
                        console.error(newArtistError.message);
                    }

                    if(newArtistData != null && Array.isArray(newArtistData) && newArtistData.length > 0){
                        existingArtist = newArtistData[0] as ArtistData;
                    }
                
            }
            // If the artist exists, use the existing artist's ID
            

            // Check if the album already exists
            let existingAlbum: AlbumData | null = null;
            const { data: albumExists, error: albumExistsError } = await supabaseClient
            .from('albums')
            .select('id, album_title')
            .eq('album_title', values.album_title)
            .single();

            // Handle album check error
            if (albumExistsError) {
                setIsLoading(false);
                console.error(albumExistsError.message);
            }
            
            if (albumExists) {
                existingAlbum = albumExists as AlbumData;
              } else if(existingArtist) {
                // Insert new album if not exists
                console.log("titiitit");
                const { data: newAlbumData, error: newAlbumError } = await supabaseClient
                .from('albums')
                .insert([{ 
                    user_id: user.id,
                    album_title: values.album_title,
                    image_path: imageData.path,
                    release_date: values.release_date,
                    artist_id: existingArtist.id
                }])
                .select('*')

                console.log(newAlbumData);
        
                if (newAlbumError) {
                    setIsLoading(false);
                    return toast.error(newAlbumError.message);
                } 
                if(newAlbumData != null && Array.isArray(newAlbumData) && newAlbumData.length > 0){
                    existingAlbum = newAlbumData[0] as AlbumData;
                }
              }

           
            let existingSong: SongData | null = null;
            const { data: songExists, error: songExistsError } = await supabaseClient
            .from('song')
            .select('id, title, album_id, artist_id')
            .eq('title', values.title)
            .single();

            if (songExistsError) {
                setIsLoading(false);
                console.error(songExistsError.message);
            }

            if(songExists){
                existingSong = songExists as SongData;
            }else if(existingArtist && existingAlbum){
                const { data: newSongData, error: songInsertError } = await supabaseClient
                .from('songs')
                .insert([{ 
                    title: values.song_title,
                    song_path: songData.path,
                    artist_id: existingArtist.id,
                    album_id: existingAlbum.id,
                    user_id: user.id
                }])
                .select('*');
                console.log(newSongData);
            // Handle song insertion error
                if (songInsertError) {
                    setIsLoading(false);
                    return toast.error(songInsertError.message);
                }
                if(newSongData != null && Array.isArray(newSongData) && newSongData.length > 0){
                    existingSong = newSongData[0] as SongData;
                }
               
            }
                
            // Insert data into the songs table
            
            
            router.refresh();
            setIsLoading(false);
            toast.success('Song created!');
            reset();
            uploadModal.onClose();
        }catch{
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title="Upload Song"
            description="New Song"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
           <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
            lang="en"
           >
           <Input 
                id="artist_name"
                disabled={isLoading}
                {...register('artist_name', {required: true})}
                placeholder="Song Author"
            />

            <Input 
                id="album_title"
                disabled={isLoading}
                {...register('album_title', {required: true})}
                placeholder="Song Album"
            />

            <Input 
                id="release_date"
                type="date"
                disabled={isLoading}
                {...register('release_date', {required: true})}
                placeholder="Album Release Date"
                lang="en"
            />

            <Input 
                id="song_title"
                disabled={isLoading}
                {...register('song_title', {required: true})}
                placeholder="Song Title"
            />

            <div>
                <div className="pb-1">
                    Select a song file
                </div>
                <Input 
                    id="song"
                    type="file"
                    disabled={isLoading}
                    accept=".mp3"
                    {...register('song', {required: true})}
                />
            </div>
            <div>
                <div className="pb-1">
                    Select an image
                </div>
                <Input 
                    id="image"
                    type="file"
                    disabled={isLoading}
                    accept="image/*"
                    {...register('image', {required: true})}
                />
            </div>

            <Button disabled={isLoading} type="submit">
                Submit
            </Button>
           </form>
        </Modal>
    );
}

export default UploadModal;