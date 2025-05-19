import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

interface YearPickerProps {
    availableYears: number[];
    selectedYear: number;
    onYearChange: (year: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({ 
    availableYears, 
    selectedYear, 
    onYearChange 
}) => {
    // Sort years in descending order (newest first)
    const sortedYears = [...availableYears].sort((a, b) => b - a);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex ease-in-out duration-300 items-center justify-center rounded-xl px-3 py-2 hover:bg-neutral-600 hover:text-white text-sm gap-1">
                {selectedYear}
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
                {sortedYears.map(year => (
                    <div
                        key={year}
                        onClick={() => onYearChange(year)}
                        className="hover:bg-neutral-500 p-2 rounded-md cursor-pointer text-white text-sm"
                    >
                        {year}
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default YearPicker;
