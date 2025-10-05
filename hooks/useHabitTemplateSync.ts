'use client'

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSaveHabitTemplate } from './useHabitData'
import { useHabitStore } from '@/stores/habitStore'
import { habitTemplateType } from '@/types/new-habit-tracker'
import { debounce } from 'lodash'

// Hook for automatically syncing habit store changes with the database
export const useHabitTemplateSync = () => {
  const { data: session } = useSession()
  const { habitTemplate } = useHabitStore()
  const { mutate: saveTemplate, isPending, error } = useSaveHabitTemplate()

  // Debounced save function to avoid excessive API calls
  const debouncedSave = useCallback(
    debounce((template: habitTemplateType) => {
      if (session?.user?.id && template.categories.length > 0) {
        const templateWithUserId = {
          ...template,
          userId: session.user.id
        }
        saveTemplate(templateWithUserId)
        console.log('💾 Saving habit template to database...')
      }
    }, 2000), // Wait 2 seconds after last change
    [saveTemplate, session?.user?.id]
  )

  // Save template whenever it changes
  const saveHabitTemplate = useCallback(() => {
    if (habitTemplate && session?.user?.id) {
      debouncedSave(habitTemplate)
    }
  }, [habitTemplate, session?.user?.id, debouncedSave])

  return {
    saveHabitTemplate,
    isLoading: isPending,
    error
  }
}
