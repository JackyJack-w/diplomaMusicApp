"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { useUser } from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModal";
import { MdCheckCircle } from "react-icons/md";
import { MdKeyboardCapslock } from "react-icons/md";
// import { Playlist } from "@/types";
import * as Select from '@radix-ui/react-select';
import { twMerge } from "tailwind-merge";
interface AddToPlaylistButtonProps {
  songId: string;
};
interface PlaylistItem {
  playlist_id: string;
  title: string;
  // created_at: string;
  // user_id: string;
  // cover_path: string;
  
  
  // Add other necessary fields
}
const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({
  songId
}) => {
  const router = useRouter();

  const {
    supabaseClient
  } = useSessionContext();

  const authModal = useAuthModal();

  const { user } = useUser();

  ////Playllist 

  const [userPlaylists, setUserPlaylists] = useState<PlaylistItem[]>([]);


  const [songExistsInPlaylist, setSongExistsInPlaylist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user?.id) {
      return;
    }
  
    const fetchUserPlaylists = async () => {
  
        const { data: playlists, error } = await supabaseClient
        .from('playlists')
        .select('playlist_id, title')
        .eq('user_id', user?.id);

      if (error) {
        throw new Error(error.message);
      }

      if (playlists) {
        setUserPlaylists(playlists);
        
        checkSongExistenceInPlaylists(playlists.map((playlist) => playlist.playlist_id));
      }
      };

      fetchUserPlaylists();
  }, [songId, supabaseClient, user?.id, userPlaylists]);

 
  const checkSongExistenceInPlaylists = async (playlistIds: string[]) => {
    
      const existenceMap: Record<string, boolean> = {};

      for (const playlistId of playlistIds) {
        const { data: existingSongs, error } = await supabaseClient
          .from('playlist_songs')
          .select('*')
          .eq('playlists_id', playlistId)
          .eq('song_id', songId);

        if (error) {
          throw new Error(error.message);
        }

        existenceMap[playlistId] = existingSongs && existingSongs.length > 0;
      }

      setSongExistsInPlaylist(existenceMap);
    
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!supabaseClient) {
      // Handle unauthorized action
      return;
    }

    
      
      const { data: existingSongs, error } = await supabaseClient
        .from('playlist_songs')
        .select('*')
        .eq('playlists_id', playlistId)
        .eq('song_id', songId);
  
      
      if (existingSongs && existingSongs.length > 0 && songExistsInPlaylist) {
        // Song exists in the playlist, delete it
        const { error } = await supabaseClient
          .from('playlist_songs')
          .delete()
          .eq('song_id', songId)
          .eq('playlists_id', playlistId)
          
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Song deleted from the playlist!');
          setShowElement(false)
          // setSongExistsInPlaylist(false);
        }

      } else {
        // Song doesn't exist in the playlist, add it
        const { error: insertError } = await supabaseClient
          .from('playlist_songs')
          .insert({
            song_id: songId,
            playlists_id: playlistId,
            user_id: user?.id
          });
  
        if (insertError) {
          toast.error(insertError.message);
        } else {
          toast.success('Song added to playlist!');
          setShowElement(false);
          // setSongExistsInPlaylist(true);
        }
      }
    //   fetchUserPlaylists();
    
    
    
    // Optionally, you can refresh the UI or do other operations after adding/deleting from the playlist
    router.refresh();
  };

  const [showElement, setShowElement] = useState(false);
  const handleClick = () => {
    setShowElement(!showElement);
  };


  if(userPlaylists === null){
    return(
      <div>
        Create playlist
      </div>
    )
  }
  return (
      <div className="flex gap-4 relative">
      
        <div className=" cursor-pointer" onClick={handleClick}>
          <MdKeyboardCapslock size={25}/>
        </div>
        {showElement && (
          <div className="z-[1] absolute bg-[rgba(0,0,0,0.8)] w-max rounded-xl animate-fadeIn p-4 border-solid border-4 border-dark right-0 md:left-[-7px] md:right-[unset]">
              <div className="flex flex-col  ">
                  {userPlaylists.map((playlist: PlaylistItem) => (
                      <button 
                          key={playlist.playlist_id}
                          onClick={() => handleAddToPlaylist(playlist.playlist_id)  }
                          className="flex
                          transition
                          hover:bg-neutral-400/10
                          p-3
                          cursor-pointer
                          items-center
                          gap-2
                        "
                      >
                        {songExistsInPlaylist[playlist.playlist_id] ? 
                        ( <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange "></span>
                        </span>) :
                        (<span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-dark "></span>
                        </span>) 
                        }
                          
                          <span>{playlist.title}</span>
                      </button>
                  ))}
              </div>
          </div>
        )}
     
      </div>
    

  );
}

export default AddToPlaylistButton;