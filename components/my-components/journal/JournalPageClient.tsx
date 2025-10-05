"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { JournalEntry, JournalTemplate, JournalStats } from '@/types/journalRelatedTypes';
import { getJournalTemplate } from '@/actions/getJournalTemplate';
import { getJournalStats } from '@/actions/getJournalStats';
import { getJournalEntriesByYear } from '@/actions/getAllJournalEntries';
import { JournalActivityChart } from '@/components/my-components/journal/JournalActivityChart';
import { JournalCard } from '@/components/my-components/journal/JournalCard';
import { TemplateEditor } from '@/components/my-components/journal/TemplateEditor';
import { useToast } from '@/hooks/use-toast';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { useSession } from "next-auth/react";
import CalendarCardSkeleton from '@/z-deprecated/habbitTracker/CalendarCardSkeleton';
import YearPicker from './YearPicker';

export default function JournalPageClient() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [template, setTemplate] = useState<JournalTemplate | null>(null);
    const [stats, setStats] = useState<JournalStats | null>(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const { data: session } = useSession();
    const [labels, setLabels] = useState([]);
    const [userPhoto, setUserPhoto] = useState<string | undefined>();
    const [refreshFlag, setRefreshFlag] = useState(false);

    const fetchData = useCallback(async (year: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const [templateData, statsData, entriesData] = await Promise.all([
                getJournalTemplate(),
                getJournalStats(),
                getJournalEntriesByYear(year)
            ]);

            if (templateData) setTemplate(templateData);
            if (statsData) setStats(statsData);
            if (entriesData) setEntries(entriesData);
        } catch (err) {
            setError("Failed to load journal data. Please try again.");
            toast({
                title: "Error",
                description: "Failed to load journal data. Please try again.",
            });
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchData(currentYear);
    }, [currentYear, fetchData]);

  

    useEffect(() => {
        if (session && session.user && session.user.image) setUserPhoto(session.user.image as string);
    }, [session]);

    const refreshFunction = () => setRefreshFlag(f => !f);

    const handleEntrySaved = () => {
        toast({
            title: "Entry saved",
            description: "Your journal entry has been saved successfully.",
        });
        fetchData(currentYear);
    };

    const handleTemplateSaved = () => {
        toast({
            title: "Template saved",
            description: "Your template has been saved! .",
        });
        fetchData(currentYear);
    };

    const handleYearChange = (increment: number) => {
        setCurrentYear(prevYear => prevYear + increment);
    };

    const writtenDatesForChart = useMemo(() => {
        if (stats && stats.writtenDates) {
            return stats.writtenDates;
        }
        return [];
    }, [stats]);

    const entriesByDate = useMemo(() => {
        const map = new Map<string, JournalEntry>();
        entries.forEach(entry => {
            map.set(entry.date.toISOString().split('T')[0], entry);
        });
        return map;
    }, [entries]);

    const datesForYear = useMemo(() => {
        return entries.map(e => e.date).sort((a, b) => b.getTime() - a.getTime());
    }, [entries]);

    // Calculate available years from entries
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        // Add current year by default
        years.add(new Date().getFullYear());
        // Add years from entries
        entries.forEach(entry => {
            years.add(entry.date.getFullYear());
        });
        return Array.from(years);
    }, [entries]);

    if (isLoading) {
        return (
            <div className="min-h-screen w-full pt-12 px-6 lg:px-0 pb-8 overflow-x-hidden bg-neutral-300">
                <div className="flex-1 flex flex-col justify-start gap-8 scrollbar-thin overflow-x-hidden overflow-y-auto max-w-[88rem] mx-auto">
                    {/* Top Section Skeleton */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <h1 className="lg:text-2xl text-xl font-semibold flex gap-2 items-center">My Journal</h1>
                                <p>Journaling is a silent conversation with your soul — each word a step toward clarity, growth</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Year:</span>
                                <div className="w-28 h-10 bg-neutral-400 rounded animate-pulse"></div>
                                <div className="w-auto px-4 h-10 bg-neutral-400 rounded animate-pulse flex items-center">
                                    <span className="text-sm text-transparent select-none">Edit Template</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Journal Cards Section Skeleton */}
                    <div className="mt-2 mb-4">
                        <h2 className="text-2xl font-semibold mb-2">Entries</h2>
                        <div className="flex gap-4">
                            <CalendarCardSkeleton isVisible={true} />
                            <CalendarCardSkeleton isVisible={true} />
                            <CalendarCardSkeleton isVisible={true} />
                            <CalendarCardSkeleton isVisible={true} />
                            <CalendarCardSkeleton isVisible={true} />
                            <CalendarCardSkeleton isVisible={true} />
                        </div>
                    </div>                    {/* Analytics Section - Rendered even during loading */}
                    <div className="w-full">
                        <JournalActivityChart writtenDates={[]} entries={[]} template={null} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full pt-12 px-6 lg:px-0 pb-8 overflow-x-hidden bg-neutral-300">
            <div className="flex flex-1 flex-col justify-start gap-8 scrollbar-thin overflow-x-hidden overflow-y-auto text-neutral-950 max-w-[95rem] mx-auto">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8"> {/* Flex-col for mobile, row for md and up */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0"> {/* Flex-col for mobile, row for md and up */}
                            <div className="w-full md:w-auto"> {/* Full width on mobile for text */}
                                <h1 className="lg:text-2xl text-xl font-semibold flex gap-2 items-center">My Journal</h1>
                                <p className="text-sm md:text-base">Journaling is a silent conversation with your soul — each word a step toward clarity, growth</p> {/* Adjusted text size for mobile */}
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto"> {/* Stack buttons on mobile, row for sm and up, full width on mobile */}
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <span className="font-medium text-sm md:text-base">Year:</span>
                                    <YearPicker
                                        availableYears={availableYears}
                                        selectedYear={currentYear}
                                        onYearChange={setCurrentYear}
                                    />
                                </div>
                                <TemplateEditor template={template || undefined} onTemplateSaved={handleTemplateSaved} /> {/* Full width button on mobile */}
                            </div>
                        </div>
                        {error && (
                            <div className="bg-red-700 border border-red-900 text-white px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                    </div>
                </div>
                {/* Journal Cards Carousel */}
                <div className="mt-2 mb-4 px-6">
                    <h2 className="text-2xl font-semibold mb-2">Entries</h2>
                    {datesForYear.length > 0 ? (
                        <Carousel
                            tabIndex={0}
                            onKeyDownCapture={(e) => {
                                // 1. if the key isn’t Left/Right, do nothing
                                if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return

                                // 2. only preventDefault if the wrapper itself is focused
                                //    i.e. e.target === e.currentTarget
                                //    any child (like your editor) will have e.target != e.currentTarget
                                if (e.target === e.currentTarget) {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }
                            }}
                            className="w-max"
                            opts={{
                                align: "start",
                                dragFree: true,
                                containScroll: false,
                                loop: false,
                                skipSnaps: false,
                                inViewThreshold: 0,
                                slidesToScroll: 1,
                                duration: 0,
                                startIndex: 0,
                                watchDrag: true,
                                axis: "x",
                            }}
                        >
                            <CarouselContent
                                className='w-fit'>
                                {datesForYear.map(date => {
                                    const entry = entriesByDate.get(date.toISOString().split('T')[0]);
                                    return (
                                        <CarouselItem key={date.toISOString()} className="pl-2 basis-auto">
                                            <div className="p-1 ">
                                                <JournalCard
                                                    entry={entry}
                                                    date={date}
                                                    templateContent={template?.content}
                                                    onSave={handleEntrySaved}
                                                />
                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>

                        </Carousel>
                    ) : (
                        <p className="text-center text-gray-400">No entries found for {currentYear}.</p>
                    )}
                </div>
                {/* Analytics Section */}
                <div className="w-full px-6 pb-20">
                    {stats && <JournalActivityChart writtenDates={writtenDatesForChart} entries={entries} template={template} />}
                </div>
            </div>
        </div>
    );
}


/*

  <CarouselPrevious className="w-10 h-10 active:bg-neutral-400 hover:bg-neutral-400 shadow-lg ease-in-out duration-300 shadow-neutral-900 rounded-xl disabled:opacity-0 text-neutral-950" />
                            <CarouselNext className="w-10 h-10 active:bg-neutral-400 hover:bg-neutral-400 shadow-lg ease-in-out duration-300 shadow-neutral-900 rounded-xl disabled:opacity-0 text-neutral-950" />


*/