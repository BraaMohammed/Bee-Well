'use server'

import { supabase } from '@/lib/supabase/supabase'
import { habitTemplateType } from '@/types/new-habit-tracker'
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
export async function getHabitTemplate(): Promise<{ 
  success: boolean; 
  data?: habitTemplateType; 
  error?: string 
}> {
  try {

    console.log('Fetching habit template...');

      const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to get labels');
        }

    if (!session.user.id) {
      return { success: false, error: 'User ID is required' }
    }

    const { data, error } = await supabase
      .from('habit_templates')
      .select('*')
      .eq('user_id', session?.user?.id)
      .single()

    console.log('Habit template data:', data);
    if (error) {
      // If no template exists yet, this is not an error
      if (error.code === 'PGRST116') {
        return { success: true, data: undefined }
      }
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: true, data: undefined }
    }

    // Parse the JSON template data into the expected format
    const habitTemplate: habitTemplateType = {
      id: data.id,
      userId: data.user_id,
      categories: data.template as habitTemplateType['categories']
    }

    return { success: true, data: habitTemplate }
  } catch (error) {
    console.error('Error fetching habit template:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
