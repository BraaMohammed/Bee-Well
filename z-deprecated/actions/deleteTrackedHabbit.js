'use server '

import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import TrackedHabbits from "../lib/models/TrackedHabbits";



export default async function deleteTrackedHabbit({ id }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }
        await dbConnect();

    }catch(err){
        console.log(err)
    
    }
}