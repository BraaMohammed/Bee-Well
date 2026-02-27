'use server'
import { supabase } from "../lib/supabase/supabase";
import type { Database } from "../types/supabase";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export type SaveNoteResult = Database["public"]["Tables"]["notes"]["Row"];

interface SaveNoteParams {
    heading: string;
    content?: string | null;
    isNewNote: boolean;
    id?: string;
    labelName?: string | null;
    backgroundColor?: string;
    htmlContent?: string | null;
}

export async function saveNote({
    heading,
    content,
    isNewNote,
    id,
    labelName,
    backgroundColor,
    htmlContent
}: SaveNoteParams): Promise<SaveNoteResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to get labels');
        }

        console.log('saveNote called', { heading, content, isNewNote, id, labelName, backgroundColor, htmlContent });
        // normalize undefined/null to empty string to avoid DB null constraint problems
        if (labelName === undefined || labelName === null) {
            labelName = '';
        }
        if (isNewNote) {
            const { data: note, error } = await supabase
                .from('notes')
                                //@ts-ignore

                .insert({
                    heading: heading || '',
                    content,
                    userId: session.user.id,
                    labelName: labelName, // already guaranteed to be string
                    backgroundColor: backgroundColor || 'rgb(64 64 64)',
                    htmlContent: htmlContent,
                    created_at: new Date().toISOString(),
                    id: crypto.randomUUID()
                } as any)
                .select()
                .single();
            if (error) {
                console.error('Supabase insert error', error);
                throw error;
            }
            return note;
        } else if (id) {
            console.log('updating note', id, 'session user id', session.user.id, 'labelName', labelName);
            const { data: note, error } = await supabase
                .from('notes')
                .update({
                    heading,
                    //@ts-ignore
                    content,
                    //@ts-ignore

                    labelName: labelName,
                    backgroundColor: backgroundColor,
                    //@ts-ignore

                    htmlContent: htmlContent
                } as any)
                .eq('id', id)
                .eq('userId', session.user.id)
                .select()
                .single();
            if (error) {
                console.error('Supabase update error', error);
                throw error;
            }
            return note;
        }
        throw new Error('Invalid request - missing id for update');
    } catch (error) {
        console.error('Error in saveNote:', error);
        throw error;
    }
}
