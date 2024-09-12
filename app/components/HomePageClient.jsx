"use client"
import RenderNotes from './RenderNotes'
import Sidebar from './Sidebar'
import SidebarMobile from './SidebarMobile'
import { useState } from 'react'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import React from 'react'
import Input from './Input'
import NoteCardSkeleton from './NoteCardSkeleton'
import PwaInstallPrompt from './PwaInstallPrompt'


const HomePageClient = ({ labelId }) => {
    const [notes, setNotes] = useState([]);
    const [originalNotes, setOriginalNotes] = useState([]);
    const { data: session, status } = useSession()
    const [tiggerRefresh, setTiggerRefresh] = useState(false)
    const [searchQuery, setSearchQuery] = useState(undefined)
    const [loading, setLoading] = useState(true);
    const [isInitialFetch, setIsInitialFetch] = useState(true);

    let userName
    if (session) {
        userName = session.user.name
    }

    const fetchNotes = async () => {
        setLoading(true);
        try {
            if (labelId) {
                const response = await fetch(`/api/getnotes?labelId=${encodeURIComponent(labelId)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const fetchedNotes = await response.json();
                    setNotes(fetchedNotes);
                    setOriginalNotes(fetchedNotes);
                    console.log('we got the notes from the db')
                    setLoading(false)
                    setIsInitialFetch(false);

                } else {
                    console.error('Failed to fetch notes:', response.status, response.statusText);
                }
            } else {
                const response = await fetch('/api/getnotes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const fetchedNotes = await response.json();
                    setNotes(fetchedNotes);
                    setOriginalNotes(fetchedNotes);
                    console.log('we got the notes from the db')
                    setLoading(false)
                    setIsInitialFetch(false);

                } else {
                    console.error('Failed to fetch notes:', response.status, response.statusText);
                }
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };




    useEffect(() => {
        fetchNotes()
        if (tiggerRefresh) {
            setTiggerRefresh(false);
        }
    }, [tiggerRefresh]);


    useEffect(
        () => {
            if (searchQuery !== undefined) {
                const filteredNotes = originalNotes.filter(note => note.heading.includes(searchQuery) || note.content.includes(searchQuery))
                setNotes(filteredNotes);
            }
            else {
                setNotes(originalNotes);
            }

        }, [searchQuery, originalNotes]
    )






    return (
        <div className="bg-neutral-300 flex lg:gap-x-4">
            <PwaInstallPrompt/>
            <Sidebar refreshFunction={setTiggerRefresh} />
            <div className="lg:ml-[15vw] flex flex-col items-center w-full pt-10 gap-0">
                <div className=" lg:pt-12 pt-2 flex flex-col md:flex-row gap-4 items-center">
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