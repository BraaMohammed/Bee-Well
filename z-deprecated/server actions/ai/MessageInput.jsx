"use client"
import React from 'react'
import { BsSend } from "react-icons/bs";
import { useChat } from 'ai/react';


const MessageInput = () => {
  const {input, handleInputChange, handleSubmit } = useChat();


  return (
    <div className=' flex gap-2 self-center sticky pb-2 justify-center bottom-0  rounded-2xl w-full  '>
         <textarea value={input} onChange={handleInputChange} className='rounded-2xl max-h-[20vh] focus:right-0 focus:outline-none focus:drop-shadow-2xl shadow-neutral-600 ease-in-out duration-300 shadow-2xl lg:w-96 text-black p-2 scrollbar-thin '></textarea>
          <button onClick={handleSubmit} className='bg-green-500 rounded-full w-10 h-10 flex justify-center items-center ease-in-out duration-300 shadow-lg hover:opacity-70 active:opacity-55'><BsSend/></button>
    </div>
  )
}

export default MessageInput