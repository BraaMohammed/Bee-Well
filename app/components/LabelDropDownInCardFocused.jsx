'use client'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoIosArrowDropdown } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import getLabels from '../actions/getLabels';
import { useEffect } from 'react';
import { useState } from 'react';
import createLabel from '../actions/createLabel';
//import { Input } from "@/components/ui/input"
import { IoMdClose } from "react-icons/io";
import {
    AlertDialog, 
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import deleteLabel from '../actions/deleteLabel';
import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { AlertDialogCancel } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';



const LabelDropDownInCardFocused = ({ setCurrentLabel, labelFromDb, id , refreshFunction }) => {

    const [labels, setLabels] = useState([]) //the labels we get from the db 
    const [selectedLabel, setSelectedLabel] = useState(labelFromDb || "choose a label or create new") // ui state to show in the label field
    const [showCreatLabel, setShowCreatLabel] = useState(false) //for showing the create new label input field
    const [newLabelName, setNewLabelName] = useState("") // state for the new label name 
    const [newLabelSubmited, setNewLabelSubmited] = useState(false) // state changed when the submit button is clicked so we can refetch the labels 
    // const [showDeletingAlert , setShowDeletingAlert] = useState(false)
    const { toast } = useToast()

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
    useEffect(
        () => {
            
            fetchLabels()
        }, [newLabelSubmited]
    )

    return (
        <div className=' z-50'>
            <DropdownMenu>
                <DropdownMenuTrigger><div className='flex justify-center items-center gap-2 mt-3 hover:opacity-50 ease-in-out duration-300 active:opacity-30 text-lg  '>{selectedLabel} <IoIosArrowDropdown size={25} />  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" z-50 bg-neutral-700 rounded-xl border-none drop-shadow-xl shadow-neutral-600">
                    {labels.filter(label => label.name !== "deleted").map(label => (
                        <DropdownMenuItem className="  hover:opacity-60 ease-in-out duration-300 flex gap-2 justify-between" key={label._id} >
                            <p onClick={(e) => {
                                setSelectedLabel(label.name)
                                setCurrentLabel(label.name) 
                                if(label.name== "archived" || label.name== "deleted"){
                                    toast({
                                        description: `the note have been moved to ${label.name}`,
                                      })
                                }
                                e.stopPropagation()


                            }}>{label.name}</p>
                            <AlertDialog>
                                <AlertDialogTrigger onClick={(e) => { e.stopPropagation() }}>
                                    <IoMdClose size={15} className=' hover:text-red-500' />
                                </AlertDialogTrigger>
                                <AlertDialogContent style={{ borderRadius: "15px" }} className=" bg-neutral-600 border-none justify-center items-center shadow-none">
                                    <p>Are You Sure To Delete {label.name} ? </p>
                                    <p className=' text-center'>This Action Cannot Be Undone </p>
                                    <button onClick={()=>{deleteLabel(label._id);  fetchLabels() }} className='px-4 py-1 bg-red-600 hover:bg-red-800 ease-in-out duration-300 rounded-xl'>Delete {label.name} </button>
                                    <button className='px-4 py-1 bg-neutral-300 text-black hover:outline-none hover:border-none hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'>Cancel</button>
                                </AlertDialogContent>
                            </AlertDialog>

                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem onClick={(e) => { e.preventDefault(); setShowCreatLabel(true) }} className="  hover:opacity-60 ease-in-out duration-300 flex gap-2">Add A Label <IoAdd size={15} /> </DropdownMenuItem>
                    {showCreatLabel &&
                        <>
                            <input onChange={(event) => { setNewLabelName(event.target.value) }} className=' text-sm px-2 max-w-24 max-h-8 bg-transparent border-[1px] border-solid  border-neutral-100 rounded-xl focus:outline-dashed' />
                            <button onClick={() => { createLabel({ id: id, labelName: newLabelName }); setNewLabelSubmited(!newLabelSubmited); setShowCreatLabel(false) }} className=' text-sm bg-neutral-100 text-neutral-700 py-[0.5px] px-[6px] mx-1 rounded-xl hover:opacity-50 ease-in-out duration-300 active:opacity-30'>Submit</button>
                        </>}

                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    )
}

export default LabelDropDownInCardFocused