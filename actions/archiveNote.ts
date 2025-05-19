'use server'
import { supabase } from "../lib/supabase/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

export type ArchiveNoteResult = { success: boolean };

export async function archiveNote(id: string): Promise<ArchiveNoteResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to archive a note');
        }
        const userId = session.user.id;

        // Check if "archived" label exists
        const { data: existingLabel, error: labelError } = await supabase
            .from('labels')
            .select()
            .eq('name', 'archived')
            .eq('user_id', userId)
            .single();

        if (labelError && labelError.code !== 'PGNF') {
            throw labelError;
        }

        // If archived label doesn't exist, create it
        if (!existingLabel) {
            const { data: newLabel, error: createError } = await supabase
                .from('labels')
                //@ts-ignore
                .insert({
                    name: 'archived',
                    user_id: userId,
                    color: '#888888',
                    id: crypto.randomUUID()
                })
                .select()
                .single();

            if (createError) throw createError;
        }

        // Update the note to have the archived label
        const { error: updateError } = await supabase
            .from('notes')
                            //@ts-ignore

            .update({ labelname: 'archived' })
            .eq('id', id)
            .eq('user_id', userId);

        if (updateError) throw updateError;

        return { success: true };
    } catch (error) {
        console.error('Error in archiveNote:', error);
        throw error;
    }
}
