'use server';

import { getServerSession } from "next-auth";
import { JournalEntry } from "@/types/journalRelatedTypes";
import { supabase } from "@/lib/supabase/supabase";
import { parseNestedJSON } from "@/lib/parseNestedJson";
import { formatISO } from "date-fns";
import { authOptions } from "@/lib/authOptions";
/**
 * Retrieves all journal entries for a specific year for the authenticated user.
 *
 * @description
 * This action fetches all journal entries from the database for the given year and user ID.
 * Entries are ordered by date in descending order.
 * The 'content' field of each entry, assumed to be a JSON string, is parsed.
 * The 'date', 'createdAt', and 'updatedAt' fields of each entry are ensured to be Date objects.
 *
 * @param {number} year - The year for which to retrieve journal entries.
 * @returns {Promise<JournalEntry[]>} A promise that resolves to an array of journal entries, or an empty array if none are found.
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If there's a database error (other than no rows found).
 */
export async function getJournalEntriesByYear(year: number): Promise<JournalEntry[]> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
                        console.error('User not authenticated:', session);
        
        throw new Error('You must be logged in to get journal entries');
    }

    const userId = session.user.id;

    // Define the date range for the given year
    const startDate = formatISO(new Date(year, 0, 1), { representation: 'date' }); // January 1st
    const endDate = formatISO(new Date(year, 11, 31), { representation: 'date' }); // December 31st

    const { data, error } = await supabase
        .from('journal_entries')
        .select('id, userId, date, content, createdAt, updatedAt') // Explicitly select columns
        .eq('userId', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false }); // Order by date, newest first

    if (error) {
        console.error('Supabase error fetching journal entries by year:', error.message);
        // PGRST116 (no rows found) is not an error in this context for fetching multiple entries.
        // It simply means no entries for that year, so we return an empty array.
        if (error.code !== 'PGRST116') {
            throw new Error(`Database error: ${error.message}`);
        }
        return []; // For PGRST116 or if data is null/undefined
    }

    if (!data) {
        return []; // Should be redundant if PGRST116 is handled, but good for safety.
    }

    // Parse content and ensure date fields are Date objects for each entry
    return data.map(entry => {
        // Assuming parseNestedJSON primarily handles parsing of 'content' (e.g., from JSON string to Block[])
        // and returns the entry with other fields potentially still as they came from DB (e.g., dates as strings).
        const parsedEntry = parseNestedJSON(entry) as Omit<JournalEntry, 'date' | 'createdAt' | 'updatedAt'> & { date: string | Date, createdAt: string | Date, updatedAt: string | Date };

        // Ensure 'date' is a Date object. Supabase typically returns date/timestamp strings.
        if (parsedEntry && typeof parsedEntry.date === 'string') {
            parsedEntry.date = new Date(parsedEntry.date);
        }
        // Ensure 'createdAt' is a Date object
        if (parsedEntry && typeof parsedEntry.createdAt === 'string') {
            parsedEntry.createdAt = new Date(parsedEntry.createdAt);
        }
        // Ensure 'updatedAt' is a Date object
        if (parsedEntry && typeof parsedEntry.updatedAt === 'string') {
            parsedEntry.updatedAt = new Date(parsedEntry.updatedAt);
        }
        return parsedEntry as JournalEntry;
    });
}
