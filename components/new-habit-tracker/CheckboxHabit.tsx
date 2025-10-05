"use client"
import React, { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { CheckboxHabitType } from "@/types/new-habit-tracker"
import HabitSettings from './HabitSettings'

interface CheckboxHabitProps {
  habit: CheckboxHabitType
  categoryId: string
  date: string
  initialValue?: boolean
  onValueChange?: (value: boolean) => void
}

const CheckboxHabit: React.FC<CheckboxHabitProps> = React.memo(({ 
  habit, 
  categoryId, 
  date, 
  initialValue = false,
  onValueChange
}) => {
  const [checked, setChecked] = useState<boolean>(initialValue)

  // Update local state when initialValue changes (when switching between dates)
  useEffect(() => {
    setChecked(initialValue)
  }, [initialValue])

  const handleCheckedChange = (checkedValue: boolean) => {
    setChecked(checkedValue)
    onValueChange?.(checkedValue)
  }

  return (
    <div className="flex gap-2 items-center font-normal group relative">
      <h2 className="focus:outline-none border-none">
        {habit.name}
      </h2>
      
      <Checkbox 
        className="w-4 h-4" 
        checked={checked}
        onCheckedChange={handleCheckedChange}
      />
      
      <HabitSettings habit={habit} categoryId={categoryId} />
    </div>
  )
})

CheckboxHabit.displayName = 'CheckboxHabit'

export default CheckboxHabit
