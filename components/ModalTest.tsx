// import * as Dialog from "@radix-ui/react-dialog";
import * as Dialog from '@radix-ui/react-dropdown-menu';

import { IoMdClose } from "react-icons/io";

interface  ModalTestProps {
    isOpen: boolean;
    onChange: (open: boolean) => void;
    children: React.ReactNode;
}

const ModalTest: React.FC<ModalTestProps> = ({
    isOpen,
    onChange,
    children
}) => {
    return (
        <Dialog.Root
            open={isOpen}
            defaultOpen={isOpen}
            onOpenChange={onChange}
        >
            <Dialog.Portal>
                <Dialog.Content
                    className="absolute w-[200px] left-[300px] top-[196px]  bg-gradient-to-r to-orange from-black rounded-[10px] border-none"
                >   
                    <Dialog.Item className="flex flex-col gap-[4px] outline-none">
                        {children}
                    </Dialog.Item>
  
                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root>
    )
}

export default ModalTest;