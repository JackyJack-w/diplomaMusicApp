"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from "@supabase/auth-helpers-react";
import { toast } from "react-hot-toast";
interface DeletePlaylistButtonProps {
  playId: string; // Assuming the ID is of type number
}

const DeletePlaylistButton: React.FC<DeletePlaylistButtonProps> = ({ playId }) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const {
        supabaseClient
      } = useSessionContext();
    const handleDelete = async () => {
      try {
        setIsDeleting(true);
        const { error } = await supabaseClient
        .from('playlists')
        .delete()
        .eq('playlist_id', playId);
        if (error) {
          throw error;
        }
        toast.success('Playlist Deleted');
        router.push('/'); // Redirect to the main page after successful deletion
        router.refresh();
      } catch (error) {
        console.error('Error deleting playlist:', error);
      } finally {
        setIsDeleting(false);
      }
    };
  
    return (
      <button onClick={handleDelete} disabled={isDeleting} className='bg-dark hover:bg-orange text-white font-bold py-2 px-4 rounded transition mt-5 lg:mt-0 self-end'>
        {isDeleting ? 'Deleting...' : 'Delete Playlist'}
        
      </button>
    );
  };
  
export default DeletePlaylistButton;
