"use client"
import React, { useEffect } from 'react'
import { useHabitStore } from '@/stores/habitStore'
import { useHabitTemplateSync } from '@/hooks/useHabitTemplateSync'
import { useDailyEntries } from '@/hooks/useHabitData'
import { useLocalHabitData } from '@/hooks/useLocalHabitData'
import HabitRenderer from './HabitRenderer'
import { IoIosAddCircleOutline } from "react-icons/io"
import { MdDeleteForever } from "react-icons/md"
import CategorySettings from './CategorySettings'
import NewHabitSettings from './NewHabitSettings'

interface NewHabitTrackerProps {
  date?: string
  rawDate?: string
  onClose?: () => void
}

const NewHabitTracker: React.FC<NewHabitTrackerProps> = ({ date, rawDate, onClose }) => {
  const { 
    habitTemplate, 
    currentDate, 
    setCurrentDate,
    addCategory,
    deleteCategory 
  } = useHabitStore()
  
  const { saveHabitTemplate } = useHabitTemplateSync()
  const { 
    initializeDate, 
    getHabitValue, 
    updateHabit, 
    isDirty,
    saveOnClose,
    saveAll 
  } = useLocalHabitData()
  
  // Use provided date or current date from store
  const displayDate = date || currentDate
  // Use raw date for data operations (default to today if not provided)
  const dataDate = rawDate || new Date().toISOString().split('T')[0]

  // Fetch daily entries for this specific date to initialize local data (ONE TIME ONLY)
  const { data: dailyEntries = [], isLoading: entriesLoading } = useDailyEntries(dataDate, dataDate)
  
  // Initialize local data when daily entries are loaded (prevent race conditions)
  useEffect(() => {
    // Only initialize when we have actual data OR when loading is complete
    if (!entriesLoading) {
      if (dailyEntries.length > 0) {
        const dayEntry = dailyEntries.find(entry => entry.date === dataDate)
        console.log(`🔄 NewHabitTracker: Found ${dailyEntries.length} entries for date range`)
        console.log(`🔍 Looking for dayEntry with date: ${dataDate}`)
        console.log(`📅 Found dayEntry:`, dayEntry)
        initializeDate(dataDate, dayEntry)
      } else {
        console.log(`📝 NewHabitTracker: No entries found, initializing empty for date: ${dataDate}`)
        // Initialize empty data for this date
        initializeDate(dataDate)
      }
    } else {
      console.log(`⏳ NewHabitTracker: Still loading entries for ${dataDate}...`)
    }
  }, [dailyEntries, dataDate, initializeDate, entriesLoading])

  // Handle dialog close - save with debounce
  useEffect(() => {
    return () => {
      if (isDirty(dataDate)) {
        saveOnClose(dataDate)
      }
    }
  }, [dataDate, isDirty, saveOnClose])

  // Auto-save template changes
  useEffect(() => {
    saveHabitTemplate()
  }, [habitTemplate, saveHabitTemplate])

  // Don't render habit components until data is loaded and initialized
  if (entriesLoading) {
    return (
      <div className="flex flex-col gap-4 text-neutral-200">
        <div className="flex justify-center items-center py-8">
          <div className="text-lg">Loading habits...</div>
        </div>
      </div>
    )
  }

  // Handler for updating habits
  const handleHabitUpdate = (habitId: string, value: any) => {
    updateHabit(dataDate, habitId, value)
  }

  // Add category handler
  const handleAddCategory = () => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      description: 'Add description here',
      categoryHabits: []
    }
    addCategory(newCategory)
  }

  return (
    <div className="flex flex-col gap-4 text-neutral-200">
      {/* Header */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="lg:text-3xl text-base font-semibold">Your Daily Habits</h1>
          <p className="font-extralight lg:text-sm text-xs">
            +1% improvement every day will make you a new person
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleAddCategory}
            className="max-w-64 flex justify-center items-center gap-2 px-4 py-0.5 rounded-full lg:text-sm text-xs hover:bg-green-700 active:opacity-60 ease-in-out duration-300 bg-green-600"
          >
            Add A Category <IoIosAddCircleOutline size={25} />
          </button>
        </div>
      </div>

      {/* Categories and Habits */}
      <div className="flex flex-col gap-6">
        {habitTemplate.categories.length > 0 ? (
          habitTemplate.categories.map((category) => (
            <div key={category.id} className="flex flex-col lg:gap-4 gap-4">
              {/* Category Header */}
              <div className="flex items-center gap-2 group pt-6">
                <h2 className="lg:text-2xl text-xl font-semibold">
                  {category.name}
                </h2>
                
                <NewHabitSettings categoryId={category.id} />
                
                <CategorySettings category={category} />
                
                <MdDeleteForever 
                  onClick={() => deleteCategory(category.id)}
                  size={20} 
                  className="lg:hidden active:opacity-60 block lg:group-hover:block hover:text-red-500 ease-in-out duration-300 cursor-pointer" 
                />
              </div>

              {/* Category Description */}
              {category.description && (
                <p className="text-sm text-neutral-400 -mt-2">
                  {category.description}
                </p>
              )}

              {/* Habits List */}
              <div className="flex flex-col lg:gap-5 gap-8 text-xs md:text-sm lg:text-sm">
                {category.categoryHabits.length > 0 ? (
                  category.categoryHabits.map((habit) => (
                    <div key={habit.id}>
                      <HabitRenderer 
                        habit={habit} 
                        categoryId={category.id} 
                        date={dataDate}
                        initialValue={getHabitValue(dataDate, habit.id)}
                        onValueChange={handleHabitUpdate.bind(null, habit.id)}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-400 text-sm italic">
                    No habits in this category. Click the + to add one!
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-xl text-white">You currently have no tracked habits</p>
            <p className="text-xl text-white">Start by adding a category and add habits to it</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex self-end justify-between lg:text-sm text-xs pt-4">
        
      </div>
    </div>
  )
}

export default NewHabitTracker
