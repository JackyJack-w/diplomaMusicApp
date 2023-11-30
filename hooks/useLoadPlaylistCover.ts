
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Playlist } from "@/types";
const useLoadPlaylistCover = (playlist: Playlist) => {
    const supabaseClient = useSupabaseClient();

    if(!playlist) {
        return null;
    }

    const { data: imageData } = supabaseClient
        .storage
        .from('images')
        .getPublicUrl(playlist.cover_path);
    
    return imageData.publicUrl;
};

export default useLoadPlaylistCover;