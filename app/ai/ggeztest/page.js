"use client"
import Sidebar from "@/app/components/Sidebar"
import UserMessage from "@/app/components/ai/UserMessage"
import AiMessage from "@/app/components/ai/AiMessage"
import MessageInput from "@/app/components/ai/MessageInput"
import Image from "next/image"
import { useState } from "react"
import { HiOutlineMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { IoIosAddCircleOutline } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
import AllMessages from "@/app/components/ai/AllMessages"



export default function Home() {

    const [sideBarIsOpened, setSideBarIsOpened] = useState(true)

    let chatLayout = sideBarIsOpened ? "row " : "column"
    let sideBarStyle = sideBarIsOpened
        ? "bg-neutral-800 rounded-2xl lg:rounded-none lg:rounded-l-2xl flex-1 z-20 h-full min-w-56 max-w-56 absolute left-0 top-0 transform translate-x-0 opacity-100 transition-all duration-300 ease-in-out sm:relative flex flex-col items-center py-10 px-5"
        : "bg-neutral-800 flex-1 z-20 h-full min-w-56 max-w-56 absolute left-0 top-0 transform -translate-x-full opacity-0 pointer-events-none transition-all duration-300 ease-in-out";
    let openingSideBarButtonStyle = sideBarIsOpened
        ? "hidden"
        : "ml-6 visible transform translate-x-0 transition-all duration-300 ease-in-out";
    let containerStyle = "flex w-full h-full relative transition-all duration-300 ease-in-out";
    let aiBarStyle = sideBarIsOpened ? "bg-green-600 h-24 w-full flex items-center gap-2 rounded-t-2xl lg:rounded-tr-2xl lg:rounded-tl-none  " : "bg-green-600 h-24 w-full flex items-center gap-2 rounded-t-xl"
    return (

        <>
            <div className="flex flex-col bg-neutral-400 lg:h-screen h-full ">
                <Sidebar />
                <div className="lg:ml-[15vw] flex flex-1 items-center gap-0 p-10 rounded-2xl lg:max-h-screen ">
                    <div style={{ flexDirection: chatLayout }} className={containerStyle}>

                        <div className={sideBarStyle}>
                            <IoMdClose className=" hover:text-red-800 ease-in-out duration-300" size={40} onClick={() => setSideBarIsOpened(false)} />

                            <div className="flex flex-col h-[70%] justify-evenly ">
                            <button className="bg-green-500 px-4 py-1 rounded-full ease-in-out duration-300 flex text-sm justify-center items-center gap-2 hover:bg-green-600 active:opacity-70">New Chat <IoIosAddCircleOutline size={30}/> </button>

                                <span className=" lg:text-lg font-semibold flex flex-col gap-3">
                                    current chat
                                    <p className=" text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center hover:bg-green-500"> current chat name </p>

                                </span>

                                <span className=" lg:text-lg font-semibold flex flex-col gap-3">
                                    old chats
                                    <p className=" flex gap-2 items-center text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center group hover:bg-green-500"> old chat name <SlOptions size={20} className=" hidden group-hover:block "/> </p>
                                    <p className=" flex gap-2 items-center text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center group hover:bg-green-500"> old chat name <SlOptions size={20} className=" hidden group-hover:block "/> </p>
                                    <p className=" flex gap-2 items-center text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center group hover:bg-green-500"> old chat name <SlOptions size={20} className=" hidden group-hover:block "/> </p>
                                    <p className=" flex gap-2 items-center text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center group hover:bg-green-500"> old chat name <SlOptions size={20} className=" hidden group-hover:block "/> </p>
                                </span>


                            </div>
                        </div>

                        <div className="w-full flex flex-col flex-1 h-full ">
                            <div className={aiBarStyle}>
                                <HiOutlineMenu size={40} className={openingSideBarButtonStyle} onClick={() => setSideBarIsOpened(true)} />
                                <div className=" flex gap-2 self-center lg:ml-12 ml-4 ">
                                    <Image quality={100} src="/don.jpg" alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl " />
                                    <div>
                                        <h1 className=" lg:text-3xl font-semibold"> Ai Assistant</h1>
                                        <p className=" text-sm">say hello to your ai friend !</p>
                                    </div>
                                </div>
                            </div>
                            <div className=" bg-neutral-300 px-2 pt-4 lg:px-4 rounded-b-xl w-full flex-1 flex-col lg:overflow-y-scroll flex z-10 relative scrollbar-thin">
                                <AllMessages/>
                                <MessageInput />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )



}


//max width ai h1 : <div className=" w-full bg-green-600 h-24"></div>

//opened sidebar :   <div className=" bg-green-900 h-full w-56">






















/*
working backup 



full my code *almost*


    const [sideBarIsOpened, setSideBarIsOpened] = useState(true)

    let chatLayout = sideBarIsOpened ? "row " : "column"
    let sideBarStyle = sideBarIsOpened ? "bg-neutral-800 rounded-2xl lg:rounded-none lg:rounded-l-2xl flex-1 z-20 h-full min-w-56 max-w-56 absolute left-0 top-0 ease-in-out translate-x-0 duration-300 sm:relative flex flex-col items-center py-10 px-5 " : "bg-neutral-800 flex-1 z-20 h-full min-w-56 max-w-56 absolute ease-in-out -translate-x-full hidden -z-20"
    let openingSideBarButtonStyle = sideBarIsOpened ? "hidden" : "ml-6 visible"
    let containerStyle = sideBarIsOpened ? " flex w-full h-full relative transition-all ease-in-out duration-700" : " flex w-full h-full transition-all ease-in-out duration-700 "
    let aiBarStyle = sideBarIsOpened ? "bg-green-600 h-24 w-full flex items-center gap-2 rounded-t-2xl lg:rounded-tr-2xl lg:rounded-tl-none  " : "bg-green-600 h-24 w-full flex items-center gap-2 rounded-t-xl"
    return (

        <>
            <div className="flex flex-col bg-neutral-400 lg:h-screen h-full ">
                <Sidebar />
                <div className="lg:ml-[15vw] flex flex-1 items-center gap-0 p-10 rounded-2xl lg:max-h-screen ">
                    <div style={{ flexDirection: chatLayout }} className={containerStyle}>

                        <div className={sideBarStyle}>
                            <IoMdClose size={40} onClick={() => setSideBarIsOpened(false)} />
                            <div className="flex flex-col h-[50%] justify-evenly ">
                                <span className=" lg:text-lg font-semibold flex flex-col gap-3">
                                    current chat
                                    <p className=" text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center hover:bg-green-500"> current chat name</p>

                                </span>

                                <span className=" lg:text-lg font-semibold flex flex-col gap-3">
                                    old chats
                                    <p className=" text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center hover:bg-green-500"> old chat name</p>
                                    <p className=" text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center hover:bg-green-500"> old chat name</p>
                                    <p className=" text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center hover:bg-green-500"> old chat name</p>
                                    <p className=" text-sm rounded-[4px] font-light active:opacity-60 p-2 ease-in-out duration-300 w-full text-center hover:bg-green-500"> old chat name</p>
                                </span>


                            </div>
                        </div>

                        <div className="w-full flex flex-col flex-1 h-full ">
                            <div className={aiBarStyle}>
                                <HiOutlineMenu size={40} className={openingSideBarButtonStyle} onClick={() => setSideBarIsOpened(true)} />
                                <div className=" flex gap-2 self-center lg:ml-12 ml-4 ">
                                    <Image  quality={100}  src="/don.jpg" alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl " />
                                    <div>
                                        <h1 className=" lg:text-3xl font-semibold"> Ai Assistant</h1>
                                        <p className=" text-sm">say hello to your ai friend !</p>
                                    </div>
                                </div>
                            </div>
                            <div className=" bg-neutral-300 px-2 pt-4 lg:px-4 rounded-b-xl w-full flex-1 flex-col lg:overflow-y-scroll flex z-10 relative scrollbar-thin">
                                <div className="flex flex-col gap-6 mb-3 ">
                                    <UserMessage />
                                    <AiMessage />
                                    <UserMessage />
                                    <AiMessage />
                                    <UserMessage />
                                    <AiMessage />
                                </div>
                                <MessageInput />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
















*/