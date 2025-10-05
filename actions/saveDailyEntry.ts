'use server'

import { supabase } from '@/lib/supabase/supabase'
import { dayEntry } from '@/types/new-habit-tracker'

export async function saveDailyEntry(dailyEntry: dayEntry): Promise<{ 
  success: boolean; 
  data?: dayEntry; 
  error?: string 
}> {


  console.log('Saving daily entry:', dailyEntry)

  
  try {
    if (!dailyEntry.userId) {
      return { success: false, error: 'User ID is required' }
    }

    if (!dailyEntry.date) {
      return { success: false, error: 'Date is required' }
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(dailyEntry.date)) {
      return { success: false, error: 'Date must be in YYYY-MM-DD format' }
    }

    if (!dailyEntry.habits || dailyEntry.habits.length === 0) {
      return { success: false, error: 'Habits data is required' }
    }

    // Check if entry already exists for this user and date
    const { data: existingEntry } = await supabase
      .from('daily_entries')
      .select('id')
      .eq('user_id', dailyEntry.userId)
      .eq('date', dailyEntry.date)
      .single()

    const entryData = {
      user_id: dailyEntry.userId,
      date: dailyEntry.date,
      entry: dailyEntry.habits,
      updated_at: new Date().toISOString()
    }

    let result

    if (existingEntry) {
      // Update existing entry
      result = await supabase
        .from('daily_entries')
        .update(entryData)
        .eq('user_id', dailyEntry.userId)
        .eq('date', dailyEntry.date)
        .select()
        .single()
    } else {
      // Create new entry
      result = await supabase
        .from('daily_entries')
        .insert({
          ...entryData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
    }

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    if (!result.data) {
      return { success: false, error: 'Failed to save daily entry' }
    }

    // Return the saved entry in the expected format
    const savedEntry: dayEntry = {
      id: result.data.id,
      date: result.data.date,
      userId: result.data.user_id,
      habits: result.data.entry as dayEntry['habits'],
      createdAt: result.data.created_at || undefined,
      updatedAt: result.data.updated_at || undefined
    }

    return { success: true, data: savedEntry }
  } catch (error) {
    console.error('Error saving daily entry:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
