'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase/supabase"; // Assuming supabase client is here
import { JournalEntry } from "@/types/journalRelatedTypes";
import { parseNestedJSON } from "@/lib/parseNestedJson"; // Assuming parseNestedJSON is here
import { formatISO } from 'date-fns';

/**
 * Retrieves a journal entry for a specific date for the authenticated user.
 *
 * @param {Date} date - The date for which to retrieve the journal entry.
 * @returns {Promise<JournalEntry | null>} A promise that resolves to the journal entry or null if not found.
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If there's a database error (other than no rows found).
 */
export async function getJournalEntryByDate(date: Date): Promise<JournalEntry | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        throw new Error('You must be logged in to get a journal entry');
    }

    const userId = session.user.id;
    const formattedDate = date.toISOString().split('T')[0]; // Format date to YYYY-MM-DD

    const { data, error } = await supabase
        .from('journal_entries')
        .select('*') // Select all columns, or specify if needed
        .eq('userId', userId)
        .eq('date', formattedDate)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // 'PGRST116' is "No rows found"
            return null; // No entry found for this date is a valid scenario
        }
        console.error('Supabase error fetching journal entry by date:', error.message);
        throw new Error('Failed to fetch journal entry by date: ' + error.message);
    }

    if (!data) {
        return null;
    }

    // Assuming content might be a JSON string that needs parsing, similar to other actions
    return parseNestedJSON(data) as JournalEntry;
}
