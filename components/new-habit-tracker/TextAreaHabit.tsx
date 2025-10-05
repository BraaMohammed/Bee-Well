"use client"
import React, { useState, useEffect } from 'react'
import { TextAreaHabitType } from "@/types/new-habit-tracker"
import HabitSettings from './HabitSettings'

interface TextAreaHabitProps {
  habit: TextAreaHabitType
  categoryId: string
  date: string
  initialValue?: string
  onValueChange?: (value: string) => void
}

const TextAreaHabit: React.FC<TextAreaHabitProps> = React.memo(({ 
  habit, 
  categoryId, 
  date, 
  initialValue = '',
  onValueChange 
}) => {
  const [value, setValue] = useState<string>(initialValue)

  // Update local state when initialValue changes (when switching between dates)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    onValueChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col group gap-1 font-normal relative">
      <h2 className="flex gap-2 focus:outline-none border-none">
        {habit.name}
        <HabitSettings habit={habit} categoryId={categoryId} />
      </h2>
      
      <textarea 
        className="text-neutral-950 focus:outline-none border-none rounded-xl w-[60%] p-2" 
        placeholder="enter your notes here"
        value={value}
        onChange={handleValueChange}
      />
    </div>
  )
})

TextAreaHabit.displayName = 'TextAreaHabit'

export default TextAreaHabit
