'use server'
import { supabase } from '../lib/supabase/supabase';
import { getServerSession } from "next-auth";
import { authOptions } from '../lib/authOptions';
import type { Database } from '../types/supabase';

export type GetTrackedHabitResult = {
  categories: Database["public"]["Tables"]["categories"]["Row"][];
  habbits: Database["public"]["Tables"]["single_habbits"]["Row"][];
};

export async function getTrackedHabit(): Promise<GetTrackedHabitResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to get tracked habits');
        }

        // Get all categories and single_habbits for the user
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .eq('userid', session.user.id);
        if (catError) throw catError;

        let habbits: Database['public']['Tables']['single_habbits']['Row'][] = [];
        if (categories && categories.length > 0) {
            const categoryIds = categories.map((c: Database['public']['Tables']['categories']['Row']) => c.id);
            const { data: habbitsData, error: habbitError } = await supabase
                .from('single_habbits')
                .select('*')
                .in('categoryid', categoryIds);
            if (habbitError) throw habbitError;
            habbits = habbitsData || [];
        }

        return { categories, habbits };

    } catch (error) {
        console.error('Error in getTrackedHabit:', error);
        throw error;
    }
}
