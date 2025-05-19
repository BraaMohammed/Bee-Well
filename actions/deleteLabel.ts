'use server'
import { supabase } from '@/lib/supabase/supabase';

export async function deleteLabel(labelName: string) {
    try {
        // Get the current user session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('You must be logged in to delete labels');
        }

        // First, update any notes that have this label to remove the label
        const { error: updateError } = await supabase
            .from('notes')
                            //@ts-ignore

            .update({ labelname: '' })
            .eq('user_id', session.user.id)
            .eq('labelname', labelName);

        if (updateError) throw updateError;

        // Then delete the label
        const { error: deleteError } = await supabase
            .from('labels')
            .delete()
            .eq('user_id', session.user.id)
            .eq('name', labelName);

        if (deleteError) throw deleteError;

        return { success: true };

    } catch (error) {
        console.error('Error in deleteLabel:', error);
        throw error;
    }
}
