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

        if (isNewNote) {
            const { data: note, error } = await supabase
                .from('notes')
                                //@ts-ignore

                .insert({
                    heading: heading || '',
                    content,
                    user_id: session.user.id,
                    labelname: labelName,
                    backgroundcolor: backgroundColor || 'rgb(64 64 64)',
                    htmlcontent: htmlContent,
                    created_at: new Date().toISOString(),
                    id: crypto.randomUUID()
                })
                .select()
                .single();
            if (error) throw error;
            return note;
        } else if (id) {
            const { data: note, error } = await supabase
                .from('notes')
                .update({
                    heading,
                    //@ts-ignore
                    content,
                    //@ts-ignore

                    labelname: labelName,
                    backgroundcolor: backgroundColor,
                    //@ts-ignore

                    htmlcontent: htmlContent
                })
                .eq('id', id)
                .eq('user_id', session.user.id)
                .select()
                .single();
            if (error) throw error;
            return note;
        }
        throw new Error('Invalid request - missing id for update');
    } catch (error) {
        console.error('Error in saveNote:', error);
        throw error;
    }
}
