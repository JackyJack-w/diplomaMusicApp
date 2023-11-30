"use client";

import ListItem from "@/components/ListItem";
import PlaylistItem from "@/components/PlaylistItem";
import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { useUser } from "@/hooks/useUser";
import { Playlist } from "@/types";
import { useEffect, useState } from "react";


interface PlaylistContentProps {
    playlist : Playlist[];
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
    playlist
}) => {
    const { user } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    useEffect(() => {
        if (user) {
            // User is authenticated
            setIsAuthenticated(true);
        } else {
            // User is not authenticated
            setIsAuthenticated(false);
        }
    }, [user]);
    return (
        

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem  name="Liked Songs" href={isAuthenticated ? "liked" : "/"} image="/images/liked.svg"/>
            {playlist.map((item) => (
                <PlaylistItem key={item.playlist_id} href={`/playlist/${item.playlist_id}`} data={item} />
            ))}
        </div>
    )
}

export default PlaylistContent;