'use server'
import { supabase } from '../lib/supabase/supabase';
import type { TablesInsert } from '../types/supabase';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { Database } from "../types/supabase";

export type SaveTrackedHabitsResult = { success: boolean };

interface SaveTrackedHabitsParams {
    categories: TablesInsert<'categories'>[];
    singleHabbits: TablesInsert<'single_habbits'>[];
}

export async function saveTrackedHabits({ categories, singleHabbits }: SaveTrackedHabitsParams): Promise<SaveTrackedHabitsResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to save habits');
        }

        // Upsert categories
        for (const category of categories) {
            await supabase
                .from('categories')
                .upsert({ ...category, userid: session.user.id });
        }

        // Upsert single habbits
        for (const habbit of singleHabbits) {
            await supabase
                .from('single_habbits')
                .upsert({ ...habbit });
        }

        return { success: true };
    } catch (error) {
        console.error('Error in saveTrackedHabits:', error);
        throw error;
    }
}
