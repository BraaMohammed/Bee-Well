'use client'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import createDailyEntry from "@/app/actions/createDailyEntry"
//import { dateToString } from "@/app/actions/experemental/dateToString"
import { useState, useEffect } from "react"

import FocusedHabbitCard from "./FocusedHabbitCard"

export function CarouselHabbitCards({ trackedHabbitsFromDb, setTiggerRefresh, dailyEntriesFromDb }) {

  const [dailyEntries, setDailyEntries] = useState(dailyEntriesFromDb)
  const [carouselRefresh , setCarouselRefresh] = useState(false)

  useEffect(
    () => {
      if (dailyEntriesFromDb) {
        setDailyEntries(dailyEntriesFromDb)
      }

    }, [dailyEntriesFromDb]
  )

  return (
    <Carousel className="w-full max-w-xs self-start  ">
      <CarouselContent className=" w-full ">
        {dailyEntries.sort((a, b) => {
          const dateA = new Date(a.date.replace(/(st|nd|rd|th),/, ','));
          const dateB = new Date(b.date.replace(/(st|nd|rd|th),/, ','));
          return dateB - dateA;
        }).map(a => (
          <FocusedHabbitCard setCarouselRefresh={setCarouselRefresh} setTiggerRefresh={setTiggerRefresh} trackedHabbitsFromDb={trackedHabbitsFromDb} key={a._id} id={a._id} dateFromDb={a.date} entryFromDb={a.entries} />
        ))}
      </CarouselContent>
      <CarouselPrevious className=" w-10 h-10 active:bg-neutral-400 hover:bg-neutral-400 shadow-lg ease-in-out duration-300 shadow-neutral-900 rounded-xl disabled:opacity-0 text-neutral-950 " />
      <CarouselNext className=" w-10 h-10 active:bg-neutral-400 hover:bg-neutral-400 shadow-lg ease-in-out duration-300 shadow-neutral-900 rounded-xl disabled:opacity-0 text-neutral-950" />
    </Carousel>
  )
}





/* let arr = [
    { id: 29, date: '2024-08-12T00:00:00.000+00:00' },
    { id: 28, date: '2024-08-11T00:00:00.000+00:00' },
    { id: 27, date: '2024-08-10T00:00:00.000+00:00' },
    { id: 26, date: '2024-08-09T00:00:00.000+00:00' },
    { id: 25, date: '2024-08-08T00:00:00.000+00:00' },
    { id: 24, date: '2024-08-07T00:00:00.000+00:00' },
    { id: 23, date: '2024-08-06T00:00:00.000+00:00' },
    { id: 22, date: '2024-08-05T00:00:00.000+00:00' },
    { id: 21, date: '2024-08-04T00:00:00.000+00:00' },
    { id: 20, date: '2024-08-03T00:00:00.000+00:00' },
    { id: 19, date: '2024-08-02T00:00:00.000+00:00' },
    { id: 18, date: '2024-08-01T00:00:00.000+00:00' },
    { id: 17, date: '2024-07-31T00:00:00.000+00:00' },
    { id: 16, date: '2024-07-30T00:00:00.000+00:00' },
    { id: 15, date: '2024-07-29T00:00:00.000+00:00' },
    { id: 14, date: '2024-07-28T00:00:00.000+00:00' },
    { id: 13, date: '2024-07-27T00:00:00.000+00:00' },
    { id: 12, date: '2024-07-26T00:00:00.000+00:00' },
    { id: 11, date: '2024-07-25T00:00:00.000+00:00' },
    { id: 10, date: '2024-07-24T00:00:00.000+00:00' },
    { id: 9, date: '2024-07-23T00:00:00.000+00:00' },
    { id: 8, date: '2024-07-22T00:00:00.000+00:00' },
    { id: 7, date: '2024-07-21T00:00:00.000+00:00' },
    { id: 6, date: '2024-07-20T00:00:00.000+00:00' },
    { id: 5, date: '2024-07-19T00:00:00.000+00:00' },
    { id: 4, date: '2024-07-18T00:00:00.000+00:00' },
    { id: 3, date: '2024-07-17T00:00:00.000+00:00' },
    { id: 2, date: '2024-07-16T00:00:00.000+00:00' },
    { id: 1, date: '2024-07-15T00:00:00.000+00:00' }
];


const createNewDailyEntry = async (date) => {
    try {
        const res = await createDailyEntry({ dateFromClient: date });
        console.log(res);
    } catch (err) {
        console.error('Error creating daily entry:', err);
    }
};

for (let day of arr) {
    createNewDailyEntry(day.date);
}
*/
