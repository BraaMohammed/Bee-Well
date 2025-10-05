'use server'

import { supabase } from '@/lib/supabase/supabase'
import { habitTemplateType } from '@/types/new-habit-tracker'

export async function saveHabitTemplate(habitTemplate: habitTemplateType): Promise<{ 
  success: boolean; 
  data?: habitTemplateType; 
  error?: string 
}> {
  try {
    if (!habitTemplate.userId) {
      return { success: false, error: 'User ID is required' }
    }

    if (!habitTemplate.categories || habitTemplate.categories.length === 0) {
      return { success: false, error: 'At least one category is required' }
    }

    // Check if template already exists for this user
    const { data: existingTemplate } = await supabase
      .from('habit_templates')
      .select('id')
      .eq('user_id', habitTemplate.userId)
      .single()

    const templateData = {
      user_id: habitTemplate.userId,
      template: habitTemplate.categories,
      updated_at: new Date().toISOString()
    }

    let result

    if (existingTemplate) {
      // Update existing template
      result = await supabase
        .from('habit_templates')
        .update(templateData)
        .eq('user_id', habitTemplate.userId)
        .select()
        .single()
    } else {
      // Create new template
      result = await supabase
        .from('habit_templates')
        .insert({
          ...templateData,
          created_at: new Date().toISOString()
        })
        .select()
        .single()
    }

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    if (!result.data) {
      return { success: false, error: 'Failed to save habit template' }
    }

    // Return the saved template in the expected format
    const savedTemplate: habitTemplateType = {
      id: result.data.id,
      userId: result.data.user_id,
      categories: result.data.template as habitTemplateType['categories']
    }

    return { success: true, data: savedTemplate }
  } catch (error) {
    console.error('Error saving habit template:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
