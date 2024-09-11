"use client"
/*import { BsStars } from "react-icons/bs";
import { FaArchive } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { LiaDumbbellSolid } from "react-icons/lia";
import { MdLabelImportantOutline } from "react-icons/md";
import { FaRegNoteSticky } from "react-icons/fa6";*/
import Button from "./Button";
import { useSession } from "next-auth/react"
import { IoIosAddCircleOutline } from "react-icons/io";
import { useState } from "react";
import CardFocuesdTwo from "./CardFocuesdTwo";
import { createPortal } from "react-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import Image from "next/image";
import { useEffect } from "react";
import getLabels from "../actions/getLabels";
import { useRouter } from "next/navigation";
import SidebarMobile from "./SidebarMobile";
import dynamic from 'next/dynamic';
const EditorTwo = dynamic(() => import("@/app/components/blocknoteEditor/BlockNoteEditor"), { ssr: false });
import { CalendarCheck } from "lucide-react";
import { Archive } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Bookmark } from "lucide-react";
import { NotebookPen } from "lucide-react";


const Sidebar = ({ refreshFunction }) => {

    const { data: session, status } = useSession()
    const [renderNewNote, setRenderNewNote] = useState(false)
    const [labelIsClicked, setLabelIsClicked] = useState(false)
    const [labels, setLabels] = useState([])
    const router = useRouter()


    let userName
    let userPhoto
    if (session) {
        userName = session.user.name
        userPhoto = session.user.image
    }

    const handleClose = () => {
        setRenderNewNote(false);
    };


    useEffect(
        () => {
            const fetchLabels = async () => {
                try {
                    const res = await getLabels()
                    const labelsFromDb = JSON.parse(res)
                    setLabels(labelsFromDb)
                    console.log("fetched success!!")


                } catch (err) {
                    console.log(err)
                    console.log("fetched did not success!!")

                }
            }
            fetchLabels()
        }, []
    )


    return (
        <div>
        <div className=" hidden bg-neutral-600 lg:flex flex-col w-[15vw] max-h-full h-screen fixed left-0 top-0 gap-0 justify-between p-6 pt-1 ">
             
            <img src="/logo.png" alt="logo" className=" size-36 max-w-36 self-center drop-shadow-2xl mt-2  -mb-2 shadow-white " />
            <div className=" self-center flex justify-center flex-col gap-8">
                <button onClick={() => setRenderNewNote(true)} className="max-w-64 flex justify-center items-center gap-2 px-4 py-0.5 rounded-full text-sm hover:bg-green-500 active:opacity-60 ease-in-out duration-300 bg-green-600 ">Add A Note <IoIosAddCircleOutline size={36} /></button>
            </div>


            <p onClick={() => { router.push("/") }} className="flex gap-2 p-2 rounded-xl  hover:bg-neutral-950 ease-in-out duration-200 text-sm " ><NotebookPen size={23} />My Notes</p>

            <div onClick={() => { setLabelIsClicked(!labelIsClicked) }} className="flex flex-col gap-2 p-2 rounded-xl  hover:bg-neutral-950 ease-in-out duration-200 text-sm group" >

                <p className=" flex  gap-2 ">  <Bookmark size={24} /> My Labels <RiArrowDropDownLine className="hidden group-hover:block" size={25} /></p>

                <div className=" flex flex-col gap-1">
                    {labelIsClicked && labels.filter(label => label.name !== "archived" && label.name !== "deleted").map(label => 
                    
                    <p onClick={() => {
                        const url = label._id
                        router.push(`/notes/${url}`)
                    }} className=" text-sm hover:bg-neutral-600 rounded-[5px] text-center" key={label._id}>{label.name}</p>)}
                </div>
            </div>
            <p onClick={() => { router.push("/habbitTracker") }} className="flex gap-2 p-2 rounded-xl  hover:bg-neutral-950 ease-in-out duration-200 text-sm " ><CalendarCheck size={24} />Habit Tracker</p>

            <p onClick={()=>{ ;router.push('/notes/archived')}} className="flex gap-2 p-2 rounded-xl  hover:bg-neutral-950 ease-in-out duration-200 text-sm " ><Archive size={22} />Archieves</p>

            <p onClick={()=>{ ;router.push('/notes/deleted')}} className="flex gap-2 p-2 rounded-xl  hover:bg-neutral-950 ease-in-out duration-200 text-sm " ><Trash2 size={22} />Deleted Notes</p>


            <div className="user panel flex flex-col gap-4 items-center">
                <div className="flex items-center gap-4 w-full justify-center" >
                    <Image src={userPhoto === undefined || null ? "/don.jpg" : userPhoto} alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl" />
                    <div>
                        <p className=" text-sm">{userName}</p>
                    </div>
                </div>
                <Button text="Sign Out" icon="signOut" color="bg-neutral-800" />
            </div>


            {renderNewNote && createPortal(
                <CardFocuesdTwo refreshFunction={refreshFunction} onClose={handleClose} isNewNote={true} />,
                document.body
            )}
        </div>
        <SidebarMobile labels={labels} refreshFunction={refreshFunction} userPhoto={userPhoto} />
        </div>

    )
}

export default Sidebar



//                <CardFocuesdTwo refreshFunction={refreshFunction} onClose={handleClose} isNewNote={true} />,



//<RiArrowDropDownLine className="invisible hover:visible inline-flex " />






//  add a label button              <Button text="Add A Label" icon="addLabel" color="bg-green-900" />


//             <p className="flex gap-2 p-2 rounded-xl   hover:bg-neutral-950 ease-in-out duration-200 text-sm " ><BsStars size={23} />Talk To Your Ai Freind</p>













/*<div className="labels cont  flex flex-col gap-y-6 py-32 ">
                <p className=" p-2 hover:bg-orange-400 rounded-2xl text-center ease-in-out duration-300"> Baseball ⚾ </p>
                <p className=" p-2 hover:bg-orange-400 rounded-2xl text-center ease-in-out duration-300"> Studying 📖 </p>
                <p className=" p-2 hover:bg-orange-400 rounded-2xl text-center ease-in-out duration-300"> Gym 💪 </p>
                <p className=" p-2 hover:bg-orange-400 rounded-2xl text-center ease-in-out duration-300"> Time Mangment ⏱️ </p>
            </div>*/


/*const handleSignOut = ()=>{
signOut({ callbackUrl: '/signin' })
console.log(status)



<Button text="Add A Note" icon="addNote" color="bg-green-600" />
}*/
