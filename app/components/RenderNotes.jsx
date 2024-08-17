
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';

const RenderNotes = ({notes , refreshFunction}) => {
   

    const [currentNotesFromDb , setCurrentNotesFromDb  ] = useState(notes)

    useEffect(
        ()=>{
            if(notes){
                setCurrentNotesFromDb(notes)
            }

        }, [notes]
    )
   

    return (
        <div className="flex flex-wrap h-full w-full gap-6 px-8 scrollbar-thin  py-14 items-start min-h-[100vh]">
            {currentNotesFromDb.map(note => (
                <Card 
                    refreshFunction={refreshFunction}
                    id={note._id} 
                    key={note._id} 
                    headingContentFromTheDb={note.heading} 
                    intialContentFocused={note.content} 
                    labelFromDb={note.label}
                    backgroundColorFromDb={note.backgroundColor}
                    dateFromDb= {note.created_at}
                />
            ))}
        </div>
    );
}

export default RenderNotes;








 // const [refresh, setRefresh] = useState(false);
    // const [notes, setNotes] = useState([]);

    // const fetchNotes = async () => {
    //     try {
    //         const response = await fetch('/api/getnotes', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //         });

    //         if (response.ok) {
    //             const fetchedNotes = await response.json();
    //             setNotes(fetchedNotes); 
    //         } else {
    //             console.error('Failed to fetch notes:', response.status, response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error fetching notes:', error);
    //     }
    // };

    // useEffect(() => {
    //     fetchNotes();
    // }, [refresh]); 

    // const handleRefresh = useCallback((trigger) => {
    //     if(trigger){
    //         setRefresh(prevRefresh => !prevRefresh);
    //     }
       
    // }, []);