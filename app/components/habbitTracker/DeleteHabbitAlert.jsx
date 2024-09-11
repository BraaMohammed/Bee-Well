import React from 'react'
import {
    AlertDialog, 
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { AlertDialogCancel } from '@/components/ui/alert-dialog';
import { IoMdClose } from "react-icons/io";
import { useState } from 'react';


const DeleteHabbitAlert = ({habbitName , handleDeleteTrackedHabbit , categoryIndex , elementIndex}) => {

  return (
    <AlertDialog>
    <AlertDialogTrigger>
        <IoMdClose className=" lg:hidden block lg:group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />
    </AlertDialogTrigger>
    <AlertDialogContent  style={{ borderRadius: "15px" }} className=" bg-neutral-600 border-none justify-center items-center shadow-none">
        <p className=' text-center' >Are You Sure To Delete {habbitName} ? </p>
        <p className=' text-center'>This Action Cannot Be Undone And Will Remove The Habbit's Tracked Data </p>
        <AlertDialogAction onClick={()=>{handleDeleteTrackedHabbit(categoryIndex , elementIndex) }} className='px-4 py-1 bg-red-600 hover:bg-red-800 ease-in-out duration-300 rounded-xl'>Delete {habbitName} </AlertDialogAction>
        <AlertDialogCancel  className='px-4 py-1 bg-neutral-300 text-black hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'>Cancel</AlertDialogCancel>
    </AlertDialogContent>
</AlertDialog>

  )
}

export default DeleteHabbitAlert