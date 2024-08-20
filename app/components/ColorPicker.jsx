"use client"
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from 'react';
import { RgbaStringColorPicker    } from "react-colorful";
import { useEffect } from 'react';


const ColorPicker = ({setBackgroundColor , backgroundColorFromDb , setCardBackgroundColor}) => {

    const [selectedColor, setSelectedColor] = useState(backgroundColorFromDb); //ui state for the square




    return (
        <div onClick={(e) => e.stopPropagation()} >
            <Dialog>
                <DialogTrigger className="hover:opacity-60 ease-in-out duration-300  ">
                    Change Background Color
                </DialogTrigger>
                <DialogContent style={{borderRadius: "20px"}} className=" bg-white rounded-3xl max-w-[20rem] text-black flex justify-center items-center">
                    <DialogHeader className="flex justify-center items-center">
                        <DialogTitle>Change Background Color</DialogTitle>
                        <DialogDescription>
                            Choose a color for the background.
                        </DialogDescription>
                        <RgbaStringColorPicker color={selectedColor} onChange={setSelectedColor} />
                        <div className='flex gap-2'>Your Selected Color is <div style={{backgroundColor : selectedColor  }} className="w-4 h-4  border-[1px] border-black mt-0.5 " /></div>
                        <button onClick={()=>{ setBackgroundColor(selectedColor) ; setCardBackgroundColor(selectedColor)} } style={{backgroundColor:selectedColor , borderRadius : "15px"} } className=' px-3 py-1 hover:opacity-60 ease-in-out duration-300'>Apply</button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ColorPicker;
