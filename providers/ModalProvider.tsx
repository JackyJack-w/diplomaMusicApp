"use client";

import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import Modal from "@/components/Modal";

import UploadModal from "@/components/UploadModal";
import OpenModal from "@/components/OpenModal";
import CreatePlaylistModal from "@/components/CreatePlayslistModal";
const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if(!isMounted){
        return null;
    }
    return (
        <>
            <AuthModal />
            <UploadModal />
            <OpenModal />
            <CreatePlaylistModal />
        </>
    )
}

export default ModalProvider;

