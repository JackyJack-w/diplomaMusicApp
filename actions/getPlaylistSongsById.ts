

import { Song } from "@/types";
import {  cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";


const getPlaylistSongsById = async (playlistId: string): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    })

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data: playlistSongs, error } = await supabase
    .from('playlist_songs')
    .select('song_id')
    .eq('playlists_id', playlistId);
    if (!playlistSongs || playlistSongs.length === 0) {
        console.log('No songs found for the provided playlist ID.');
        return [];
    }
    const songIds = playlistSongs.map((playlistSong) => playlistSong.song_id);

    const { data: songsData, error: songsError } = await supabase
      .from('songs')
      .select(' id, title, user_id, artists (id, artist_name), albums (id, album_title, release_date, image_path), song_path')
      .in('id', songIds);

    if (songsError) {
      throw songsError;
    }

    // Return the details of songs associated with the playlist
    return (songsData as any) || [];
};

export default getPlaylistSongsById;