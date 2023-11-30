import { Playlist } from "@/types";
import {  cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
const getPlaylistsById = async (id: string): Promise<Playlist[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
    .from('playlists')
    .select(`
        playlist_id,
        title,
        user_id,
        cover_path
    `)
    .eq('user_id', session?.user?.id)
    .eq('playlist_id', id)
    .order('created_at', { ascending: false})
      

    if(error) {
        console.log(error);
        return [];
    }

    // if(!data) {
    //     return [];
    // }

    return (data as any) || [];

};

export default getPlaylistsById;