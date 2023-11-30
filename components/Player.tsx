"use client";

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContent";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";

const Player = () => {
    
    const player = usePlayer();
    const { song } = useGetSongById(player.activeId);

    const songUrl = useLoadSongUrl(song!);
    const { user } = useUser()
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
    if(!isAuthenticated || !song || !songUrl || !player.activeId){
        return null;
    }
    
    return (
        <div className="fixed z-50 transition bottom-0 h-[160px] bg-black w-full py-2 xl:h-[94px] px-4 ">
            <PlayerContent 

                /// key attribute need to skip songs as it destroy and rerender component every time newUrl Passed
                key={songUrl}
                song={song}
                songUrl={songUrl}
            />
        </div>
    )
}

export default Player;