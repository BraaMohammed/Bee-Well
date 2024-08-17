import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from 'react';


const SelectTrackingTypeDropdown = ({ triggerElement, categoryIndex, setAddedNewElement }) => {
    const [open, setOpen] = useState(false);

    const handleSelection = (type) => {
        setAddedNewElement({ type, categoryIndex });
        setOpen(false); // Close the dropdown
    };

    return (
        <div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger>{triggerElement}</DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                    <div onClick={() => handleSelection("checkList")} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>Checkbox</div>
                    <div onClick={() => handleSelection("textArea")} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>Text Area</div>
                    <div onClick={() => handleSelection("select")} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>Options Select</div>
                    <div onClick={() => handleSelection("numberInput")} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>Number Input</div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};


export default SelectTrackingTypeDropdown