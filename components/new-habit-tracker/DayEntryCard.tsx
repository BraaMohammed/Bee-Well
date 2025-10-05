'use client'
import { CarouselItem } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { dayEntry } from '@/types/new-habit-tracker'
import React from "react"

type DayEntryCardProps = {
  entry: dayEntry
}

const DayEntryCard = React.forwardRef<HTMLDivElement, DayEntryCardProps & React.HTMLAttributes<HTMLDivElement>>(
  ({ entry, ...props }, ref) => {
    const formatDateForDisplay = (dateString: string) => {
      const date = new Date(dateString)
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      return date.toLocaleDateString('en-US', options)
    }

    return (
      <CarouselItem ref={ref} {...props} className="pl-2 basis-auto">
        <div className="p-1">
          <Card className="border-none w-64 bg-neutral-600 shadow-xl shadow-neutral-600 rounded-xl hover:translate-y-5 ease-in-out duration-300 text-neutral-200 hover:bg-neutral-500 cursor-pointer">
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-4xl font-semibold text-center">
                {formatDateForDisplay(entry.date)}
              </span>
            </CardContent>
          </Card>
        </div>
      </CarouselItem>
    )
  }
)
DayEntryCard.displayName = 'DayEntryCard'

export default DayEntryCard
