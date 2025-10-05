import React from 'react'
import Image from 'next/image'

const AiMessage = ({content}) => {
    return (
        <div className=' max-w-96 self-start flex gap-2 drop-shadow-2xl'>
            <Image src="/don.jpg" alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl shadow-2xl shadow-neutral-500" />
        <div className='flex flex-col gap-2 items-start bg-neutral-600 rounded-2xl p-4 shadow-2xl shadow-neutral-500'>
            <h2 className=' lg:text-xl'>Ai Assistant</h2>
            <p>
               {content}
            </p>
        </div>
        
    </div>
    )
}

export default AiMessage


/*



*/