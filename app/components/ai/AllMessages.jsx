
import React from 'react'
import UserMessage from './UserMessage'
import AiMessage from './AiMessage'


const AllMessages = ({ messages }) => {


    return (
        <div className="flex flex-col gap-6 mb-3 ">
            {messages.map(
                m => m.role === 'user' ? <UserMessage content={m.content} />
                    : <AiMessage content={m.content} />
            )}
        </div>
    )
}

export default AllMessages