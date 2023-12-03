"use client";

import { Song } from '@/types';
import React, { useState } from 'react';
import { MdLightbulbOutline } from "react-icons/md";
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';


interface ChatProps {
  data: Song;
}

interface Prompt {
    text: string;
    image: string;
}

const Chat: React.FC<ChatProps> = ({
    data,
}) => {
    const prompts: Prompt[] = [
        { text: `5 Intersting facts about musician ${data.artists.artist_name} with 50 words`, image: '/images/artist_info.svg' },
        { text: `Describe the mood and a what the song is about from ${data.title} by ${data.artists.artist_name} based on original version with 100 words`, image: '/images/song_details.svg' },
        { text: `What instruments is used in song ${data.title} by ${data.artists.artist_name} `, image: '/images/intruments.svg' },
        { text: `Describe populatity of song ${data.title} by ${data.artists.artist_name} among the world, when it was released first time `, image: '/images/chart.svg' },
    ]
    const [message, setMessage] = useState(''); 
    const [response, setResponse] = useState<String>("");
    const [loading, setLoading] = useState(false);

    const handlePromptClick = async (prompt: string) => {

        setResponse("");
        setLoading(true);
        const response = await fetch('/api/chatStream', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });
        
        if (!response.ok) {
            throw new Error(response.statusText);
          }
      
          // This data is a ReadableStream
          const data = response.body;
          if (!data) {
            return;
          }
      
          const reader = data.getReader();
          const decoder = new TextDecoder();
          let done = false;
      
          while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setResponse((prev) => prev + chunkValue);
          }
          setLoading(false);
        
    };

    
    const [showElement, setShowElement] = useState(false);
    
    const handleClick = () => {
        setShowElement(!showElement);
    };
  return (
    <div className="relative ">
        <div className="
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
            onClick={handleClick}
        >
            < MdLightbulbOutline size={25} className="text-black " />
        </div>
        {showElement && (
            <div className="z-[1] absolute bg-[rgba(0,0,0,0.8)] w-[284px] rounded-xl animate-fadeIn p-6 border-solid border-4 border-dark md:left-[-7px]" >
            
            <div className=" rounded-md overflow-y-scroll no-scrollbar bg-neutral-100/10 pr-4  pl-[10px]  max-h-[200px]">
        
            {response && (
                <div className="mt-2 rounded-xl p-4 shadow-md transition">
                    {response}
                </div>
            )}
            </div>
            <div className={twMerge(`flex gap-5 ${response && 'mt-4'}`)}>
                {prompts.map((prompt, index) => (
                    <button 
                        key={index}
                        onClick={() => handlePromptClick(prompt.text)  }
                        className="flex
                        transition
                        items-center
                        justify-center
                        h-10
                        w-10
                        rounded-full
                        bg-white
                        p-1
                        cursor-pointer
                        hover:scale-110"
                    >
                        <Image src={prompt.image} alt="Image" width={25} height={25} rel='preload'/>
                    </button>
                ))}
            </div>
        </div> 
        )}
       
      
    </div>
  );
};

export default Chat;
