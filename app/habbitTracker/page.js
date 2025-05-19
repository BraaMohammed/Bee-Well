"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { redirect } from 'next/navigation'
import HabbitTrackerPageClient from "@/components/my-components/habbitTracker/HabbitTrackerPageClient";
import { importTrackedHabbitsToDb } from "@/lib/script/importTrackedHabbitsToDb";
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