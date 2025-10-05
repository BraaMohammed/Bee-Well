"use client"
import React, { useState } from 'react'
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
import { Plus } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { 
    CheckboxHabitType, 
    SelectHabitType, 
    NumberHabitType, 
    TextAreaHabitType 
} from '@/types/new-habit-tracker'

interface NewHabitSettingsProps {
    categoryId: string
}

const NewHabitSettings: React.FC<NewHabitSettingsProps> = ({ categoryId }) => {
    const { addHabit } = useHabitStore()
    
    // Form state
    const [habitName, setHabitName] = useState('')
    const [habitDescription, setHabitDescription] = useState('')
    const [habitType, setHabitType] = useState<'checkbox' | 'select' | 'number' | 'textArea'>('checkbox')
    const [importance, setImportance] = useState<0.5 | 0.625 | 0.75 | 0.875 | 1>(0.75)
    
    // Type-specific states
    const [targetValue, setTargetValue] = useState('')
    const [shouldBeDone, setShouldBeDone] = useState(true)
    const [options, setOptions] = useState<string[]>([])
    const [bestOption, setBestOption] = useState('')
    const [newOption, setNewOption] = useState('')
    
    // Dialog state
    const [open, setOpen] = useState(false)

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

    const getHabitTypeText = (type: string) => {
        switch (type) {
            case 'checkbox':
                return 'Checkbox (Yes/No)'
            case 'number':
                return 'Number Input'
            case 'select':
                return 'Dropdown Selection'
            case 'textArea':
                return 'Text Area'
            default:
                return 'Checkbox (Yes/No)'
        }
    }

    const handleAddOption = () => {
        if (newOption.trim() && !options.includes(newOption.trim())) {
            setOptions([...options, newOption.trim()])
            setNewOption('')
        }
    }

    const handleRemoveOption = (optionToRemove: string) => {
        setOptions(options.filter(opt => opt !== optionToRemove))
        if (bestOption === optionToRemove) {
            setBestOption('')
        }
    }

    const resetForm = () => {
        setHabitName('')
        setHabitDescription('')
        setHabitType('checkbox')
        setImportance(0.75)
        setTargetValue('')
        setShouldBeDone(true)
        setOptions([])
        setBestOption('')
        setNewOption('')
    }

    const handleSubmit = () => {
        if (!habitName.trim()) return

        const baseHabit = {
            id: `habit-${Date.now()}`,
            name: habitName.trim(),
            description: habitDescription.trim(),
            importance: importance,
            habitType: habitType
        }

        let newHabit: CheckboxHabitType | SelectHabitType | NumberHabitType | TextAreaHabitType

        switch (habitType) {
            case 'checkbox':
                newHabit = {
                    ...baseHabit,
                    habitType: 'checkbox',
                    shouldBeDone: shouldBeDone
                } as CheckboxHabitType
                break
            case 'number':
                newHabit = {
                    ...baseHabit,
                    habitType: 'number',
                    targetValue: targetValue ? parseFloat(targetValue) : undefined
                } as NumberHabitType
                break
            case 'select':
                newHabit = {
                    ...baseHabit,
                    habitType: 'select',
                    options: [...options],
                    bestOption: bestOption
                } as SelectHabitType
                break
            case 'textArea':
                newHabit = {
                    ...baseHabit,
                    habitType: 'textArea'
                } as TextAreaHabitType
                break
        }

        addHabit(categoryId, newHabit)
        resetForm()
        setOpen(false)
    }

    const handleCancel = () => {
        resetForm()
        setOpen(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Plus
                    className="lg:hidden active:opacity-60 block lg:group-hover:block hover:text-green-500 ease-in-out duration-300"
                    size={20}
                />
            </AlertDialogTrigger>
            <AlertDialogContent
                style={{ borderRadius: "15px" }}
                className="bg-neutral-600 border-none shadow-none flex flex-col gap-6 p-4 items-center max-w-md max-h-[80vh] overflow-y-auto"
            >
                <p className="text-center font-semibold">Create New Habit</p>

                {/* Habit Name */}
                <div className="w-full">
                    <label className="flex flex-col gap-2 w-full">
                        <span>Habit Name *</span>
                        <input
                            style={{ borderRadius: "5px" }}
                            className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 p-2 focus:outline-none"
                            type="text"
                            placeholder="Enter habit name"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
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
                            placeholder="Enter habit description"
                            value={habitDescription}
                            onChange={(e) => setHabitDescription(e.target.value)}
                        />
                    </label>
                </div>

                {/* Habit Type */}
                <div className="w-full">
                    <label className="flex justify-between items-center w-full">
                        <span>Habit Type</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <div
                                    style={{ borderRadius: "6px" }}
                                    className="hover:bg-neutral-500 p-2 group flex gap-2 items-center justify-between min-w-[140px]"
                                >
                                    {getHabitTypeText(habitType)} <ChevronDown />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                {[
                                    { value: 'checkbox', label: 'Checkbox (Yes/No)' },
                                    { value: 'number', label: 'Number Input' },
                                    { value: 'select', label: 'Dropdown Selection' },
                                    { value: 'textArea', label: 'Text Area' }
                                ].map(({ value, label }) => (
                                    <div
                                        key={value}
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                        onClick={() => setHabitType(value as any)}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </label>
                </div>

                {/* Target Number (for number habits) */}
                {habitType === 'number' && (
                    <div className="w-full">
                        <label className="flex justify-between items-center w-full">
                            <span>Set Target Number</span>
                            <input
                                style={{ borderRadius: "5px" }}
                                className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 lg:p-1 w-[30%] text-center h-8 focus:outline-none"
                                type="number"
                                placeholder="0"
                                value={targetValue}
                                onChange={(e) => setTargetValue(e.target.value)}
                            />
                        </label>
                    </div>
                )}

                {/* Should Be Done (for checkbox habits) */}
                {habitType === 'checkbox' && (
                    <div className="w-full">
                        <label className="flex justify-between items-center w-full">
                            <span>This Habit Should Be Done Or Should Be Avoided</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-2 group flex gap-2 items-center justify-between min-w-[120px]"
                                    >
                                        {shouldBeDone ? "should be done" : "should be avoided"} <ChevronDown />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                        onClick={() => setShouldBeDone(true)}
                                    >
                                        Should Be Done
                                    </div>
                                    <div
                                        style={{ borderRadius: "6px" }}
                                        className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                        onClick={() => setShouldBeDone(false)}
                                    >
                                        Should Be Avoided
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </label>
                    </div>
                )}

                {/* Options Management (for select habits) */}
                {habitType === 'select' && (
                    <>
                        <div className="w-full">
                            <label className="flex flex-col gap-2 w-full">
                                <span>Add Options</span>
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
                                {options.length > 0 && (
                                    <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                                        {options.map((option, index) => (
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
                                )}
                            </label>
                        </div>

                        {/* Best Option (for select habits) */}
                        {options.length > 0 && (
                            <div className="w-full">
                                <label className="flex justify-between items-center w-full">
                                    <span>Select The Best Option</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <div
                                                style={{ borderRadius: "6px" }}
                                                className="hover:bg-neutral-500 p-2 group flex gap-2 items-center justify-between min-w-[120px]"
                                            >
                                                {bestOption || "select best option"} <ChevronDown />
                                            </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                                            {options.map((option, index) => (
                                                <div
                                                    key={index}
                                                    style={{ borderRadius: "6px" }}
                                                    className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between cursor-pointer"
                                                    onClick={() => setBestOption(option)}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </label>
                            </div>
                        )}
                    </>
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
                                    {getImportanceText(importance)} <ChevronDown />
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
                                        onClick={() => setImportance(value as any)}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </label>
                </div>

                <div className='flex gap-2'>
                    <AlertDialogAction
                        className="px-4 py-1 bg-green-600 hover:bg-green-800 ease-in-out duration-300 rounded-xl"
                        onClick={handleSubmit}
                        disabled={!habitName.trim()}
                    >
                        Create Habit
                    </AlertDialogAction>
                    <AlertDialogCancel 
                        className='px-4 py-1 bg-neutral-300 text-black hover:bg-neutral-500 ease-in-out duration-300 rounded-xl'
                        onClick={handleCancel}
                    >
                        Cancel
                    </AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default NewHabitSettings
