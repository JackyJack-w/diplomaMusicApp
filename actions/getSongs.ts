import { Song } from "@/types";
import {  cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
const getSongs = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const { data, error } = await supabase
    .from('songs')
    .select(`
        id,
        title,
        user_id,
        artists (id, artist_name),
        albums (id, album_title, release_date, image_path),
        song_path
    `)
    .order('created_at', { ascending: false})
      

    if(error) {
        console.log(error);
    }

    return (data as any) || [];

};

export default getSongs;