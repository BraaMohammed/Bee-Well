'use client'

import { create } from 'zustand'
import { useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { saveDailyEntry } from '@/actions/saveDailyEntry'
import { dayEntry, habitEntry } from '@/types/new-habit-tracker'
import { debounce } from 'lodash'

// Local state structure
interface HabitDataState {
  // Structure: { [date]: { [habitId]: value } }
  habitData: Record<string, Record<string, any>>
  // Track which dates have unsaved changes
  dirtyDates: Set<string>
  // Track last save timestamps
  lastSaved: Record<string, number>
  
  // Actions
  initializeDate: (date: string, dayEntry?: dayEntry) => void
  updateHabit: (date: string, habitId: string, value: any) => void
  saveDate: (date: string) => Promise<void>
  saveAllDirty: () => Promise<void>
  markClean: (date: string) => void
  getHabitValue: (date: string, habitId: string) => any
  isDirty: (date: string) => boolean
}

export const useHabitDataStore = create<HabitDataState>()((set, get) => ({
  habitData: {},
  dirtyDates: new Set(),
  lastSaved: {},
  
  initializeDate: (date: string, dayEntry?: dayEntry) => {
    const state = get()
    
    // Check if we already have this date and it has data
    const existingData = state.habitData[date]
    const hasExistingData = existingData && Object.keys(existingData).length > 0
    
    if (hasExistingData && !state.dirtyDates.has(date)) {
      return
    }
    
    const habitValues: Record<string, any> = {}
    
    // Initialize with data from dayEntry if provided
    if (dayEntry?.habits) {
      dayEntry.habits.forEach(habit => {
        habitValues[habit.habitId] = habit.value
      })
    }
    
    set(state => ({
      habitData: {
        ...state.habitData,
        [date]: habitValues
      },
      lastSaved: {
        ...state.lastSaved,
        [date]: Date.now()
      }
    }))
  },
  
  updateHabit: (date: string, habitId: string, value: any) => {
    set(state => {
      const newDirtyDates = new Set(state.dirtyDates)
      newDirtyDates.add(date)
      
      return {
        habitData: {
          ...state.habitData,
          [date]: {
            ...state.habitData[date],
            [habitId]: value
          }
        },
        dirtyDates: newDirtyDates
      }
    })
  },
  
  saveDate: async (date: string) => {
    const state = get()
    const { data: session } = { data: null } // Will be handled in hook
    
    // This will be called from the hook where session is available
    return Promise.resolve()
  },
  
  saveAllDirty: async () => {
    const state = get()
    const promises = Array.from(state.dirtyDates).map(date => state.saveDate(date))
    await Promise.all(promises)
  },
  
  markClean: (date: string) => {
    set(state => {
      const newDirtyDates = new Set(state.dirtyDates)
      newDirtyDates.delete(date)
      
      return {
        dirtyDates: newDirtyDates,
        lastSaved: {
          ...state.lastSaved,
          [date]: Date.now()
        }
      }
    })
  },
  
  getHabitValue: (date: string, habitId: string) => {
    const state = get()
    return state.habitData[date]?.[habitId]
  },
  
  isDirty: (date: string) => {
    const state = get()
    return state.dirtyDates.has(date)
  }
}))

// Main hook for habit data management
export const useLocalHabitData = () => {
  const { data: session } = useSession()
  const store = useHabitDataStore()
  
  // Enhanced save function with session (using current format with old system timing)
  const saveDate = useCallback(async (date: string) => {
    if (!session?.user?.id) return
    
    const habitData = store.habitData[date]
    if (!habitData || !store.isDirty(date)) return
    
    try {
      // Convert local data to current dayEntry format
      const habits: habitEntry[] = Object.entries(habitData).map(([habitId, value]) => ({
        id: `${habitId}-${date}`,
        habitId,
        date,
        value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
      
      const dayEntry: dayEntry = {
        id: `entry-${date}`,
        date,
        userId: session.user.id,
        habits,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const result = await saveDailyEntry(dayEntry)
      
      if (result.success) {
        store.markClean(date)
      } else {
        console.error(`❌ Failed to save habits for ${date}:`, result.error)
      }
    } catch (error) {
      console.error(`❌ Error saving habits for ${date}:`, error)
    }
  }, [session, store])
  
  // Update habit value (no auto-save)
  const updateHabit = useCallback((date: string, habitId: string, value: any) => {
    store.updateHabit(date, habitId, value)
  }, [store])

  // Save on dialog close with debounce
  const saveOnClose = useCallback(
    debounce(async (date: string) => {
      await saveDate(date)
    }, 500), // 500ms debounce
    [saveDate]
  )
  const saveAll = useCallback(async () => {
    const dirtyDates = Array.from(store.dirtyDates)
    for (const date of dirtyDates) {
      await saveDate(date)
    }
  }, [saveDate, store.dirtyDates])
  
  return {
    // State
    habitData: store.habitData,
    dirtyDates: store.dirtyDates,

    // Actions
    initializeDate: store.initializeDate,
    updateHabit,
    getHabitValue: store.getHabitValue,
    isDirty: store.isDirty,
    saveOnClose,
    saveAll,

    // Status
    hasUnsavedChanges: store.dirtyDates.size > 0
  }
}