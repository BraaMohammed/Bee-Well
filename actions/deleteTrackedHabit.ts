'use server'
import { supabase } from '@/lib/supabase/supabase';

interface DeleteTrackedHabitParams {
    habbitId: string;
}

export async function deleteTrackedHabit({ habbitId }: DeleteTrackedHabitParams) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('You must be logged in to delete habits');
        }
        const { error: deleteHabbitError } = await supabase
            .from('single_habbits')
            .delete()
            .eq('id', habbitId)
            .eq('userid', session.user.id);
        if (deleteHabbitError) throw deleteHabbitError;
        return { success: true };
    } catch (error) {
        console.error('Error in deleteTrackedHabit:', error);
        throw error;
    }
}