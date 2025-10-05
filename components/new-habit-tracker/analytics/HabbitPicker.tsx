import React, { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { habitTemplateType, habitsCategoryType } from '@/types/new-habit-tracker';

type HabbitPickerProps = {
    habitTemplate: habitTemplateType | null;
    setSelectedHabbitsAnalytics: (h: string) => void;
    setSelectedCategoryAnalytics: (c: string) => void;
}

const HabbitPicker = ({ habitTemplate, setSelectedHabbitsAnalytics, setSelectedCategoryAnalytics }: HabbitPickerProps) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
    const [selectedHabbit, setSelectedHabbit] = useState<string | null>(null);
    const [categoryData, setCategoryData] = useState<habitsCategoryType | null>(null);

    const handleHabbitSelection = (habitId: string, habitName: string) => {
        setSelectedHabbit(habitName);
        setSelectedHabbitsAnalytics(habitId); // Pass the habit ID instead of name
    };

    const handleCategorySelection = (category: habitsCategoryType) => {
        setSelectedCategoryId(category.id);
        setSelectedCategoryName(category.name);
        setSelectedCategoryAnalytics(category.name);
        setSelectedHabbit(null); // Reset habit when category changes
        setCategoryData(null);
    };

    useEffect(() => {
        if (selectedCategoryId !== null && habitTemplate) {
            const selectedCa = habitTemplate.categories.find(c => c.id === selectedCategoryId);
            setCategoryData(selectedCa || null);
        }
    }, [selectedCategoryId, habitTemplate]);

    return (
        <div className='flex flex-col gap-3'>
            <DropdownMenu>
                <DropdownMenuTrigger className='flex ease-in-out duration-300 items-center justify-center rounded-xl px-2 hover:bg-neutral-600 hover:text-white'>
                    {selectedCategoryName || "Pick A Category"}
                    <ChevronDown />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                    {habitTemplate && Array.isArray(habitTemplate.categories) && habitTemplate?.categories?.map(category =>
                        <div key={category.id} onClick={() => handleCategorySelection(category)} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>
                            {category.name}
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            {
                selectedCategoryId !== null && categoryData &&
                <DropdownMenu>
                    <DropdownMenuTrigger className='flex ease-in-out duration-300 items-center rounded-xl px-2 hover:bg-neutral-600 hover:text-white'>
                        {selectedHabbit || "Select A Habbit"}
                        <ChevronDown />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                        {
                            categoryData.categoryHabits.map(habit =>
                                habit.habitType !== "textArea" &&
                                <div key={habit.id} onClick={() => handleHabbitSelection(habit.id, habit.name)} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>
                                    {habit.name}
                                </div>
                            )
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </div>
    );
}

export default HabbitPicker;
