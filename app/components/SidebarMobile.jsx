'use client'
import React from 'react'
import { FaArchive } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { LiaDumbbellSolid } from "react-icons/lia";
import { MdLabelImportantOutline } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";
import { Plus } from 'lucide-react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import CardFocuesdTwo from './CardFocuesdTwo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Button from './Button';


const SidebarMobile = ({userPhoto , refreshFunction , labels}) => {
    const [renderNewNote, setRenderNewNote] = useState(false)
    const router = useRouter()


    const handleClose = () => {
        setRenderNewNote(false);
    };


    return (
        <div className='fixed z-30 bottom-0 w-full bg-neutral-600  h-20 flex items-center justify-between gap-2 px-2 lg:hidden '>

            <LiaDumbbellSolid onClick={() => { router.push("/habbitTracker") }} size={40} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />

            <FaRegNoteSticky onClick={() => { router.push("/") }} size={35} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />

             <DropdownMenu>
                <DropdownMenuTrigger>
                <MdLabelImportantOutline size={40} className='p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                {labels && labels.filter(label => label.name !== "archived" && label.name !== "deleted").map(label => 
                    
                    <p onClick={() => {
                        const url = label._id
                        router.push(`/notes/${url}`)
                    }} className=" text-sm hover:bg-neutral-600 rounded-[5px] text-center" key={label._id}>{label.name}</p>)}
            </DropdownMenuContent>
            </DropdownMenu>



                
            <FaArchive onClick={()=>{ ;router.push('/notes/archived')}} size={35} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />

            <FaTrash onClick={()=>{ ;router.push('/notes/deleted')}} size={35} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />


            <DropdownMenu>
                <DropdownMenuTrigger>
                <Image src={userPhoto === undefined || null ? "/don.jpg" : userPhoto} alt="User Photo" width={300} height={300} className="size-10 rounded-full object-cover drop-shadow-2xl" />     
                </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
            <Button text="Sign Out" icon="signOut" color="bg-neutral-800" />
            </DropdownMenuContent>
            </DropdownMenu>

                


           <button onClick={() => setRenderNewNote(true)} className='fixed bottom-24 bg-green-600 rounded-2xl left-10 p-4 shadow-lg shadow-neutral-800 active:bg-green-500 ease-in-out duration-300'><Plus/></button>
           {renderNewNote && createPortal(
                <CardFocuesdTwo refreshFunction={refreshFunction} onClose={handleClose} isNewNote={true} />,
                document.body
            )}

        </div>
    )
}

export default SidebarMobile

