"use client"
import RenderNotes from './RenderNotes'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import React from 'react'
import Input from './Input'
import NoteCardSkeleton from './NoteCardSkeleton'
import Sidebar from '@/components/my-components/Sidebar'
import { getNotes } from "@/actions/getNotes";

const HomePageClient = ({ labelId, initialNotes = [] }) => {
    const [notes, setNotes] = useState(initialNotes);
    const [originalNotes, setOriginalNotes] = useState(initialNotes);
    const { data: session, status } = useSession()
    const [tiggerRefresh, setTiggerRefresh] = useState(false)
    const [searchQuery, setSearchQuery] = useState(undefined)
    const [loading, setLoading] = useState(initialNotes.length === 0);
    const [isInitialFetch, setIsInitialFetch] = useState(initialNotes.length === 0);

    let userName
    if (session) {
        userName = session.user.name
    }

    // Only fetch notes if initialNotes is empty (e.g., client navigation or refresh)
    const fetchNotes = async () => {
        setLoading(true);
        try {
            let fetchedNotes = [];
            if (labelId) {
                fetchedNotes = await getNotes({ labelName: labelId });
            } else {
                fetchedNotes = await getNotes();
            }
            setNotes(fetchedNotes);
            setOriginalNotes(fetchedNotes);
            setLoading(false);
            setIsInitialFetch(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        if (initialNotes.length === 0 || tiggerRefresh) {
            fetchNotes();
            if (tiggerRefresh) {
                setTiggerRefresh(false);
            }
        }
    }, [tiggerRefresh]);

    useEffect(
        () => {
            if (searchQuery !== undefined) {
                const filteredNotes = originalNotes.filter(note => (note.heading || "").includes(searchQuery) || (note.content || "").includes(searchQuery))
                setNotes(filteredNotes);
            }
            else {
                setNotes(originalNotes);
            }

        }, [searchQuery, originalNotes]
    )

    return (
        <div className="min-h-screen w-full pt-12 px-6 lg:px-0 pb-8">
            <div className="flex flex-1 flex-col justify-start gap-8 text-neutral-950  max-w-[95rem] mx-auto">
                <div className=" lg:pt-12 pt-2 flex flex-col md:flex-row gap-4 items-center w-full justify-center items-center">
                    <p className="text-green-700 text-lg p-2 text-center">Welcome Back {userName} Search For A Note Here</p>
                    <Input captureChange={setSearchQuery} />
                </div>
                {
                    loading && isInitialFetch ? <div style={{display: "flex" , width: "100%" , height: "100vh" , flexWrap: "wrap"}} className='className="flex flex-row h-[100vh] flex-wrap w-full gap-6 px-8 scrollbar-thin  py-14 items-start min-h-[100vh]"'>
                        <NoteCardSkeleton />
                        <NoteCardSkeleton />
                        <NoteCardSkeleton />
                        <NoteCardSkeleton />
                    </div> :
                        <RenderNotes refreshFunction={setTiggerRefresh} notes={notes} />
                }

            </div>
        </div>
    );
}

export default HomePageClient






/*   useEffect(() => {
        fetchNotes();
    }, [refresh]);

    //

    const refreshFunction = useCallback((trigger) => {
        if (trigger) {
            setRefresh(prevRefresh => !prevRefresh);
        }

    }, []);*/