"use client";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import AddToPlaylistButton from "./AddToPlaylistButton";

import { BsPauseFill, BsPlayFill } from "react-icons/bs"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from 'use-sound';
import ChatExample from "./ChatExample";


interface PlayerContentProps {
    song: Song;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    song,
    songUrl
}) => {
    const player = usePlayer();
    const [ volume, setVolume ] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ?  HiSpeakerXMark : HiSpeakerWave ;

    
    const [currentTime, setCurrentTime] = useState(0);
    const [rangeValue, setRangeValue] = useState(0);
    
    const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    return formattedTime;
    };

    const formatDuration = (timeInMilliseconds: number): string => {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    return formattedTime;
    };

    const onPlayNext = () => {
        if(player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const nextSong = player.ids[currentIndex + 1];

        if(!nextSong){
            return player.setId(player.ids[0]);
        }

        player.setId(nextSong);
    }


    const onPlayPrevious = () => {
        if(player.ids.length === 0) {
            return;
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId);
        const previousSong = player.ids[currentIndex - 1];

        if(!previousSong){
            return player.setId(player.ids[player.ids.length - 1]);
        }



        player.setId(previousSong);
    }

    const [play, {pause, sound, duration}] = useSound(
        songUrl,{
            volume: volume,
            onplay: () => {
                setIsPlaying(true)
            },
            onend: () => {
                setIsPlaying(false);
                onPlayNext();
            },
            onpause: () => {
                setIsPlaying(false)
            },
            format: ['mp3']
        }
    );
    
    useEffect(() => {
        const interval = setInterval(() => {
          if (isPlaying && currentTime < duration / 1000) {
            setCurrentTime((prevTime) => prevTime + 1);
            setRangeValue((prevValue) => prevValue + 1);
          }
        }, 1000);
    
        return () => clearInterval(interval);
    }, [isPlaying, currentTime, duration]);

    useEffect(() => {
        sound?.play();
        return () => {
            sound?.unload();
            setCurrentTime(0);
            setRangeValue(0);
        }

    }, [sound]);

    const handlePlay = () => {
        if(!isPlaying){
            play();
        }else{
            pause();
        }
    }

    const toggleMute = () => {
        if(volume === 0){
            setVolume(1);
        }else{
            setVolume(0);
        }
    }
    
      const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        setRangeValue(newValue);
        setCurrentTime(newValue);
        sound.volume(0);
        sound.seek(newValue);
        
        setTimeout(() => {
            sound.volume(1); // Unmute the audio after seeking (after a small delay)
          }, 700);
      };
    return (
        <div className=" relative">

            <div className="grid grid-cols-1  xl:grid-cols-3 h-full">
                <div className="flex w-full justify-start">
                    <div className="flex items-center justify-between w-full xl:w-[unset] md:justify-normal md:gap-x-4">
                        <ChatExample data={song} />
                        <MediaItem data={song} />
                        
                        <LikeButton songId={song.id} />
                        <AddToPlaylistButton songId={song.id} />
                    </div>
                    
                </div>
                <div className="flex items-center flex-col gap-3">
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 items-center">
                            <div className=" w-9"> {formatTime(currentTime)}</div>
                            <input
                                type="range"
                                min={0}
                                max={duration / 1000}
                                step={0.01}
                                value={rangeValue}
                                // onMouseDown={handleSeekMouseDown}
                                onChange={(handleSeek)}
                                // onMouseUp={handleSeekMouseUp}
                               
                            />
                            <div className=" w-9"> {formatDuration(duration)}</div>
                        </div> 
                    </div>
                    <div className="h-full flex justify-center items-center w-full max-w-[722px] gap-x-6">
                        <AiFillStepBackward 
                            onClick={onPlayPrevious}
                            size={30}
                            className="text-neutral-400 cursor-pointer hover:text-white transition"
                        />
                        <div 
                            onClick={handlePlay}
                            className="
                                flex
                                transition
                                items-center
                                justify-center
                                h-10
                                w-10
                                rounded-full
                                bg-white
                                p-1
                                cursor-pointer
                                hover:scale-110
                                
                            "
                        >
                            <Icon size={30} className="text-black" />
                        </div>
                        <AiFillStepForward 
                            onClick={onPlayNext}
                            size={30}
                            className="text-neutral-400 cursor-pointer hover:text-white transition"
                        />
                    </div>
                </div>
                

                <div className="hidden md:flex w-full justify-end pr-2">
                   
                    <div className="flex items-center gap-x-2 w-[120px]">
                        <VolumeIcon 
                            onClick={toggleMute}
                            className="cursor-pointer"
                            size={34}
                        />
                        <Slider 
                            value={volume}
                            onChange={(value) => setVolume(value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;