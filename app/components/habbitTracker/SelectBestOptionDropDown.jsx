import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MdDone } from "react-icons/md";
import { useState } from 'react';


const SelectBestOptionDropDown = ({ bestOptionFromDb, categoryIndex , elementIndex, options , handleEditChange }) => {
    const [open, setOpen] = useState(false);
    const [bestOption, setBestOption] = useState(bestOptionFromDb || "You didnt choose the target yet ! ")
    console.log(bestOption)

    const handleSelection = (selectedBestOption, isTyped) => {
        setBestOption(selectedBestOption);
        handleEditChange(categoryIndex , elementIndex , undefined , selectedBestOption )
        if (!isTyped) {
            setOpen(false);
        }
        // Close the dropdown
    };
    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className='flex flex-col gap-2'>
                    <button className="max-w-64 flex justify-center items-center gap-2 px-4 py-0.5 rounded-full text-sm hover:bg-green-700 active:opacity-60 ease-in-out duration-300 bg-green-600">
                        Click To Edit The Target
                    </button>
                    Current Target :  {bestOption}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                    {options &&
                        options.map(o => <div onClick={() => { handleSelection(o, false) }}
                            style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>{o}</div>
                        )}
                    {!options &&
                        <div>
                            <input style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 bg-neutral-600  p-1 focus:border-none focus:outline-none"
                                placeholder="add the target number here" contentEditable="true"
                                onChange={(e) => { handleSelection(e.target.value, true) }}></input>
                                <MdDone onClick={()=>{setOpen(false)}}  className=" hover:text-green-500 ease-in-out duration-300"/>
                        </div>}

                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default SelectBestOptionDropDown