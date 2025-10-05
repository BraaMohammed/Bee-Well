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
  console.log("Session user ID: from getNotes", session.user.id);
  try {
    if (labelName) {
      const { data: notes, error } = await supabase.from("notes").select("*").eq('userId', session.user.id).eq("labelName", labelName);
      if (error) {
        console.error("Supabase error getting notes:", error);
        throw error;
      }
      return notes;
    } else {
      const { data: notes, error } = await supabase
        .from("notes")
        .select("*")
        .eq("userId", session.user.id)
        .not("labelName", "in", "(archived,deleted)");
      if (error) {
        console.error("Supabase error getting notes:", error);
        throw error;
      }
      return notes;
    }
  } catch (error) {
    console.error("Error retrieving notes:", error);
    throw new Error("Error retrieving notes");
  }
}
