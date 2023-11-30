


import Header from "@/components/Header";

import getSongs from '@/actions/getSongs';
import PageContent from './components/PageContent';
import getPlaylists from '@/actions/getPlaylists';

import PlaylistContent from './components/PlaylistContent';
import dynamic from "next/dynamic";
export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();
  const userPlaylists = await getPlaylists();  

  // const PageContent = dynamic(() => import("./components/PageContent"), { ssr: false }) 
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
          <div className="mb-2">
            <h1 className="text-white text-3xl font-semibold">
              Welcome Back
            </h1>
            <PlaylistContent playlist={userPlaylists}/>
          </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-2xl font-semibold">
            Newest Songs
          </h2>
        </div>
        <div>
          <PageContent songs={songs}/>
        </div>
      </div>
    </div>
  )
}
