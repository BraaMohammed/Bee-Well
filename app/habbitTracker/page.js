"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { redirect } from 'next/navigation'
import HabbitTrackerPageClient from "../components/habbitTracker/HabbitTrackerPageClient";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (session == null) {
        redirect('/signin');
    }

    return (
        <>
            <HabbitTrackerPageClient />


        </>
    )




}