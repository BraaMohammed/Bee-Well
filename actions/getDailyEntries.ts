'use server'

import { supabase } from '@/lib/supabase/supabase'
import { dayEntry } from '@/types/new-habit-tracker'

export async function getDailyEntries(
  userId: string, 
  startDate?: string, 
  endDate?: string
): Promise<{ 
  success: boolean; 
  data?: dayEntry[]; 
  error?: string 
}> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' }
    }

    // If dates are provided, validate them
    if (startDate || endDate) {
      if (!startDate || !endDate) {
        return { success: false, error: 'Both start date and end date are required when filtering by date' }
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
        return { success: false, error: 'Dates must be in YYYY-MM-DD format' }
      }

      // Validate date range
      if (startDate > endDate) {
        return { success: false, error: 'Start date must be before or equal to end date' }
      }
    }

    let query = supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', userId)

    // Add date filters if provided
    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate)
    }

    const { data, error } = await query.order('date', { ascending: true })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] }
    }

    // Transform database entries to expected format
    const dailyEntries: dayEntry[] = data.map(entry => ({
      id: entry.id,
      date: entry.date,
      userId: entry.user_id,
      habits: entry.entry as dayEntry['habits'],
      createdAt: entry.created_at || undefined,
      updatedAt: entry.updated_at || undefined
    }))

    return { success: true, data: dailyEntries }
  } catch (error) {
    console.error('Error fetching daily entries:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
