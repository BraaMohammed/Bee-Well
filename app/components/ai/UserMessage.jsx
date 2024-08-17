import React from 'react'
import Image from 'next/image'

const UserMessage = ({content}) => {
    return (
        <div className=' max-w-96 self-end flex gap-2  drop-shadow-2xl'>
            <div className='flex flex-col gap-2 items-end bg-neutral-600 rounded-2xl p-4 shadow-2xl shadow-neutral-500'>
                <h2 className=' lg:text-xl'>user Name</h2>
                <p>
                   {content}
                </p>
            </div>
            <Image src="/don.jpg" alt="User Photo" width={50} height={50} className="size-12 rounded-full object-cover drop-shadow-2xl shadow-2xl shadow-neutral-500" />
        </div>
    )
}

export default UserMessage