"use client";

import { IoMdMusicalNote } from "react-icons/io";
import { MdOutlineLibraryMusic } from "react-icons/md";

import ModalTest from "@/components/ModalTest";

import useOpenUploadModal from "@/hooks/useOpenUploadModal";
import useUploadModal from "@/hooks/useUploadModal";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

const OpenModal = () => {
    const OpenModal = useOpenUploadModal();
    const UploadModal = useUploadModal();
    const CreatePlaylist = useCreatePlaylistModal();
    const onChange = (open: boolean) => {
        if(!open){
            OpenModal.onClose();
        }
    }

    return (
        <ModalTest

            isOpen={OpenModal.isOpen}
            onChange={onChange}
        >

            <div 
                onClick={UploadModal.onOpen}
                className="flex gap-[20px] cursor-pointer hover:bg-slate-200 hover:bg-opacity-25 p-3 rounded-[10px] transition-all"
            >
                <IoMdMusicalNote size={20}/>

                Add Song
            </div>

            <div 
                onClick={CreatePlaylist.onOpen}
                className="flex gap-[20px] cursor-pointer hover:bg-slate-200 hover:bg-opacity-25 p-3 rounded-[10px] transition-all"
            >
                <MdOutlineLibraryMusic size={20}/>


                Add Playlist
            </div>
        </ModalTest>
    );
}

export default OpenModal;