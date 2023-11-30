"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import Image from 'next/image';
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";
interface SidebarProps {
    children: React.ReactNode;
    songs: Song[];
}

const Sidebar: React.FC<SidebarProps> = ({
    children,
    songs
}) => {
    const pathname = usePathname();
    const player = usePlayer();

    const routes = useMemo(() => [
        {
            icon: HiHome,
            label: 'Home',
            active: pathname !== '/',
            href:'/',
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname === '/search',
            href: '/search',
        }
    ], []);
    return (
        <div className={twMerge(`flex ${player.activeId ? `h-[calc(100vh_-_160px)] xl:h-[calc(100vh_-_94px)]` : `h-full`}`)}>
            <div className="
                hidden
                md:flex
                flex-col
                gap-y-2
                bg-black
                h-full
                w-[300px]
                p-2
            ">
                <Box>
                    <div className="flex flex-col gap-y-4 py-5 px-4">
                        <div className="flex flex-row items-center gap-4">
                            <Image src="/images/logo.png" width={40} height={60} alt="logo"/>  
                            <p className="text-2xl">Senko</p>
                        </div>
                                              
                        {routes.map((item) => (
                            <SidebarItem
                            key={item.label}
                            {...item}
                            ></SidebarItem>
                        ))}
                    </div>
                </Box>

                <Box className="overflow-y-auto h-full">
                    <Library songs={songs}/>
                </Box>
            </div>
            <main className="h-full flex-1 overflow-y-auto py-2 pl-2 pr-2 md:pl-0 ">
                {children}
            </main>
        </div>
    );
}

export default Sidebar;