'use client'
import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogAction } from '@/components/ui/alert-dialog';
import { AlertDialogCancel } from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const HabbitSettings = ({ type, habbitName, bestOptionFromDb, categoryIndex, elementIndex, handleEditChange, options, shouldBeDoneFromDb , importanceFromDb }) => {

    const getBestOptionText = (be) => {
        if (type == 'numberInput') {
           return be ? be : "set target number"
        }
        if (type == 'select') {
          return  be ? be : "select the best option"
        }
    }

    
    const getImportanceText=(imp)=>{
        switch(imp){
            case 0.5 :
                return " Minor (1/5)"
            case 0.625 : 
                return "Moderate (2/5)"
             case 0.75 : 
                return "Important (3/5)"
            case 0.875 : 
                return "Critical (4/5)"
            case 1 : 
                return "Essential (5/5)"
        }
    }

    const [currentBestOption , setCurrentBestOption] = useState(getBestOptionText(bestOptionFromDb)) //UI STATE
    const [currentImportance , setCurrentImportance] = useState(importanceFromDb || 0.75)
    const [currentShouldBeDone , setCurrentShouldBeDone] = useState(shouldBeDoneFromDb)

    const handleSubmition = ()=>{
        handleEditChange(categoryIndex , elementIndex , undefined , currentBestOption , currentImportance , currentShouldBeDone  )
    }
        

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Settings
                    className="lg:hidden lg:group-hover:block block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1"
                    size={18}
                />
            </AlertDialogTrigger>
            <AlertDialogContent
                style={{ borderRadius: "15px" }}
                className="bg-neutral-600 border-none shadow-none flex flex-col gap-6 p-4 items-center"
            >
                <p className="text-center">Edit the settings of {habbitName}</p>

                <div className="w-full">
                    {type == 'numberInput' && <label className="flex justify-between items-center w-full">
                        <span>Set Target Number</span>
                        <input
                            style={{ borderRadius: "5px" }}
                            className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 lg:p-1 w-[15%] text-center h-6 focus:outline-none"
                            type="number"
                            defaultValue={currentBestOption}
                            onChange={(e)=>{setCurrentBestOption(e.target.value)}}
                        />
                    </label>}

                </div>

                <div className="w-full">
                    {type == 'select' && <label className="flex justify-between items-center w-full">
                        <span>Select The Best option</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                >
                                    {currentBestOption} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                {
                                    options && options.map(o =>
                                        <div
                                            style={{ borderRadius: "6px" }}
                                            className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                            onClick={()=>{setCurrentBestOption(o)}}
                                        >
                                            {o}
                                        </div>
                                    )
                                }


                            </DropdownMenuContent>
                        </DropdownMenu>
                    </label>}

                </div>

                <div className="w-full">
                    <label className="flex justify-between items-center w-full">
                        <span>How Important is this habbit</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                >
                                    {getImportanceText(currentImportance)} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentImportance(0.5)}}
                                >
                                    Minor (1/5)
                                </div>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentImportance(0.625)}}

                                >
                                    Moderate (2/5)
                                </div>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentImportance(0.75)}}

                                >
                                    Important (3/5)
                                </div>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentImportance(0.875)}}

                                >
                                    Critical (4/5)
                                </div>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentImportance(1)}}

                                >
                                    Essential (5/5)
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </label>
                </div>

                <div className="w-full">
                    {type == 'checkList' && <label className="flex justify-between items-center w-full">
                        <span>This Habit Should Be Done Or Should Be Avoided</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                >
                                    {currentShouldBeDone ==true ? "should be done" : "should be avoided"} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentShouldBeDone(true)}}
                                >
                                    Should Be Done
                                </div>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                    onClick={()=>{setCurrentShouldBeDone(false)}}
                                >
                                    Should Be Avoided
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </label>}

                </div>
             <div className='flex gap-2'>
                <AlertDialogAction
                    className="px-4 py-1 bg-green-600 hover:bg-green-800 ease-in-out duration-300 rounded-xl"
                    onClick={()=>{
                        handleSubmition()
                    }}
                >
                    Save Settings
                </AlertDialogAction>
                <AlertDialogCancel  className='px-4 py-1 bg-neutral-300 text-black hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'>Cancel</AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default HabbitSettings




//        <AlertDialogCancel  className='px-4 py-1 bg-neutral-300 text-black hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'>Cancel</AlertDialogCancel>
