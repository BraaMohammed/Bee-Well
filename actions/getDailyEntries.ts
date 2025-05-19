'use server'
import { supabase } from '../lib/supabase/supabase';
import { getServerSession } from "next-auth";
import { authOptions } from '../lib/authOptions';
import type { Database } from "../types/supabase";

export type GetDailyEntriesResult = Database["public"]["Tables"]["habbit_entry"]["Row"][];

export async function getDailyEntries(): Promise<GetDailyEntriesResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to get daily entries');
        }

        // Get all daily entries for the user
        const { data: entries, error } = await supabase
            .from('habbit_entry')
            .select('*')
            .eq('userid', session.user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        return entries;

    } catch (error) {
        console.error('Error in getDailyEntries:', error);
        throw error;
    }
}
