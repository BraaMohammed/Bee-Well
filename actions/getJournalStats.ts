'use server';

import { getServerSession } from "next-auth";
import { JournalStats } from "@/types/journalRelatedTypes";
import { subDays, formatISO } from "date-fns";
import { supabase } from "@/lib/supabase/supabase";
import { authOptions } from "@/lib/authOptions";
/**
 * Retrieves journal statistics for the authenticated user over the last year.
 *
 * @description
 * This action calculates and returns statistics about the user's journal entries,
 * including the total number of entries, current streak of consecutive entry days,
 * the date of the last entry, and a list of all dates with entries in the past year.
 *
 * @returns {Promise<JournalStats>} A promise that resolves to an object containing journal statistics.
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If there's an issue with the database operation.
 */
export async function getJournalStats(): Promise<JournalStats> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
                console.error('User not authenticated:', session);

        throw new Error('You must be logged in to get journal stats');
    }

    const today = new Date();
    const yearAgo = subDays(today, 365);

    // Get all entries from the last year
    const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('date, createdAt')
        .eq('userId', session.user.id)
        .gte('date', formatISO(yearAgo, { representation: 'date' }))
        .order('date', { ascending: false });

    if (error) throw error;

    // Convert dates from strings to Date objects
    const writtenDates = entries.map(entry => new Date(entry.date));

    // Calculate stats
    const stats: JournalStats = {
        totalEntries: entries.length,
        streakDays: calculateStreak(entries.map(e => new Date(e.date))),
        lastEntryDate: entries.length > 0 ? new Date(entries[0].date) : null,
        writtenDates
    };

    return stats;
}

function calculateStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    // Sort dates in descending order
    const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = today;

    // If the most recent entry isn't from today or yesterday, streak is 0
    const mostRecent = sortedDates[0];
    mostRecent.setHours(0, 0, 0, 0);
    if (mostRecent < subDays(today, 1)) {
        return 0;
    }

    // Count consecutive days
    for (const date of sortedDates) {
        date.setHours(0, 0, 0, 0);
        if (date.getTime() === currentDate.getTime()) {
            streak++;
            currentDate = subDays(currentDate, 1);
        } else if (date.getTime() === subDays(currentDate, 1).getTime()) {
            streak++;
            currentDate = subDays(currentDate, 2);
        } else {
            break;
        }
    }

    return streak;
}
