'use client'
import React from 'react'
import CardFocuesdTwo from '../components/my-components/notes/CardFocuesdTwo';
import { Plus } from 'lucide-react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Button from '../components/my-components/Button';
import { CalendarCheck } from "lucide-react";
import { Archive } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Bookmark } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { useEffect } from 'react';
import { Notebook } from 'lucide-react';




const SidebarMobile = ({userPhoto , refreshFunction , labels}) => {
    const [renderNewNote, setRenderNewNote] = useState(false)
    const router = useRouter()


    const handleClose = () => {
        setRenderNewNote(false);
    };


    const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    let timer;
    if (activeButton) {
      timer = setTimeout(() => setActiveButton(null), 1000);
    }
    return () => clearTimeout(timer);
  }, [activeButton]);

  const handleClick = (route, buttonName) => {
    setActiveButton(buttonName);
    router.push(route);
  };

  const isActive = (buttonName) => activeButton === buttonName ? 'bg-neutral-800' : '';

  return (
    <div className='fixed z-30 bottom-0 w-full overflow-x-scroll bg-neutral-600 h-24 flex items-center justify-between gap-2 px-2 lg:hidden'>
      <div onClick={() => handleClick("/habit-test", "habits")} className={`flex flex-col items-center p-2 rounded-xl ease-in-out duration-300 ${isActive("habits")}`}>
        <CalendarCheck size={40} className='p-2 rounded-xl' />
        <span className="text-white text-[10px]">Habits</span>
      </div>

      <div onClick={() => handleClick("/", "notes")} className={`flex flex-col items-center p-2 rounded-xl ease-in-out duration-300 ${isActive("notes")}`}>
        <Notebook size={35} className='p-2 rounded-xl' />
        <span className="text-white text-[10px]">Notes</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-col items-center">
          <Bookmark size={40} className='p-2 rounded-xl' />
          <span className="text-white text-[10px]">Labels</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
          {labels && labels.filter(label => label.name !== "archived" && label.name !== "deleted").map(label => 
            <p onClick={() => {
              const url = label._id;
              router.push(`/notes/${url}`);
            }} className="text-sm hover:bg-neutral-600 rounded-[5px] text-center" key={label._id}>{label.name}</p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

       <div onClick={() => handleClick("/journal", "journal")} className={`flex flex-col items-center p-2 rounded-xl ease-in-out duration-300 ${isActive("notes")}`}>
        <NotebookPen size={35} className='p-2 rounded-xl' />
        <span className="text-white text-[10px]">Journal</span>
      </div>


      <div onClick={() => handleClick('/notes/archived', "archived")} className={`flex flex-col items-center p-2 rounded-xl ease-in-out duration-300 ${isActive("archived")}`}>
        <Archive size={35} className='p-2 rounded-xl' />
        <span className="text-white text-[10px]">Archived</span>
      </div>

      <div onClick={() => handleClick('/notes/deleted', "deleted")} className={`flex flex-col items-center p-2 rounded-xl ease-in-out duration-300 ${isActive("deleted")}`}>
        <Trash2 size={35} className='p-2 rounded-xl' />
        <span className="text-white text-[10px]">Deleted</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-col gap-2 items-center">
          <Image src={userPhoto === undefined || null ? "/don.jpg" : userPhoto} alt="User Photo" width={300} height={300} className="size-10 rounded-full object-cover drop-shadow-2xl" />
          <span className="text-white text-[10px]">Profile</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
          <Button text="Sign Out" icon="signOut" color="bg-neutral-800" />
        </DropdownMenuContent>
      </DropdownMenu>

      <button onClick={() => setRenderNewNote(true)} className='fixed bottom-28 bg-green-600 rounded-2xl left-10 p-4 shadow-lg shadow-neutral-800 active:bg-green-500 ease-in-out duration-300'>
      {renderNewNote && createPortal(
                <CardFocuesdTwo refreshFunction={refreshFunction} onClose={handleClose} isNewNote={true} />,
                document.body
            )}
        <Plus/>
      </button>
    </div>
  );
}

export default SidebarMobile



/*
 <div className='fixed z-30 bottom-0 w-full bg-neutral-600  h-20 flex items-center justify-between gap-2 px-2 lg:hidden '>

            <CalendarCheck onClick={() => { router.push("/habbitTracker") }} size={40} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />

            <NotebookPen onClick={() => { router.push("/") }} size={35} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />

             <DropdownMenu>
                <DropdownMenuTrigger>
                <Bookmark size={40} className='p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                {labels && labels.filter(label => label.name !== "archived" && label.name !== "deleted").map(label => 
                    
                    <p onClick={() => {
                        const url = label._id
                        router.push(`/notes/${url}`)
                    }} className=" text-sm hover:bg-neutral-600 rounded-[5px] text-center" key={label._id}>{label.name}</p>)}
            </DropdownMenuContent>
            </DropdownMenu>



                
            <Archive onClick={()=>{ ;router.push('/notes/archived')}} size={35} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />

            <Trash2 onClick={()=>{ ;router.push('/notes/deleted')}} size={35} className=' p-2 rounded-xl ease-in-out duration-300 hover:bg-neutral-800 hover:drop-shadow-2xl active:bg-neutral-700' />


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
*/