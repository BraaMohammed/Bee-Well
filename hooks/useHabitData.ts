'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getDailyEntries } from '@/actions/getDailyEntries'
import { getHabitTemplate } from '@/actions/getHabitTemplate'
import { saveDailyEntry } from '@/actions/saveDailyEntry'
import { saveHabitTemplate } from '@/actions/saveHabitTemplate'
import { dayEntry, habitTemplateType } from '@/types/new-habit-tracker'

// Query Keys
export const habitQueryKeys = {
  all: ['habits'] as const,
  templates: (userId: string) => [...habitQueryKeys.all, 'templates', userId] as const,
  dailyEntries: (userId: string, startDate?: string, endDate?: string) => 
    [...habitQueryKeys.all, 'dailyEntries', userId, startDate, endDate] as const,
}

// Hook for fetching habit template

/* 
export const useHabitTemplate = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  return useQuery(
    habitQueryKeys.templates(userId || ''),
    async () => {
      if (!userId) throw new Error('User not authenticated')
      const result = await getHabitTemplate()
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch habit template')
      }
      return result.data
    },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes (gcTime in v5)
    }
  )
}
  */

// Hook for fetching daily entries
export const useDailyEntries = (startDate?: string, endDate?: string) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  return useQuery(
    habitQueryKeys.dailyEntries(userId || '', startDate, endDate),
    async () => {
      if (!userId) throw new Error('User not authenticated')
      const result = await getDailyEntries(userId, startDate, endDate)
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch daily entries')
      }
      return result.data || []
    },
    {
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes (gcTime in v5)
    }
  )
}

// Hook for saving habit template
export const useSaveHabitTemplate = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  return useMutation({
    mutationFn: async (habitTemplate: habitTemplateType) => {
      const result = await saveHabitTemplate(habitTemplate)
      if (!result.success) {
        throw new Error(result.error || 'Failed to save habit template')
      }
      return result.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch habit template
      if (userId) {
        queryClient.invalidateQueries({ 
          queryKey: habitQueryKeys.templates(userId) 
        })
      }
    },
    onError: (error) => {
      console.error('Error saving habit template:', error)
    }
  })
}

// Hook for saving daily entry
export const useSaveDailyEntry = () => {
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const userId = session?.user?.id

  return useMutation({
    mutationFn: async (dailyEntry: dayEntry) => {
      const result = await saveDailyEntry(dailyEntry)
      if (!result.success) {
        throw new Error(result.error || 'Failed to save daily entry')
      }
      return result.data
    },
    onSuccess: (data) => {
      // Invalidate and refetch daily entries
      if (userId) {
        queryClient.invalidateQueries({ 
          queryKey: [...habitQueryKeys.all, 'dailyEntries', userId] 
        })
      }
    },
    onError: (error) => {
      console.error('Error saving daily entry:', error)
    }
  })
}

// Hook for optimistic daily entry updates
export const useOptimisticDailyEntry = () => {
  const queryClient = useQueryClient()
  const saveMutation = useSaveDailyEntry()
  const { data: session } = useSession()
  const userId = session?.user?.id

  const updateEntry = async (entry: dayEntry) => {
    if (!userId) return

    // Optimistically update the UI
    const queryKey = [...habitQueryKeys.all, 'dailyEntries', userId]
    
    queryClient.setQueryData(queryKey, (old: dayEntry[] | undefined) => {
      if (!old) return [entry]
      
      const existingIndex = old.findIndex(e => e.date === entry.date)
      if (existingIndex >= 0) {
        const updated = [...old]
        updated[existingIndex] = entry
        return updated
      } else {
        return [...old, entry].sort((a, b) => a.date.localeCompare(b.date))
      }
    })

    // Save to database
    try {
      await saveMutation.mutateAsync(entry)
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey })
      throw error
    }
  }

  return {
    updateEntry,
    isLoading: saveMutation.isPending,
    error: saveMutation.error
  }
}
