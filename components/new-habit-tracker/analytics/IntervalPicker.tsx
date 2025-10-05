import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

type IntervalPickerProps = {
  currentInterval: number | null
  setCurrentInterval: (interval: number) => void
} 

const IntervalPicker = ({ currentInterval, setCurrentInterval }: IntervalPickerProps) => {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className='flex ease-in-out duration-300 items-center justify-center rounded-xl px-2 hover:bg-neutral-600 hover:text-white'>{currentInterval || "Pick An Interval "}<ChevronDown /> </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-2 shadow-lg rounded-xl p-2 shadow-neutral-800 border-none bg-neutral-600">
        <div onClick={() => { setCurrentInterval(5) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>5</div>
        <div onClick={() => { setCurrentInterval(4) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>4</div>
        <div onClick={() => { setCurrentInterval(3) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>3</div>
        <div onClick={() => { setCurrentInterval(2) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>2</div>
        <div onClick={() => { setCurrentInterval(1) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>1</div>
        <div onClick={() => { setCurrentInterval(0) }} style={{ borderRadius: '6px' }} className='hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between'>Show All</div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IntervalPicker
