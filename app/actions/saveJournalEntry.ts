'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase/supabase";
import { JournalEntry } from "@/types/journalRelatedTypes";
import { parseNestedJSON } from "@/lib/parseNestedJson";
import { Json } from "@/types/supabase";
import { v4 } from "uuid";
/**
 * Saves or updates a journal entry for a specific date
 * 
 * @description
 * This action handles saving journal entries. It ensures that only one entry
 * exists per day per user. If an entry already exists for the specified date,
 * it will be updated. Otherwise, a new entry will be created.
 * 
 * The content is saved as BlockNote editor content, allowing rich text formatting
 * and maintaining consistency with the template structure.
 * 
 * @param date - The date for which to save the entry
 * @param content - The BlockNote editor content to be saved
 * @returns The saved journal entry object
 * @throws Error if user is not authenticated
 * @throws Error if database operation fails
 * @throws Error if validation fails (e.g., future dates)
 */
export async function saveJournalEntry(date: Date, content: Json): Promise<JournalEntry> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        throw new Error('You must be logged in to save a journal entry');
    }


    // Check if an entry already exists for this date
    const { data: existingEntry } = await supabase
        .from('journal_entries')
        .select()
        .eq('userId', session.user.id)
        .eq('date', date.toISOString().split('T')[0])
        .single();

    if (existingEntry) {
        // Update existing entry
        const { data, error } = await supabase
            .from('journal_entries')
            .update({
                content,
                updatedAt: new Date().toISOString()
            })
            .eq('id', existingEntry.id)
            .select()
            .single();

        if (error) throw error;
        return parseNestedJSON(data);
    } else {
        // Create new entry
        const { data, error } = await supabase
            .from('journal_entries')
            .insert({
                id: v4(),
                userId: session.user.id,
                date: date.toISOString().split('T')[0],
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return parseNestedJSON(data);
    }
}
