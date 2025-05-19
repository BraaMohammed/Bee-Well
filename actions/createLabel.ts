'use server'
import { supabase } from "../lib/supabase/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from '../lib/authOptions';
import type { Database } from "../types/supabase";

export type CreateLabelResult = Database["public"]["Tables"]["labels"]["Row"];

interface CreateLabelParams {
    id?: string;
    labelName: string;
    color: string;
}

export async function createLabel({ id, labelName, color }: CreateLabelParams): Promise<CreateLabelResult> {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            throw new Error('You must be logged in to create a label');
        }

        const { data: label, error } = await supabase
            .from('labels')
                            //@ts-ignore

            .insert({
                id: id || crypto.randomUUID(),
                name: labelName,
                color,
                user_id: session.user.id
            })
            .select()
            .single();

        if (error) throw error;

        return label;
    } catch (error) {
        console.error('Error in createLabel:', error);
        throw error;
    }
}
