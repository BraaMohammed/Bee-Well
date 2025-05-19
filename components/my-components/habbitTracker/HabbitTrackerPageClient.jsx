"use client"
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Sidebar from '../Sidebar'
import { CarouselHabbitCards } from './CarouselHabbitCards'
import CalendarPicker from './CalendarPicker'
import getTrackedHabbit from '@/app/actions/getTrackedHabbit'
import getDailyEntries from '@/app/actions/getDailyEntries'
import FocusedHabbitCard from './FocusedHabbitCard'
import TotalSuccessAnalytics from '../analytics/TotalSuccessAnalytics'
import GoodAndBadHabbitsAnalytics from '../analytics/GoodAndBadHabbitsAnalytics'
import SelectedHabbitsAnalytics from '../analytics/SelectedHabbitsAnalytics'
import SelectedDayAnalytics from '../analytics/SelectedDayAnalytics'
import CalendarCardSkeleton from './CalendarCardSkeleton'

const HabbitTrackerPageClient = () => {
    const [trackedHabbitsFromDb, setTrackedHabbitsFromDb] = useState(null)
    const [tiggerRefresh, setTiggerRefresh] = useState(false)
    const [dailyEntriesFromDb, setDailyEntriesFromDb] = useState([])
    const [selectedDay, setSelectedDay] = useState(null); // selected day from the calender
    const [selectedDayFromCalenderExtractedFromDailyEntries, setSelectedDayFromCalenderExtractedFromDailyEntries] = useState(null) // the object of coresponding picked day from the calender when we compare it to daily entries from db 
    const [modalOpen, setModalOpen] = useState(false); // the modal which is triggered by picking a day from the calender 
    const [loading, setLoading] = useState(true);
    const [isInitialFetch, setIsInitialFetch] = useState(true);




    const gettrackedHabbitsFromDb = async () => {
        setLoading(true)
        try {
            const res = await getTrackedHabbit()
            const fetchedData = JSON.parse(res)
            console.log(fetchedData, "trackedHabbitsFromDb")
            setTrackedHabbitsFromDb(fetchedData)
            setLoading(false)
            setIsInitialFetch(false);

        } catch (err) {
            console.log(err)
        }
    }

    const getDailyEntriesFromDb = async () => {
        const res = await getDailyEntries()
        const DailyEntries = JSON.parse(res)
        setDailyEntriesFromDb(DailyEntries)
    }




    useEffect(() => {
        gettrackedHabbitsFromDb();
        getDailyEntriesFromDb()
    }, [tiggerRefresh]);

    const handleDaySelection = (date) => {
        setSelectedDay(date.toString());

        setModalOpen(true);
    };

    const updateSelectedDayFromCalenderExtractedFromDailyEntries = (d) => {
        setSelectedDayFromCalenderExtractedFromDailyEntries(d);


    }

    useEffect(() => {
        if (selectedDay !== null && dailyEntriesFromDb.length > 0) {
            const d = dailyEntriesFromDb.find(item => item.date === selectedDay);
            updateSelectedDayFromCalenderExtractedFromDailyEntries(d);
        }
    }, [selectedDay, dailyEntriesFromDb]);


    // console.log(trackedHabbitsFromDb)



    return (
        <div className="flex flex-col bg-neutral-300 min-h-screen  ">
            {selectedDayFromCalenderExtractedFromDailyEntries !== null && trackedHabbitsFromDb &&
                <FocusedHabbitCard
                    focusOnly={true}
                    setTiggerRefresh={setTiggerRefresh}
                    trackedHabbitsFromDb={trackedHabbitsFromDb}
                    key={selectedDayFromCalenderExtractedFromDailyEntries._id}
                    id={selectedDayFromCalenderExtractedFromDailyEntries._id}
                    dateFromDb={selectedDayFromCalenderExtractedFromDailyEntries.date}
                    open={modalOpen}
                    setOpen={setModalOpen}
                    entryFromDb={selectedDayFromCalenderExtractedFromDailyEntries.entries}

                />
            }
            <Sidebar />
            <div className="lg:ml-[15vw] flex flex-1 flex-col p-24 justify-around gap-8 scrollbar-thin overflow-x-hidden  text-neutral-950 ">
                <div className=" flex  gap-8">
                    <div>
                        <h1 className=" lg:text-2xl text-xl font-semibold flex gap-2 items-center"> Habbit Tracker <CalendarPicker selectedDay={selectedDay} onSelectDay={handleDaySelection} dailyEntriesFromDb={dailyEntriesFromDb} /> </h1>

                        <p className=" text-sm lg:text-base font-light">click on the calender to select the day or choose it from the carosell down </p>
                    </div>

                </div>
                {
                    loading && isInitialFetch ?
                        <div style={{width:"100%" , gap: "10px"}} className="w-full flex max-w-xs self-start  ">
                            <CalendarCardSkeleton isVisible={loading} />
                            <CalendarCardSkeleton isVisible={loading} />
                            <CalendarCardSkeleton isVisible={loading} />
                            <CalendarCardSkeleton isVisible={loading} />
                        </div>
                        : <CarouselHabbitCards dailyEntriesFromDb={dailyEntriesFromDb} trackedHabbitsFromDb={trackedHabbitsFromDb} setTiggerRefresh={setTiggerRefresh} />

                }
                <div className=' flex flex-col gap-2'>
                    <h1 className=" lg:text-2xl text-xl font-semibold"> Analytics </h1>
                    <p className=" text-sm font-light">data of your daily routine remeber what is messaured can be improved </p>
                    <div className=' lg:w-full self-center flex flex-col lg:flex-row gap-2 items-start'>
                        <SelectedHabbitsAnalytics dailyEntriesFromDb={dailyEntriesFromDb} trackedHabbitsFromDb={trackedHabbitsFromDb} />
                        <SelectedDayAnalytics trackedHabbitsFromDb={trackedHabbitsFromDb} dailyEntriesFromDb={dailyEntriesFromDb} />
                    </div>
                    <TotalSuccessAnalytics dailyEntriesFromDb={dailyEntriesFromDb} trackedHabbitsFromDb={trackedHabbitsFromDb} />
                </div>
            </div>
        </div>
    )
}

export default HabbitTrackerPageClient

//Sidebar CarouselHabbitCards CalendarPicker


/*
                        <GoodAndBadHabbitsAnalytics/>



*/