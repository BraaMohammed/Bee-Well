'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/supabase/supabase";
import { JournalTemplate } from "@/types/journalRelatedTypes";
import { parseNestedJSON } from "@/lib/parseNestedJson";
import { v4 } from "uuid"; // Added import for v4

/**
 * Saves or updates a user's journal template.
 *
 * @description
 * This action handles both creating a new template and updating an existing one.
 * Each user can only have one active template. If a template already exists,
 * it will be updated. If no template exists, a new one will be created.
 * The template content is expected to be BlockNote editor content.
 *
 * @param content - The BlockNote editor content (or any JSON structure) to be saved as the template.
 * @returns {Promise<JournalTemplate>} A promise that resolves to the saved or updated journal template.
 * @throws {Error} If the user is not authenticated.
 * @throws {Error} If there's an issue with the database operation.
 */
export async function saveJournalTemplate(content: any): Promise<JournalTemplate> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) { // Added check for session.user.id
        throw new Error('You must be logged in to save a template');
    }


    // First check if user already has a template
    const { data: existingTemplate } = await supabase
        .from('journal_templates')
        .select()
        .eq('userId', session.user.id)
        .single();

    if (existingTemplate) {
        // Update existing template
        const { data, error } = await supabase
            .from('journal_templates')
            .update({
                content,
                updatedAt: new Date().toISOString()
            })
            .eq('userId', session.user.id) // Ensured using session.user.id
            .select()
            .single();

        if (error) throw error;
        return parseNestedJSON(data);
    } else {
        // Create new template
        const { data, error } = await supabase
            .from('journal_templates')
            .insert({
                id: v4(), // Added id generation
                userId: session.user.id,
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
