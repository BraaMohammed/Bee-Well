import React from 'react'
import { useState } from 'react'

const Input = ({captureChange}) => {
  const [currentInput , setCurrentInput] = useState("")

  const handleInputChange = (e)=>{
    setCurrentInput(e.target.value)
    captureChange(e.target.value)
  }
  return (
    <div>
        <input value={currentInput} onChange={handleInputChange} className=' px-2  w-64 lg:w-96 h-10 rounded-2xl outline self-center outline-2 outline-black focus:drop-shadow-2xl ease-in-out duration-200 text-black' type="text" />
    </div>
  )
}

export default Input