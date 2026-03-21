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
import { useEffect, useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import {
    AlertDialog, 
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getLabels } from '@/actions/getLabels';
import { deleteLabel } from '@/actions/deleteLabel';
import { useToast } from '@/hooks/use-toast';
import { createLabel } from '@/actions/createLabel';
const LabelDropDownInCardFocused = ({ setCurrentLabel, labelFromDb, id , refreshFunction, setIsHeadingEditable }) => {

    const [labels, setLabels] = useState([]) //the labels we get from the db 
    const [selectedLabel, setSelectedLabel] = useState(labelFromDb || "choose a label or create new") // ui state to show in the label field

    // Sync selected label if it arrives asynchronously from the db
    useEffect(() => {
        if (labelFromDb) {
            setSelectedLabel(labelFromDb)
        }
    }, [labelFromDb])
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [newLabelName, setNewLabelName] = useState("") // state for the new label name 
    const [newLabelSubmited, setNewLabelSubmited] = useState(false) // state changed when the submit button is clicked so we can refetch the labels
    // const [showDeletingAlert , setShowDeletingAlert] = useState(false)
    const { toast } = useToast()

    const fetchLabels = async () => {
        try {
            const res = await getLabels()
            if (res) {
                setLabels(res)
                console.log("fetched success!!")
            }


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
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger><div className='flex justify-center items-center gap-2 mt-3 hover:opacity-50 ease-in-out duration-300 active:opacity-30 text-lg  '>{selectedLabel} <IoIosArrowDropdown size={25} />  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className=" z-50 bg-neutral-700 rounded-xl border-none drop-shadow-xl shadow-neutral-600">
                    {labels.filter(label => label.name !== "deleted").map(label => (
                        <DropdownMenuItem className="  hover:opacity-60 ease-in-out duration-300 flex gap-2 justify-between" key={label.id} >
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
                                    <button onClick={()=>{deleteLabel(label.name);  fetchLabels() }} className='px-4 py-1 bg-red-600 hover:bg-red-800 ease-in-out duration-300 rounded-xl'>Delete {label.name} </button>
                                    <button className='px-4 py-1 bg-neutral-300 text-black hover:outline-none hover:border-none hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'>Cancel</button>
                                </AlertDialogContent>
                            </AlertDialog>

                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem 
                        onSelect={(e) => { 
                            e.preventDefault(); 
                            setIsDropdownOpen(false); 
                            setIsCreateDialogOpen(true);
                        }} 
                        className="hover:opacity-60 ease-in-out duration-300 flex gap-2"
                    >
                        Add A Label <IoAdd size={15} /> 
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            {isCreateDialogOpen && (
                <div 
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
                    onClick={(e) => { e.stopPropagation(); setIsCreateDialogOpen(false); }}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div 
                        className="bg-neutral-600 flex flex-col gap-4 w-[90%] sm:max-w-[425px] shadow-2xl p-6 rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        <p className="font-semibold text-lg text-white">Create New Label</p>
                        <input 
                            autoFocus
                            onPointerDown={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                                e.stopPropagation();
                                if (e.key === 'Enter' && newLabelName.trim()) {
                                    createLabel({ id: id, labelName: newLabelName, color: '#6b7280' });
                                    setNewLabelSubmited(!newLabelSubmited);
                                    setIsCreateDialogOpen(false);
                                    setNewLabelName("");
                                }
                                if (e.key === 'Escape') {
                                    setIsCreateDialogOpen(false);
                                }
                            }} 
                            onChange={(event) => setNewLabelName(event.target.value)} 
                            value={newLabelName}
                            className='text-sm px-4 py-2 mt-2 w-full bg-neutral-700 border border-neutral-500 rounded-xl focus:outline-none focus:border-neutral-300 text-neutral-100 placeholder:text-neutral-400' 
                            placeholder="Type label name..."
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsCreateDialogOpen(false); }} 
                                className='px-4 py-2 bg-neutral-500 text-white hover:bg-neutral-400 ease-in-out duration-300 rounded-xl'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(newLabelName.trim()) {
                                        createLabel({ id: id, labelName: newLabelName, color: '#6b7280' }); 
                                        setNewLabelSubmited(!newLabelSubmited); 
                                        setIsCreateDialogOpen(false); 
                                        setNewLabelName("");
                                    }
                                }} 
                                disabled={!newLabelName.trim()}
                                className='px-4 py-2 bg-neutral-100 text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white ease-in-out duration-300 rounded-xl'
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LabelDropDownInCardFocused