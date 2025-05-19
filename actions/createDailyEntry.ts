'use server'
import type { TablesInsert } from "../types/supabase";
import type { Database } from "../types/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/authOptions";
import { supabase } from "@/lib/supabase/supabase";

export type CreateDailyEntryResult = Database["public"]["Tables"]["habbit_entry"]["Row"];

interface CreateDailyEntryParams {
    completed: boolean;
    date: string;
    habbitid: string;
    value?: string | null;
}

export async function createDailyEntry({ completed, date, habbitid, value }: CreateDailyEntryParams): Promise<CreateDailyEntryResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to create a daily entry');
        }

        // Check if an entry for this habbit and date already exists
        const { data: existingEntry } = await supabase
            .from('habbit_entry')
            .select()
            .eq('userid', session.user.id)
            .eq('habbitid', habbitid)
            .eq('date', date)
            .single();

        if (existingEntry) {
            // Update existing entry
            const { data: updatedEntry, error } = await supabase
                .from('habbit_entry')
                .update({
                    completed,
                    value
                })
                .eq('id', existingEntry.id)
                .select()
                .single();

            if (error) throw error;
            return updatedEntry;
        } else {
            // Create new entry
            const { data: newEntry, error } = await supabase
                .from('habbit_entry')
                                //@ts-ignore

                .insert({
                    completed,
                    date,
                    habbitid,
                    value,
                    id: crypto.randomUUID(),
                    userid: session.user.id
                })
                .select()
                .single();

            if (error) throw error;
            return newEntry;
        }

    } catch (error) {
        console.error('Error in createDailyEntry:', error);
        throw error;
    }
}
