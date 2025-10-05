// Supabase Database Types for New Habit Tracker
// Generated from new-habit-tracker-schema.sql

export interface Database {
  public: {
    Tables: {
      habit_templates: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      habit_categories: {
        Row: {
          id: string
          template_id: string
          name: string
          description: string
          ui_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          template_id: string
          name: string
          description?: string
          ui_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          template_id?: string
          name?: string
          description?: string
          ui_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string
          habit_type: 'checkbox' | 'select' | 'number' | 'textArea'
          importance: 0.5 | 0.625 | 0.75 | 0.875 | 1.0
          should_be_done: boolean | null
          target_value: number | null
          best_option: string | null
          options: string[] | null
          ui_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string
          habit_type: 'checkbox' | 'select' | 'number' | 'textArea'
          importance: 0.5 | 0.625 | 0.75 | 0.875 | 1.0
          should_be_done?: boolean | null
          target_value?: number | null
          best_option?: string | null
          options?: string[] | null
          ui_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string
          habit_type?: 'checkbox' | 'select' | 'number' | 'textArea'
          importance?: 0.5 | 0.625 | 0.75 | 0.875 | 1.0
          should_be_done?: boolean | null
          target_value?: number | null
          best_option?: string | null
          options?: string[] | null
          ui_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_habit_entries: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          entry_date: string
          checkbox_value: boolean | null
          number_value: number | null
          text_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          entry_date: string
          checkbox_value?: boolean | null
          number_value?: number | null
          text_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          entry_date?: string
          checkbox_value?: boolean | null
          number_value?: number | null
          text_value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      habit_templates_complete: {
        Row: {
          template_id: string
          user_id: string
          template_created_at: string
          template_updated_at: string
          category_id: string | null
          category_name: string | null
          category_description: string | null
          category_order: number | null
          habit_id: string | null
          habit_name: string | null
          habit_description: string | null
          habit_type: 'checkbox' | 'select' | 'number' | 'textArea' | null
          importance: 0.5 | 0.625 | 0.75 | 0.875 | 1.0 | null
          should_be_done: boolean | null
          target_value: number | null
          best_option: string | null
          options: string[] | null
          habit_order: number | null
        }
      }
      daily_entries_with_habits: {
        Row: {
          entry_id: string
          habit_id: string
          user_id: string
          entry_date: string
          checkbox_value: boolean | null
          number_value: number | null
          text_value: string | null
          entry_created_at: string
          habit_name: string
          habit_type: 'checkbox' | 'select' | 'number' | 'textArea'
          importance: 0.5 | 0.625 | 0.75 | 0.875 | 1.0
          target_value: number | null
          category_name: string
          category_id: string
        }
      }
    }
    Functions: {
      get_user_habit_template: {
        Args: {
          user_uuid: string
        }
        Returns: {
          template_id: string
          category_id: string | null
          category_name: string | null
          category_description: string | null
          category_order: number | null
          habit_id: string | null
          habit_name: string | null
          habit_description: string | null
          habit_type: 'checkbox' | 'select' | 'number' | 'textArea' | null
          importance: 0.5 | 0.625 | 0.75 | 0.875 | 1.0 | null
          should_be_done: boolean | null
          target_value: number | null
          best_option: string | null
          options: string[] | null
          habit_order: number | null
        }[]
      }
      get_daily_entries_for_period: {
        Args: {
          user_uuid: string
          start_date: string
          end_date: string
        }
        Returns: {
          entry_id: string
          habit_id: string
          habit_name: string
          habit_type: 'checkbox' | 'select' | 'number' | 'textArea'
          category_name: string
          entry_date: string
          checkbox_value: boolean | null
          number_value: number | null
          text_value: string | null
        }[]
      }
    }
  }
}

// Helper types for easier usage
export type HabitTemplate = Database['public']['Tables']['habit_templates']['Row']
export type HabitCategory = Database['public']['Tables']['habit_categories']['Row']
export type Habit = Database['public']['Tables']['habits']['Row']
export type DailyHabitEntry = Database['public']['Tables']['daily_habit_entries']['Row']

export type HabitTemplateInsert = Database['public']['Tables']['habit_templates']['Insert']
export type HabitCategoryInsert = Database['public']['Tables']['habit_categories']['Insert']
export type HabitInsert = Database['public']['Tables']['habits']['Insert']
export type DailyHabitEntryInsert = Database['public']['Tables']['daily_habit_entries']['Insert']

export type HabitTemplateUpdate = Database['public']['Tables']['habit_templates']['Update']
export type HabitCategoryUpdate = Database['public']['Tables']['habit_categories']['Update']
export type HabitUpdate = Database['public']['Tables']['habits']['Update']
export type DailyHabitEntryUpdate = Database['public']['Tables']['daily_habit_entries']['Update']

// Complete habit template view type
export type HabitTemplateComplete = Database['public']['Views']['habit_templates_complete']['Row']
export type DailyEntryWithHabit = Database['public']['Views']['daily_entries_with_habits']['Row']

// Function return types
export type UserHabitTemplateFunction = Database['public']['Functions']['get_user_habit_template']['Returns'][0]
export type DailyEntriesForPeriodFunction = Database['public']['Functions']['get_daily_entries_for_period']['Returns'][0]
