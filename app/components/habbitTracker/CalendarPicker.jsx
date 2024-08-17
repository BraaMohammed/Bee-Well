"use client";
import React, { useEffect, useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { VscCalendar } from "react-icons/vsc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns"


const CalendarPicker = ({ dailyEntriesFromDb ,  onSelectDay , selectedDay  }) => {
  const [daysRecorded, setDaysRecorded] = useState([]);
 
  
  const handleAddingRecorderDays = (day)=>{
    setDaysRecorded((prev) => {
      if (!prev.includes(day)) {
        return [...prev, day];
      }
      return prev;
    });
  }

  useEffect(
    ()=>{
      if(dailyEntriesFromDb){
        for (let day of dailyEntriesFromDb) {
          handleAddingRecorderDays(day.date);
        }
      }
    }
    , [dailyEntriesFromDb]
  )


  const checkDisabled = (date) => {
    const dateStr = format(date, "PPPP")
    return !daysRecorded.includes(dateStr);
  };
  

  const handleDayPickedFromCalender = (day) => {
    onSelectDay(format(day, "PPPP"));
};

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <VscCalendar size={30} className='hover:translate-y-2 hover:text-neutral-500 ease-in-out duration-300' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="appearance-none bg-transparent border-none outline-none shadow-none ">
          <Calendar
           selected={selectedDay}
            disabled={checkDisabled}
            onSelect={handleDayPickedFromCalender}
            mode="single"
            className="p-4 rounded-2xl bg-neutral-700 w-fit text-white"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CalendarPicker;






 //const [selectedDayFromCalender , setSelectedDayFromCalender ] = useState(null)


  /*
  const convertDateToString = async (dateFromDb) => {
    const stringDate = await dateToString(dateFromDb);
    const shadcnFormat = convertStringDateToShadcnFormat(stringDate);
    setDaysRecorded((prev) => {
      if (!prev.includes(shadcnFormat)) {
        return [...prev, shadcnFormat];
      }
      return prev;
    });
  };

 
  useEffect(() => {
    const fetchData = async () => {
      for (let day of dailyEntriesFromDb) {
        await convertDateToString(day.date);
      }
    };

    fetchData();
  }, [dailyEntriesFromDb]);*/
