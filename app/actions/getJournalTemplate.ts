'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase/supabase";
import { JournalTemplate } from "@/types/journalRelatedTypes";
import { parseNestedJSON } from "@/lib/parseNestedJson"; // Added import for parseNestedJSON

/**
 * Retrieves the journal template for the currently authenticated user.
 *
 * @description
 * This action fetches the user's saved journal template from the database.
 * If no template is found (which is a valid scenario, indicated by PGRST116 error code),
 * it returns null. Other errors during database operation will be thrown.
 *
 * @returns {Promise<JournalTemplate | null>} A promise that resolves to the user's journal template or null if not found.
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If there's a database error other than "no rows returned".
 */
export async function getJournalTemplate(): Promise<JournalTemplate | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) { // Added check for session.user.id
        throw new Error('You must be logged in to get the template');
    }

    const { data, error } = await supabase
        .from('journal_templates')
        .select()
        .eq('userId', session.user.id) // Ensured using session.user.id
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
    }

    return parseNestedJSON(data); // Added parseNestedJSON
}
