"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import { redirect } from 'next/navigation';
import JournalPageClient from "@/components/my-components/journal/JournalPageClient";

export default async function JournalPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/signin');
    }
    return (
        <>
            <JournalPageClient />
        </>
    );
}
