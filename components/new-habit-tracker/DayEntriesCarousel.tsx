'use client'
import {
  Carousel,
  CarouselContent,
} from "@/components/ui/carousel"
import { useState, useEffect } from "react"
import { dayEntry } from '@/types/new-habit-tracker'
import { compareDesc } from 'date-fns'
import { DayEntryDialogCard } from "./DayEntryDialogCard"
import {DayEntryCardSkeleton} from './CardSekleton'


type DayEntriesCarouselProps = {
  dayEntries: dayEntry[]
  loading?: boolean
}

export function DayEntriesCarousel({ dayEntries, loading = false }: DayEntriesCarouselProps) {
  const [sortedEntries, setSortedEntries] = useState<dayEntry[]>([])

  useEffect(() => {
    if (dayEntries?.length > 0) {
      const sorted = [...dayEntries].sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
      setSortedEntries(sorted)
    } else {
      setSortedEntries([])
    }
  }, [dayEntries])

  if (loading) {
    return (
      <div style={{ width: "100%", gap: "10px" }} className="w-full flex max-w-xs self-start">
        <DayEntryCardSkeleton />
        <DayEntryCardSkeleton />
        <DayEntryCardSkeleton />
        <DayEntryCardSkeleton />
      </div>
    )
  }

  return (
    <>
      <Carousel 
        opts={{
          align: "start",
          dragFree: true,
          containScroll: false,
          loop: false,
          skipSnaps: false,
          inViewThreshold: 0,
          slidesToScroll: 1,
          duration: 0,
          startIndex: 0,
          watchDrag: true,
          axis: "x",
        }}
        className="w-full max-w-xs self-start"
      >
        <CarouselContent className="w-fit">
          {sortedEntries.map((entry) => (
            <DayEntryDialogCard 
              key={entry.id} 
              entry={entry} 
            />
          ))}
        </CarouselContent>
      </Carousel>
    </>
  )
}
