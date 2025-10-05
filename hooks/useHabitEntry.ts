'use client'

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useOptimisticDailyEntry } from './useHabitData'
import { dayEntry, habitEntry } from '@/types/new-habit-tracker'
import { debounce } from 'lodash'

// Hook for saving individual habit entries
export const useHabitEntry = () => {
  const { data: session } = useSession()
  const { updateEntry, isLoading, error } = useOptimisticDailyEntry()

  // Debounced save function to avoid excessive API calls
  const debouncedSave = useCallback(
    debounce(async (entry: dayEntry) => {
      try {
        await updateEntry(entry)
      } catch (error) {
        console.error('Failed to save habit entry:', error)
      }
    }, 1000),
    [updateEntry]
  )

  const saveHabitEntry = useCallback(
    (habitId: string, value: any, date?: string) => {
      if (!session?.user?.id) {
        console.warn('Cannot save habit entry: User not authenticated')
        return
      }

      const entryDate = date || new Date().toISOString().split('T')[0]
      
      const habitEntry: habitEntry = {
        id: `${habitId}-${entryDate}`,
        habitId,
        date: entryDate,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const dayEntry: dayEntry = {
        id: `entry-${entryDate}`,
        date: entryDate,
        userId: session.user.id,
        habits: [habitEntry],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save with debouncing
      debouncedSave(dayEntry)
    },
    [session?.user?.id, debouncedSave]
  )

  return {
    saveHabitEntry,
    isLoading,
    error
  }
}
