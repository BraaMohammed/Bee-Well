"use client"
import React, { useState, useEffect } from 'react'
import { MdDeleteForever } from "react-icons/md"
import { RiArrowDropDownLine } from "react-icons/ri"
import { SelectHabitType } from "@/types/new-habit-tracker"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import HabitSettings from './HabitSettings'

interface SelectHabitProps {
  habit: SelectHabitType
  categoryId: string
  date: string
  initialValue?: string
  onValueChange?: (value: string) => void
}

const SelectHabit: React.FC<SelectHabitProps> = React.memo(({ 
  habit, 
  categoryId, 
  date, 
  initialValue = 'select an option',
  onValueChange 
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(initialValue)

  // Update local state when initialValue changes (when switching between dates)
  useEffect(() => {
    setSelectedValue(initialValue)
  }, [initialValue])

  const handleOptionSelect = (option: string) => {
    setSelectedValue(option)
    onValueChange?.(option)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex lg:gap-2 gap-1 group">
        <h2 className="focus:outline-none border-none m-[6px] lg:mt-1">
          {habit.name}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center bg-neutral-600 lg:px-2 px-0.5 rounded-xl relative">
            {selectedValue}
            <RiArrowDropDownLine size={30} />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="flex flex-col gap-1 shadow-lg rounded-xl lg:p-2 p-1 shadow-neutral-950 border-none bg-neutral-600">
            {habit.options && habit.options.map((option, index) => (
              <p 
                key={index} 
                style={{ borderRadius: "5px" }} 
                className="hover:bg-neutral-500 p-1 text-xs lg:text-sm flex gap-2 items-center justify-between cursor-pointer"
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </p>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <HabitSettings habit={habit} categoryId={categoryId} />
      </div>
    </div>
  )
})

SelectHabit.displayName = 'SelectHabit'

export default SelectHabit
