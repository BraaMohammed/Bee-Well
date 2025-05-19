'use server'
import { supabase } from '@/lib/supabase/supabase';
import { TablesUpdate } from '@/types/supabase';
import type { Database } from "../types/supabase";

export type SaveDailyEntryResult = Database["public"]["Tables"]["habbit_entry"]["Row"];

interface SaveDailyEntryParams {
    id: string;
    completed: boolean;
    date: string;
    habbitid: string;
    value?: string | null;
}

export async function saveDailyEntry({ id, completed, date, habbitid, value }: SaveDailyEntryParams): Promise<SaveDailyEntryResult> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('You must be logged in to save daily entries');
        }
        const { data: updatedEntry, error } = await supabase
            .from('habbit_entry')
            .update({
                completed,
                date,
                habbitid,
                value
            })
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return updatedEntry;
    } catch (error) {
        console.error('Error in saveDailyEntry:', error);
        throw error;
    }
}
