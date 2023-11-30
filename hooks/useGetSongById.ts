import { Song } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";



const useGetSongById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [song, setSong] = useState<Song | undefined>(undefined);

    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        // Check if id was not passed
        if(!id) {
            return;
        }

        setIsLoading(true);

        const fetchSong = async () => {
            const { data, error }= await supabaseClient
                .from('songs')
                .select(`
                    id,
                    title,
                    user_id,
                    artists (id, artist_name),
                    albums (id, album_title, release_date, image_path),
                    song_path
                `)
                .eq('id', id)
                .single();

            if(error) {
                setIsLoading(false)
                return toast.error(error.message);
            }
            //// NOT as before
            setSong(data as unknown as Song);
            setIsLoading(false);
        }

        fetchSong();
    }, [id, supabaseClient])

    return useMemo(() => ({
        isLoading, 
        song
    }), [isLoading, song]);
};

export default useGetSongById;