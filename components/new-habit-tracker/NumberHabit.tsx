"use client"
import React, { useState, useEffect } from 'react'
import { NumberHabitType } from "@/types/new-habit-tracker"
import HabitSettings from './HabitSettings'

interface NumberHabitProps {
  habit: NumberHabitType
  categoryId: string
  date: string
  initialValue?: number
  onValueChange?: (value: number) => void
}

const NumberHabit: React.FC<NumberHabitProps> = React.memo(({ 
  habit, 
  categoryId, 
  date, 
  initialValue = 0,
  onValueChange 
}) => {
  const [value, setValue] = useState<number>(initialValue)

  // Update local state when initialValue changes (when switching between dates)
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center group font-normal">
        <div className="flex flex-col gap-2">
          <h2 className="focus:outline-none border-none">
            {habit.name}
          </h2>
        </div>
        
        <input 
          style={{ borderRadius: "6px" }} 
          className="hover:bg-neutral-500 border-white border-[1px] bg-transparent lg:p-1 lg:w-[10%] w-[20%] text-center h-6 focus:outline-none relative" 
          type="number" 
          placeholder={habit.targetValue?.toString() || "0"}
          value={value}
          onChange={handleValueChange}
        />
        
        <HabitSettings habit={habit} categoryId={categoryId} />
      </div>
    </div>
  )
})

NumberHabit.displayName = 'NumberHabit'

export default NumberHabit
