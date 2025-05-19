import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useEffect } from 'react'


const HabbitPicker = ({ trackedHabbitsFromDb, setSelectedHabbitsAnalytics , setSelectedCategoryAnalytics }) => {

    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedHabbit, setSelectedHabbit] = useState("")
    const [ca, setCa] = useState(null); // State to store the selected category data


    const handleHabbitSelection = (h) => {
        setSelectedHabbit(h)
        setSelectedHabbitsAnalytics(h)
    }

    useEffect(
        () => {
            if (selectedCategory !== null && trackedHabbitsFromDb) {
                const selectedCa = trackedHabbitsFromDb.habbits.find(a => a.categoryName === selectedCategory);
                setCa(selectedCa); // 
            }
        }, [selectedCategory]
    )

    return (
        <div className='flex flex-col gap-3'>
            <DropdownMenu >
                <DropdownMenuTrigger className='flex ease-in-out duration-300 items-center justify-center rounded-xl px-2 hover:bg-neutral-600 hover:text-white'>{selectedCategory || "Pick A Category"}<ChevronDown /> </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                    {trackedHabbitsFromDb && trackedHabbitsFromDb.habbits.map(h =>
                        <div onClick={() => { setSelectedCategory(h.categoryName) ; setSelectedCategoryAnalytics(h.categoryName) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>{h.categoryName}</div>
                    )}


                </DropdownMenuContent>
            </DropdownMenu>
            {
                selectedCategory !== null &&
                <DropdownMenu >
                    <DropdownMenuTrigger className='flex ease-in-out duration-300 items-center rounded-xl px-2 hover:bg-neutral-600 hover:text-white'>{selectedHabbit || "Select A Habbit"} <ChevronDown /> </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                        {
                            ca !== null && ca.elements.map(e =>
                                e.type !== "textArea" &&
                                <div onClick={() => { handleHabbitSelection(e.text) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>{e.text}</div>
                            )
                        }

                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </div>
    )
}

export default HabbitPicker



///open={open} onOpenChange={setOpen}