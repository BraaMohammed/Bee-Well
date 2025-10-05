"use server"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import HomePageClient from "@/components/my-components/notes/HomePageClient"
import { getNotes } from "@/actions/getNotes";
export default async function LabelNotes({params}) {
  
    const { labelId } = params;
    const labelIdString = labelId.toString();

    // Fetch notes using Supabase action
    const notes = await getNotes({ labelName: labelIdString });

    return(
      <HomePageClient labelId={labelIdString} initialNotes={notes} />
    )     
}
