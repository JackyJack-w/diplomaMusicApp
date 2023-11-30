import { Song } from "@/types";
import {  cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
const getLikedSongs = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
    .from('liked_songs')
    .select('*, songs(id, title, user_id, artists (id, artist_name), albums (id, album_title, release_date, image_path), song_path)')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false})
      

    // if(error) {
    //     console.log(error);
    //     return [];
    // }

    if(!data) {
        return [];
    }

    return data.map((item) => ({
        ...item.songs
    }));

};

export default getLikedSongs;