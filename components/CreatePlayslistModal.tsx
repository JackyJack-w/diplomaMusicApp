"use client";

import uniqid from "uniqid";
import Modal from "./Modal";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useState, ChangeEvent, useRef } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";
import Image from "next/image";
import { IoCloseCircle } from "react-icons/io5";



const CreatePlaylistModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const playlistModal = useCreatePlaylistModal();
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
            playlist_title: '',
            image: null
        }
    })


    const onChange = (open: boolean) => {
        if(!open){
            reset();
            playlistModal.onClose();
            setSelectedImage(null);
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async ( values ) => {
        try {
            setIsLoading(true);

           

            /// check if playlist has playlist with same name
            const { data: existingPlaylist, error } = await supabaseClient
            .from('playlists')
            .select('title')
            .eq('title', values.playlist_title)

            if(error){
                setIsLoading(false);
                return toast.error('Error checking existing playlists');
            }
            
            if (existingPlaylist && existingPlaylist.length > 0) {
                setIsLoading(false);
                return toast.error("A playlist with the same name already exists. Please choose a different name.");
            }
            
            const imageFile = values.image?.[0];

            ///TODO: File can be NULL
            if(!imageFile || !user){
                toast.error('Missing Files')
            }

            const uniqueID = uniqid();

            const {
                data: ImageData,
                error: imageError,
            } = await supabaseClient
                .storage
                .from('images')
                .upload(`image-${values.playlist_title}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                })
                
            if(imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload');
            }

            /// Playlist insertion
            const { data: insertedPlaylist, error: insertionError } = await supabaseClient
            .from('playlists')
            .insert([{
                user_id: user?.id, 
                title: values.playlist_title,
                cover_path: ImageData.path

            }]);
        
            if (insertionError) {
                setIsLoading(false);
                return toast.error(insertionError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Playlist created successfully');
            reset();
            playlistModal.onClose();
        }catch{
            toast.error("Something went wrong");
        }finally{
            setIsLoading(false);
        }
    }
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    
    const handleUnselectImage = () => {
        setSelectedImage(null); // Clear selected image
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Clear the input value
        }
      };

    return (
        

        <Modal
            title="Create Playlist"
            description="New Playlist"
            isOpen={playlistModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input 
                    id="playlist_title"
                    disabled={isLoading}
                    {...register('playlist_title', {required: true})}
                    placeholder="Playlist Title"
                />
                
                <div>

                {selectedImage && (
                    <div className="flex gap-4 items-start">
                        <Image 
                            src={selectedImage as string}
                            alt="selected"
                            width={200}
                            height={200}
                            rel="preload"
                            className="relative mb-5 transition"
                        />
                        <button 
                            onClick={handleUnselectImage}
                            
                        >
                            <IoCloseCircle 
                                size={50}
                                className=" text-white hover:scale-[110%] transition"
                            />
                        </button>
                    </div>
                )}
                <div className="pb-1">
                    Playlist Image
                </div>
                    <Input 
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image', {required: true})}
                        // onChange={handleImageChange}
                        // ref={fileInputRef}
                    />
                    
                </div>

                <Button disabled={isLoading} type="submit">
                    Submit
                </Button>
            </form>
        </Modal>
    );
}

export default CreatePlaylistModal;