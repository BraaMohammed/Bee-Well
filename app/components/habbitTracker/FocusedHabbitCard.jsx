"use client"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { SlOptions } from "react-icons/sl";
import { IoIosAddCircleOutline } from "react-icons/io";
import TrackedHabbitsSetter from "./TrackedHabbitsSetter";
import { useState } from "react";
import { useEffect } from "react";
import { MdDone } from "react-icons/md";
import SelectTrackingTypeDropdown from "./SelectTrackingTypeDropdown";
import EditableHeading from "./EditableHeading";



import React from 'react'

const FocusedHabbitCard = ({ dateFromDb, trackedHabbitsFromDb, setTiggerRefresh , focusOnly ,  open, setOpen , id , entryFromDb  }) => {  // focusOnly indcates that the modal opening trigger is because of day picking in the calender

    const [newCategory, setNewCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("Add The Category Name")
    const [newCategorySubmited, setNewCategorySubmited] = useState(false)
    const [date, setDate] = useState(dateFromDb)
    const [entryFromDbDummyVar , setEntryFromDbDummyVar ] = useState(entryFromDb)
    const [resetStates  , setResetStates] = useState(false)
    const [modalIsOpened , setModalIsOpened] = useState(false)

    // console.log(trackedHabbitsFromDb)
    const handleNewCategoryNameChange = (newValue) => {
        setNewCategoryName(newValue);
    }

    const handleSubmitNewCategory = () => {
        setNewCategory(false);
        setNewCategorySubmited(true);
        setTiggerRefresh(prev => !prev)


    }

    
    const onClose = () => {
       setResetStates(true)
       setNewCategorySubmited(false);
       setOpen(false);
    };

    useEffect(() => {
        if(focusOnly === true){
            setOpen(focusOnly);
        }
    }, [focusOnly, dateFromDb]);

    useEffect(
        ()=>{
            setEntryFromDbDummyVar(entryFromDb)
        } , [entryFromDb]
    )


    return (
        <div>
            <Dialog   open={open} onOpenChange={(isOpen) => {setNewCategorySubmited(false); setResetStates(true) ;  focusOnly == true && setOpen(isOpen); focusOnly == true && !isOpen &&  onClose();  }}  >
                {focusOnly !== true &&
                <DialogTrigger >
                    <CarouselItem onClick={()=>{setModalIsOpened(true)}} >
                        <div className="p-1">
                            <Card className="border-none w-64 bg-neutral-600 shadow-xl shadow-neutral-600 rounded-xl hover:translate-y-5 ease-in-out duration-300  text-neutral-200 hover:bg-neutral-500">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{date}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </DialogTrigger> }
                
            <DialogContent forceMount={false} style={{ borderRadius: "20px" }} className=" bg-neutral-700 border-none focus:outline-none p-10 mx-auto max-w-[85%] lg:max-w-[40%] h-[60%] overflow-y-auto scrollbar-webkit">
                    <div className="flex justify-between ">
                        <div className="flex flex-col gap-2">
                            <h1 className="lg:text-3xl text-2xl font-semibold"> Your Daily Habbits</h1>
                            <p className=" font-extralight"> +1% improvment every day will make you a new person  </p>
                        </div>
                        <div className=" flex flex-col gap-2">
                            <button onClick={() => { setNewCategorySubmited(false); setNewCategory(true) }} className="max-w-64 flex justify-center items-center gap-2 px-4 py-0.5 rounded-full text-sm hover:bg-green-700 active:opacity-60 ease-in-out duration-300 bg-green-600">Add A Categry <IoIosAddCircleOutline size={25} /></button>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-4">

                        <TrackedHabbitsSetter resetStates={resetStates}  id={id} entryFromDb={entryFromDb} setTiggerRefresh={setTiggerRefresh} newCategorySubmited={newCategorySubmited} newCategoryName={newCategoryName} trackedHabbitsFromDb={trackedHabbitsFromDb} />

                        {newCategory && (
                            <div className="flex gap-2 items-center">
                                <EditableHeading
                                    initialValue={newCategoryName}
                                    onValueChange={handleNewCategoryNameChange}
                                />
                                <MdDone onClick={handleSubmitNewCategory} size={30} className=" hover:text-green-500 ease-in-out duration-300" />
                            </div>
                        )}
                    </div>
                    <div className="flex self-end justify-between">
                        <p> {date}</p>
                        <SlOptions className='hover:opacity-50 ease-in-out duration-300 active:opacity-30' size={22} />
                    </div>
                </DialogContent>

               
            </Dialog>

          
        </div>

    
    )
}

export default FocusedHabbitCard









//                             < SelectTrackingTypeDropdown triggerElement={<button className="max-w-64 flex justify-center items-center gap-2 px-6 py-0.5 rounded-full text-sm hover:bg-green-700 active:opacity-60 ease-in-out duration-300 bg-green-600">Add A Habbit <IoIosAddCircleOutline size={25} /> </button>} />




/*
    const convertDateToString = async () => {
        const stringDate = await dateToString(dateFromDb)
        setDate(stringDate)
    }

    useEffect(
        () => {
            convertDateToString()
        }, []
    )*/



























/*







const FocusedHabbitCard = ({ date }) => {

    const [trackedHabbitsFromDb , setTrackedHabbitsFromDb] =useState(null)
    const [newCategory , setNewCategory] = useState(false)
    const [newCategoryName , setNewCategoryName] = useState("Add The Category Name")

    useEffect(
        ()=>{
            const gettrackedHabbitsFromDb = async ()=> {
                try{
                const res = await getTrackedHabbit()
                const fetchedData = JSON.parse(res)
                setTrackedHabbitsFromDb(fetchedData)
                }catch(err){
                    console.log(err)
                }
            }
            gettrackedHabbitsFromDb()
        } , []
    )

    

   

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <CarouselItem>
                        <div className="p-1">
                            <Card className="border-none w-64 bg-neutral-600 shadow-lg shadow-neutral-500 rounded-xl hover:translate-y-5 ease-in-out duration-300  text-neutral-200">
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">{date}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                </DialogTrigger>

                <DialogContent style={{ borderRadius: "20px" }} className=" bg-neutral-700 border-none focus:outline-none p-10 mx-auto max-w-[85%] lg:max-w-[40%] h-[60%] overflow-y-auto scrollbar-webkit">
                    <div className="flex justify-between ">
                        <div className="flex flex-col gap-2">
                        <h1 className="lg:text-3xl text-2xl font-semibold"> Your Daily Habbits</h1> 
                        <p className=" font-extralight"> +1% improvment every day will make you a new person  </p>
                        </div>
                        <div className=" flex flex-col gap-2">
                        <button onClick={()=>{setNewCategory(true)}} className="max-w-64 flex justify-center items-center gap-2 px-4 py-0.5 rounded-full text-sm hover:bg-green-700 active:opacity-60 ease-in-out duration-300 bg-green-600">Add A Categry <IoIosAddCircleOutline size={25} /></button>
                       < SelectTrackingTypeDropdown  triggerElement={<button className="max-w-64 flex justify-center items-center gap-2 px-6 py-0.5 rounded-full text-sm hover:bg-green-700 active:opacity-60 ease-in-out duration-300 bg-green-600">Add A Habbit <IoIosAddCircleOutline size={25} /> </button>} />
                        </div>
                    </div>
                    <div className=" flex flex-col gap-4">
                    {trackedHabbitsFromDb ? (
                            <TrackedHabbitsSetter trackedHabbitsFromDb={trackedHabbitsFromDb} />
                        ) : (
                            <p>Loading...</p>
                        )}
                        {newCategory&& (
                            <div className="flex gap-2 items-center"> 
                            <h1 style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 bg-transparent lg:text-2xl text-xl font-semibold  p-1 focus:border-none focus:outline-none w-fit" data-placeholder="Add The Category Name" contentEditable="true" onChange={(e) => { setNewCategoryName(e.target.innerHTML) }}>{newCategoryName}</h1>
                            <MdDone onClick={()=>{console.log(newCategoryName)}} size={30} className=" hover:text-green-500 ease-in-out duration-300"/>
                            </div>
                        )}
                    </div>
                    <div className="flex self-end justify-between">
                      <p> 7 octber 23</p>
                      <SlOptions className='hover:opacity-50 ease-in-out duration-300 active:opacity-30' size={22} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default FocusedHabbitCard



*/