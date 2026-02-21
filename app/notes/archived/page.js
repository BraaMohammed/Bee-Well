"use server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import HomePageClient from "@/components/my-components/notes/HomePageClient"
import { getNotes } from "@/actions/getNotes";

export default async function archivedNotes() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    redirect("/signin");
  }

  const notes = await getNotes({ labelName: "archived" });

  return <HomePageClient labelId="archived" initialNotes={notes} />;
}