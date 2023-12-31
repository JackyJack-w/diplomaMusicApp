"use client"

import MediaItem from "@/components/MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";


interface PLaylistContentProps {
    songs: Song[]
}

const PlaylistContent: React.FC<PLaylistContentProps> = ({
    songs
}) => {

    const onPlay = useOnPlay(songs);
    if(songs.length === 0 ) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No songs available.
            </div>
        )
    }

   
    return (
        
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem 
                            onClick={(id: string) => onPlay(id)}
                            data={song}
                        />
                    </div>

                    
                </div>
            ))}
        </div>
    )
}

export default PlaylistContent;