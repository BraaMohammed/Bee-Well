"use client"
import React, { useState, useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { Settings } from 'lucide-react'
import { useHabitStore } from '@/stores/habitStore'
import { habitsCategoryType } from '@/types/new-habit-tracker'

interface CategorySettingsProps {
    category: habitsCategoryType
}

const CategorySettings: React.FC<CategorySettingsProps> = ({ category }) => {
    const { updateCategory } = useHabitStore()
    
    // Local state for editing
    const [currentName, setCurrentName] = useState(category.name)
    const [currentDescription, setCurrentDescription] = useState(category.description)
    
    // Dialog state
    const [open, setOpen] = useState(false)

    // Reset local state when category changes
    useEffect(() => {
        setCurrentName(category.name)
        setCurrentDescription(category.description)
    }, [category])

    const handleSubmit = () => {
        const updates = {
            name: currentName.trim(),
            description: currentDescription.trim()
        }
        updateCategory(category.id, updates)
        setOpen(false)
    }

    const handleCancel = () => {
        setCurrentName(category.name)
        setCurrentDescription(category.description)
        setOpen(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Settings
                    className="lg:hidden active:opacity-60 block lg:group-hover:block hover:text-green-500 ease-in-out duration-300"
                    size={20}
                />
            </AlertDialogTrigger>
            <AlertDialogContent
                style={{ borderRadius: "15px" }}
                className="bg-neutral-600 border-none shadow-none flex flex-col gap-6 p-4 items-center max-w-md"
            >
                <p className="text-center font-semibold">Edit Category Settings</p>

                {/* Category Name */}
                <div className="w-full">
                    <label className="flex flex-col gap-2 w-full">
                        <span>Category Name *</span>
                        <input
                            style={{ borderRadius: "5px" }}
                            className="hover:bg-neutral-500 border-white border-[1px] bg-neutral-600 p-2 focus:outline-none"
                            type="text"
                            value={currentName}
                            onChange={(e) => setCurrentName(e.target.value)}
                        />
                    </label>
                </div>

                {/* Category Description */}
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

                <div className='flex gap-2'>
                    <AlertDialogAction
                        className="px-4 py-1 bg-green-600 hover:bg-green-800 ease-in-out duration-300 rounded-xl"
                        onClick={handleSubmit}
                        disabled={!currentName.trim()}
                    >
                        Save Changes
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

export default CategorySettings
