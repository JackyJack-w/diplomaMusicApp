

import Image from 'next/image';
import Header from '@/components/Header';


import getPlaylistsById from "@/actions/getPlaylistById";
import { Playlist } from "@/types";
import PlaylistContent from '../components/PlaylistContent';
import getPlaylistSongsById from '@/actions/getPlaylistSongsById';


export const revalidate = 0;



const Playlist = async({ params}: { params: { playlistId: string}}, playlist: Playlist[] ) => {
    const getPlayListData = await getPlaylistsById(params.playlistId);
    playlist = getPlayListData;
    const getSongsbyId = await getPlaylistSongsById(params.playlistId);
    
    
    return(
        <div className='h-full'> {playlist.map((item) => (
           
            <div key={item.playlist_id}className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto " >
                    <Header >
                        <div className="mt-20">
                            <div className="flex flex-col md:flex-row items-center gap-x-5 ">
                                <div className="relative h-32 w-32 lg:h-44 lg:w-44 ">
                                    <Image 
                                        fill
                                        alt="Playlists"
                                        src={`https://usbdoqvxpsecmwmbujzs.supabase.co/storage/v1/object/public/images/${item.cover_path}`}
                                        className="object-cover"
                                    />
                                </div>
        
                                <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
                                    <p className="hidden md:block font-semibold text-sm">
                                        Playlist
                                    </p>
        
                                    <h1 className=" text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                                        {item.title}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </Header>
                    <PlaylistContent songs={getSongsbyId} />
                </div>
            
        ))}
        </div>
    )
}


export default Playlist;