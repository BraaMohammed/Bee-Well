"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { redirect } from 'next/navigation'
import HabbitTrackerPageClient from "@/z-deprecated/habbitTracker/HabbitTrackerPageClient";
import { importTrackedHabbitsToDb } from "@/z-deprecated/script/importTrackedHabbitsToDb";
export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session == null) {
        redirect('/signin');
    }
importTrackedHabbitsToDb()
    return (
        <>
            <HabbitTrackerPageClient />


        </>
    )




}