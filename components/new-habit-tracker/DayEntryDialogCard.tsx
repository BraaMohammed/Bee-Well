'use client'
import { useState } from "react"
import { dayEntry } from '@/types/new-habit-tracker'
import DayEntryCard from "./DayEntryCard"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import NewHabitTracker from './NewHabitTracker'
import { SlOptions } from "react-icons/sl"
import { format } from 'date-fns'

type DayEntryDialogCardProps = {
  entry: dayEntry
}

const formatDateForDisplay = (dateString: string) => {
  if (!dateString) return ""
  return format(new Date(dateString), 'eeee, MMMM do, yyyy')
}

export function DayEntryDialogCard({ entry }: DayEntryDialogCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <DayEntryCard entry={entry} />
      </DialogTrigger>
      <DialogContent 
        style={{ borderRadius: "20px" }} 
        className="bg-neutral-700 border-none focus:outline-none p-10 mx-auto max-w-[85%] lg:max-w-[60%] h-[70%] overflow-y-auto scrollbar-webkit"
      >
        <>
          <div className="flex flex-col gap-4">
            <NewHabitTracker 
              date={formatDateForDisplay(entry.date)}
              rawDate={entry.date}
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
          
          <div className="flex self-end justify-between lg:text-sm text-xs text-neutral-200">
            <p>{formatDateForDisplay(entry.date)}</p>
            <SlOptions 
              className="hover:opacity-50 ease-in-out duration-300 active:opacity-30 cursor-pointer" 
              size={22} 
            />
          </div>
        </>
      </DialogContent>
    </Dialog>
  )
}
