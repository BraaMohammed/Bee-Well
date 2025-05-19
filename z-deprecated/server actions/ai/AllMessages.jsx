
import React from 'react'
import UserMessage from './UserMessage'
import AiMessage from './AiMessage'


const AllMessages = ({ messages }) => {


    return (
        <div className="flex flex-col gap-6 mb-3 ">
            {messages.map(
                m => m.role === 'user' ? <UserMessage key={m.id} content={m.content} />
                    : <AiMessage key={m.id} content={m.content} />
            )}
        </div>
    )
}

export default AllMessages