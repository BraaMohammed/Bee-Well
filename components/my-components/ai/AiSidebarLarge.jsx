"use client"
import React from 'react'
import { useState } from 'react'
import Image from 'next/image'
const AiSidebarLarge = () => {
    const [showSideBar, setShowSideBar] = useState(true)

    return (
        <> 
           <div className=' relative z-10'>
            <div className='flex  flex-1 absolute inset-x-0  '>
                {showSideBar ? <div className=' bg-green-950 max-w-56 min-h-[91.5vh] flex flex-col items-center justify-evenly'>

                    <button onClick={() => { setShowSideBar(false) }} className=' px-6 py-2 bg-green-200 rounded-xl flex justify-center items-center'>hide</button>
                    <button className=' px-6 py-2 bg-green-200 rounded-xl flex justify-center items-center'>create a new chat</button>

                    <div>recent chats #1</div>
                    <div>recent chats #2</div>
                    <div>recent chats #3</div>
                    <div>recent chats #4</div>
                    <div>recent chats #5</div>

                </div> : <button className=' px-6 py-2 bg-green-200 rounded-xl flex justify-center items-center' onClick={() => { setShowSideBar(true) }}> show side bar</button>}
                <div className=" aiAssistantIdentification flex max-h-24 w-full  bg-green-500  ">
                    <Image src="/don.jpg" alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl" />
                    <div>
                        <h1 className=" text-xl font-bold">Your Ai Assistant</h1>
                        <p> say  hello to your ai friend !</p>
                    </div>

                </div>
            </div>
            </div>
        </>
    )
}

export default AiSidebarLarge




/*


<>
        {showSideBar ?
                <div className=' bg-green-950 max-w-[12vw] min-h-[91.5vh] flex flex-col items-center justify-evenly'>

                    <button onClick={() => { setShowSideBar(false) }} className=' px-6 py-2 bg-green-200 rounded-xl flex justify-center items-center'>hide</button>
                    <button className=' px-6 py-2 bg-green-200 rounded-xl flex justify-center items-center'>create a new chat</button>

                    <div>recent chats #1</div>
                    <div>recent chats #2</div>
                    <div>recent chats #3</div>
                    <div>recent chats #4</div>
                    <div>recent chats #5</div>

                </div>
                : <button className=' px-6 py-2 bg-green-200 rounded-xl flex justify-center items-center'  onClick={() => { setShowSideBar(true) }}> show side bar</button>}
            <div className=" aiAssistantIdentification flex  bg-green-500 w-full ">
                <Image src="/don.jpg" alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl" />
                <div>
                    <h1 className=" text-xl font-bold">Your Ai Assistant</h1>
                    <p> say  hello to your ai friend !</p>
                </div>
            </div>
            
        </>



*/