
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';


const RenderNotes = ({ notes, refreshFunction }) => {


    const [currentNotesFromDb, setCurrentNotesFromDb] = useState(notes)

    useEffect(
        () => {
            if (notes) {
                setCurrentNotesFromDb(notes)
            }

        }, [notes]
    )


    return (
        <div className="flex flex-wrap h-full w-full gap-6 px-8 scrollbar-thin  py-14 items-start min-h-[100vh]">
            {currentNotesFromDb.map(note => (
                <Card
                    refreshFunction={refreshFunction}
                    id={note.id}
                    key={note.id}
                    headingContentFromTheDb={note.heading}
                    intialContentFocused={note.content}
                    labelFromDb={note.labelName}
                    backgroundColorFromDb={note.backgroundColor}
                    dateFromDb={note.created_at}
                    htmlIntialContent={note.htmlContent}
                />
            ))}
        </div>
    );
}

export default RenderNotes;






