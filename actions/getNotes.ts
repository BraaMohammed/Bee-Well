"use server";
import { supabase } from "@/lib/supabase/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import type { Database } from "../types/supabase";

export type NoteRow = Database["public"]["Tables"]["notes"]["Row"];

export type GetNotesResult = NoteRow[];

interface GetNotesParams {
  labelName?: string;
}

export async function getNotes({ labelName }: GetNotesParams = {}): Promise<GetNotesResult> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    throw new Error("You must be logged in to get notes");
  }
  try {
    if (labelName) {
      const { data: notes, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("labelname", labelName);
      if (error) throw error;
      return notes;
    } else {
      const { data: notes, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", session.user.id)
        .not("labelname", "in", "(archived,deleted)");
      if (error) throw error;
      return notes;
    }
  } catch (error) {
    throw new Error("Error retrieving notes");
  }
}
