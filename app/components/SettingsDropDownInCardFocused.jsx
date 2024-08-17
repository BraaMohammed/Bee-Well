"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IoIosAddCircleOutline } from "react-icons/io";
import { SlOptions } from "react-icons/sl";
//import archiveNote from '../actions/archiveNote';
import ColorPicker from './ColorPicker';

const SettingsDropDownInCardFocused = ({ id, setCurrentLabel , setBackgroundColor ,backgroundColorFromDb }) => {
    return (
        <div>
            <div className=' z-50'>
                <DropdownMenu>
                    <DropdownMenuTrigger> <SlOptions className='hover:opacity-50 ease-in-out duration-300 active:opacity-30' size={22} />  </DropdownMenuTrigger>
                    <DropdownMenuContent className=" z-50 bg-neutral-700 rounded-xl border-none drop-shadow-xl shadow-neutral-600">
                        <DropdownMenuItem ><ColorPicker backgroundColorFromDb={backgroundColorFromDb} setBackgroundColor={setBackgroundColor} /></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setCurrentLabel("archived") }} className="  hover:opacity-60 ease-in-out duration-300">Arcive The Note</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default SettingsDropDownInCardFocused