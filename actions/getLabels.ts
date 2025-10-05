'use server'
import { authOptions } from "@/lib/authOptions";
import { supabase } from "../lib/supabase/supabase";
import type { Database } from "../types/supabase";
import { getServerSession } from "next-auth";

export type GetLabelsResult = Database["public"]["Tables"]["labels"]["Row"][];

export async function getLabels(): Promise<GetLabelsResult> {
    try {
        
        // Get the current user session
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to get labels');
        }

        // Get all labels for the user
        const { data: labels, error } = await supabase
            .from('labels')
            .select('*')
            .eq('userId', session.user.id)
            .order('name', { ascending: true });

        if (error) throw error;

        return labels;
    } catch (error) {
        console.error('Error in getLabels:', error);
        throw error;
    }
}
