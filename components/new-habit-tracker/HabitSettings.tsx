"use client"
import React, { useState, useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { 
    CheckboxHabitType, 
    SelectHabitType, 
    NumberHabitType, 
    TextAreaHabitType 
} from '@/types/new-habit-tracker'

type HabitType = CheckboxHabitType | SelectHabitType | NumberHabitType | TextAreaHabitType

interface HabitSettingsProps {
    habit: HabitType
    categoryId: string
}

const HabitSettings: React.FC<HabitSettingsProps> = ({ habit, categoryId }) => {
    const { updateHabit, deleteHabit } = useHabitStore()
    
    // Local state for editing
    const [currentName, setCurrentName] = useState(habit.name)
    const [currentDescription, setCurrentDescription] = useState(habit.description)
    const [currentImportance, setCurrentImportance] = useState(habit.importance)
    
    // Type-specific states
    const [currentTarget, setCurrentTarget] = useState(() => {
        if (habit.habitType === 'number') {
            return (habit as NumberHabitType).targetValue?.toString() || ''
        }
        if (habit.habitType === 'select') {
            return (habit as SelectHabitType).bestOption || ''
        }
        return ''
    })
    
    const [currentShouldBeDone, setCurrentShouldBeDone] = useState(() => {
        if (habit.habitType === 'checkbox') {
            return (habit as CheckboxHabitType).shouldBeDone ?? true
        }
        return true
    })
    
    const [currentOptions, setCurrentOptions] = useState(() => {
        if (habit.habitType === 'select') {
            return [...(habit as SelectHabitType).options]
        }
        return []
    })
    
    const [newOption, setNewOption] = useState('')

    // Reset local state when habit changes
    useEffect(() => {
        setCurrentName(habit.name)
        setCurrentDescription(habit.description)
        setCurrentImportance(habit.importance)
        
        if (habit.habitType === 'number') {
            setCurrentTarget((habit as NumberHabitType).targetValue?.toString() || '')
        } else if (habit.habitType === 'select') {
            setCurrentTarget((habit as SelectHabitType).bestOption || '')
            setCurrentOptions([...(habit as SelectHabitType).options])
        }
        
        if (habit.habitType === 'checkbox') {
            setCurrentShouldBeDone((habit as CheckboxHabitType).shouldBeDone ?? true)
        }
    }, [habit])

    const getImportanceText = (imp: number) => {
        switch (imp) {
            case 0.5:
                return "Minor (1/5)"
            case 0.625:
                return "Moderate (2/5)"
            case 0.75:
                return "Important (3/5)"
            case 0.875:
                return "Critical (4/5)"
            case 1:
                return "Essential (5/5)"
            default:
                return "Important (3/5)"
        }
    }

    const getTargetText = () => {
        if (habit.habitType === 'number') {
            return currentTarget || "set target number"
        }
        if (habit.habitType === 'select') {
            return currentTarget || "select the best option"
        }
        return ""
    }

    const handleAddOption = () => {
        if (newOption.trim() && !currentOptions.includes(newOption.trim())) {
            setCurrentOptions([...currentOptions, newOption.trim()])
            setNewOption('')
        }
    }

    const handleRemoveOption = (optionToRemove: string) => {
        setCurrentOptions(currentOptions.filter(opt => opt !== optionToRemove))
        // If removed option was the current target, clear it
        if (currentTarget === optionToRemove) {
            setCurrentTarget('')
        }
    }

    const handleSubmit = () => {
        const baseUpdates = {
            name: currentName,
            description: currentDescription,
            importance: currentImportance
        }

        let typeSpecificUpdates = {}

        switch (habit.habitType) {
            case 'checkbox':
                typeSpecificUpdates = {
                    shouldBeDone: currentShouldBeDone
                }
                break
            case 'number':
                typeSpecificUpdates = {
                    targetValue: currentTarget ? parseFloat(currentTarget) : undefined
                }
                break
            case 'select':
                typeSpecificUpdates = {
                    options: currentOptions,
                    bestOption: currentTarget
                }
                break
        }

        const updates = { ...baseUpdates, ...typeSpecificUpdates }
        updateHabit(categoryId, habit.id, updates)
    }

    const handleDelete = () => {
        // TODO: Add confirmation dialog in the future
        deleteHabit(categoryId, habit.id)
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Settings
                    className="lg:hidden lg:group-hover:block block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1"
                    size={18}
                />
            </AlertDialogTrigger>
            <AlertDialogContent
                style={{ borderRadius: "15px" }}
                className="bg-neutral-600 border-none shadow-none flex flex-col gap-6 p-4 items-center max-w-md max-h-[80vh] overflow-y-auto"
            >
                <p className="text-center font-semibold">Edit Habit Settings</p>

                {/* Habit Name */}
                <div className="w-full">
                    <label className="flex flex-col gap-2 w-full">
                        <span>Habit Name</span>
                        <input
                            style={{ borderRadius: "5px" }}
                            className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 p-2 focus:outline-none"
                            type="text"
                            value={currentName}
                            onChange={(e) => setCurrentName(e.target.value)}
                        />
                    </label>
                </div>

                {/* Habit Description */}
                <div className="w-full">
                    <label className="flex flex-col gap-2 w-full">
                        <span>Description</span>
                        <textarea
                            style={{ borderRadius: "5px" }}
                            className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 p-2 focus:outline-none resize-none"
                            rows={3}
                            value={currentDescription}
                            onChange={(e) => setCurrentDescription(e.target.value)}
                        />
                    </label>
                </div>

                {/* Target Number (for number habits) */}
                {habit.habitType === 'number' && (
                    <div className="w-full">
                        <label className="flex justify-between items-center w-full">
                            <span>Set Target Number</span>
                            <input
                                style={{ borderRadius: "5px" }}
                                className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 lg:p-1 w-[30%] text-center h-8 focus:outline-none"
                                type="number"
                                value={currentTarget}
                                onChange={(e) => setCurrentTarget(e.target.value)}
                            />
                        </label>
                    </div>
                )}

                {/* Best Option (for select habits) */}
                {habit.habitType === 'select' && (
                    <div className="w-full">
                        <label className="flex justify-between items-center w-full">
                            <span>Select The Best Option</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-2 group flex gap-2 items-center justify-between min-w-[120px]"
                                    >
                                        {getTargetText()} <ChevronDown />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                    {currentOptions.map((option, index) => (
                                        <div
                                            key={index}
                                            style={{ borderRadius: "6px" }}
                                            className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                            onClick={() => setCurrentTarget(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </label>
                    </div>
                )}

                {/* Manage Options (for select habits) */}
                {habit.habitType === 'select' && (
                    <div className="w-full">
                        <label className="flex flex-col gap-2 w-full">
                            <span>Manage Options</span>
                            <div className="flex gap-2">
                                <input
                                    style={{ borderRadius: "5px" }}
                                    className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 p-1 focus:outline-none flex-1"
                                    type="text"
                                    placeholder="Add new option"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                                />
                                <button
                                    onClick={handleAddOption}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                                {currentOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-1 bg-neutral-700 rounded"
                                    >
                                        <span className="text-sm">{option}</span>
                                        <button
                                            onClick={() => handleRemoveOption(option)}
                                            className="text-red-400 hover:text-red-600 px-1"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </label>
                    </div>
                )}

                {/* Importance */}
                <div className="w-full">
                    <label className="flex justify-between items-center w-full">
                        <span>How Important is this habit</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-2 group flex gap-2 items-center justify-between min-w-[120px]"
                                >
                                    {getImportanceText(currentImportance)} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                {[
                                    { value: 0.5, label: "Minor (1/5)" },
                                    { value: 0.625, label: "Moderate (2/5)" },
                                    { value: 0.75, label: "Important (3/5)" },
                                    { value: 0.875, label: "Critical (4/5)" },
                                    { value: 1, label: "Essential (5/5)" }
                                ].map(({ value, label }) => (
                                    <div
                                        key={value}
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                        onClick={() => setCurrentImportance(value as any)}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </label>
                </div>

                {/* Should Be Done (for checkbox habits) */}
                {habit.habitType === 'checkbox' && (
                    <div className="w-full">
                        <label className="flex justify-between items-center w-full">
                            <span>This Habit Should Be Done Or Should Be Avoided</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-2 group flex gap-2 items-center justify-between min-w-[120px]"
                                    >
                                        {currentShouldBeDone ? "should be done" : "should be avoided"} <ChevronDown />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                        onClick={() => setCurrentShouldBeDone(true)}
                                    >
                                        Should Be Done
                                    </div>
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                        onClick={() => setCurrentShouldBeDone(false)}
                                    >
                                        Should Be Avoided
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </label>
                    </div>
                )}

                <div className='flex gap-2'>
                    <AlertDialogAction
                        className="px-4 py-1 bg-green-600 hover:bg-green-800 ease-in-out duration-300 rounded-xl"
                        onClick={handleSubmit}
                    >
                        Save Settings
                    </AlertDialogAction>
                    <AlertDialogAction
                        className="px-4 py-1 bg-red-600 hover:bg-red-800 ease-in-out duration-300 rounded-xl"
                        onClick={handleDelete}
                    >
                        Delete Habit
                    </AlertDialogAction>
                    <AlertDialogCancel className='px-4 py-1 bg-neutral-300 text-black hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'>
                        Cancel
                    </AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default HabitSettings
