"use client"
import React from 'react'
import { CheckboxHabitType, SelectHabitType, NumberHabitType, TextAreaHabitType } from "@/types/new-habit-tracker"
import CheckboxHabit from './CheckboxHabit'
import SelectHabit from './SelectHabit'
import NumberHabit from './NumberHabit'
import TextAreaHabit from './TextAreaHabit'

type HabitType = CheckboxHabitType | SelectHabitType | NumberHabitType | TextAreaHabitType

interface HabitRendererProps {
  habit: HabitType
  categoryId: string
  date: string
  initialValue?: any
  onValueChange?: (value: any) => void
}

const HabitRenderer: React.FC<HabitRendererProps> = React.memo(({ habit, categoryId, date, initialValue, onValueChange }) => {
  switch (habit.habitType) {
    case 'checkbox':
      return <CheckboxHabit habit={habit as CheckboxHabitType} categoryId={categoryId} date={date} initialValue={initialValue} onValueChange={onValueChange} />
    case 'select':
      return <SelectHabit habit={habit as SelectHabitType} categoryId={categoryId} date={date} initialValue={initialValue} onValueChange={onValueChange} />
    case 'number':
      return <NumberHabit habit={habit as NumberHabitType} categoryId={categoryId} date={date} initialValue={initialValue} onValueChange={onValueChange} />
    case 'textArea':
      return <TextAreaHabit habit={habit as TextAreaHabitType} categoryId={categoryId} date={date} initialValue={initialValue} onValueChange={onValueChange} />
    default:
      return <div>Unknown habit type</div>
  }
})

HabitRenderer.displayName = 'HabitRenderer'

export default HabitRenderer
