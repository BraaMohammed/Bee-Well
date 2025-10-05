"use client"
import React, { useEffect } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import { dayEntry } from '@/types/new-habit-tracker'
import { useDailyEntries } from '@/hooks/useHabitData'
import { useLocalHabitData } from '@/hooks/useLocalHabitData'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/my-components/Sidebar'
import { DayEntriesCarousel } from '@/components/new-habit-tracker'
import TotalSuccessAnalytics from '@/components/new-habit-tracker/analytics/TotalSuccessAnalytics'
import SelectedHabbitsAnalytics from '@/components/new-habit-tracker/analytics/SelectedHabbitsAnalytics'
import SelectedDayAnalytics from '@/components/new-habit-tracker/analytics/SelectedDayAnalytics'
import NewSidebar from '@/components/my-components/newSidebar'

const page = () => {
  const { data: session, status } = useSession()
  const { setHabitTemplate , fetchHabitTemplate , habitTemplate } = useHabitStore()
  const { habitData } = useLocalHabitData()

  // Calculate date range for the last 30 days
  const getDateRange = () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30)
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
  }

  const { startDate, endDate } = getDateRange()

  // React Query hooks


  const { data: dailyEntries = [], isLoading: entriesLoading } = useDailyEntries(startDate, endDate)

  // Update habit store when template loads
  useEffect(() => {
    fetchHabitTemplate()
  }, [fetchHabitTemplate])

  // Generate mock data for fallback
  const generateMockDayEntries = (): dayEntry[] => {
    const entries: dayEntry[] = []
    const today = new Date()
    for (let i = 0; i < 10; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      entries.push({
        id: `mock-entry-${i}`,
        date: date.toISOString().split('T')[0],
        userId: session?.user?.id || 'mock-user',
        habits: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    return entries
  }

  // Utility: Convert local habitData to dayEntry[] for the last 30 days
  const buildLocalDayEntries = (): dayEntry[] => {
    const entries: dayEntry[] = []
    const today = new Date()
    for (let i = 0; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const habitsObj = habitData[dateStr] || {}
      const habits = Object.entries(habitsObj).map(([habitId, value]) => ({
        id: `${habitId}-${dateStr}`,
        habitId,
        date: dateStr,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
      if (habits.length > 0) {
        entries.push({
          id: `entry-${dateStr}`,
          date: dateStr,
          userId: session?.user?.id || 'local-user',
          habits,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }
    }
    return entries
  }

  // Prefer local entries for instant UI update
  const localDayEntries = buildLocalDayEntries()
  const displayEntries = localDayEntries.length > 0 ? localDayEntries : (dailyEntries.length > 0 ? dailyEntries : generateMockDayEntries())
  const isLoading =  entriesLoading

  return (
    <div className="min-h-screen w-full pt-12 px-6 lg:px-0 pb-8 overflow-x-hidden">
        <div className="flex flex-1 flex-col justify-start gap-8 text-neutral-950 max-w-[88rem] mx-auto">
          {/* Header */}
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="lg:text-3xl text-base font-semibold">Your Daily Habits</h1>
              <p className="text-sm lg:text-base font-light">
                +1% improvement every day will make you a new person
              </p>
            </div>
          </div>

          <DayEntriesCarousel 
            dayEntries={displayEntries}
            loading={isLoading}
          />
          <div className='flex flex-col gap-2'>
              <h1 className="lg:text-2xl text-xl font-semibold"> Analytics </h1>
              <p className="text-sm font-light">data of your daily routine remeber what is messaured can be improved </p>
              <div className='w-full flex flex-col xl:flex-row gap-4 items-stretch'>
                  <SelectedHabbitsAnalytics dailyEntriesFromDb={displayEntries} trackedHabitsFromDb={habitTemplate || null} />
                  <SelectedDayAnalytics trackedHabbitsFromDb={habitTemplate || null} dailyEntriesFromDb={displayEntries} />
              </div>
              <TotalSuccessAnalytics habitEntries={displayEntries} />
          </div>
        </div>
    </div>
  )
}

export default page