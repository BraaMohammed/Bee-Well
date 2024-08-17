'use client'
import React from 'react'
import { CiSquareRemove } from "react-icons/ci";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
);




const CardFocused = () => {
    return (
        <div className=" flex justify-center items-center min-h-svh bg-slate-600 ">
            <div className=' fixed w-full h-full min-h-svh bg-neutral-800 z-30 flex items-center bg-opacity-60 justify-center overflow-y-scroll '>

                <div className=" bg-neutral-700 max-w-[350px]   my-10 flex gap-1 flex-col rounded-xl justify-center py-8 px-4 hover:bg-neutral-800 ease-in-out duration-500 drop-shadow-2xl hover:drop-shadow-2xl  scale-[1.8]  ">
                    <div className=" flex gap-2">
                        <CiSquareRemove size={25} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40"></CiSquareRemove>
                    </div>
                    <h1 className=" font-semibold text-xl md:text-xl">This Is My First Note Heading</h1>
                    <Editor toolbarOnFocus toolbarClassName="scale-50 w-[600px] bg-neutral-700 self-center text-base  " wrapperClassName="flex flex-col justify-start gap-0 text-base  " />
                    <div className="flex justify-between text-gray-400">
                        <p className=" text-sm scale-50">7 Octber 23</p> <p className=" text-sm scale-50 ">Label One</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CardFocused




//import { CiEdit } from "react-icons/ci";
//top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[1.8]

//w-[600px] -translate-x-40

//<input className='appearance-none' placeholder="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit corrupti ducimus, repellat voluptates alias, unde harum amet iure culpa, repellendus at quod magnam eos ea. Quia quibusdam id odio laboriosam." />