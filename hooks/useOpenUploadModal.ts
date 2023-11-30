import { create } from "zustand";

interface OpenUploadModal {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useOpenUploadModal = create<OpenUploadModal>((set) => ({
    isOpen:false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));

export default useOpenUploadModal;