"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import DailyEntry from "../lib/models/DailyEntry";


export default async function getDailyEntries() {

    try {

        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }

        await dbConnect();

        const res = await DailyEntry.find({userEmail: session.user.email})
        const dailyEntries =  JSON.stringify(res)
        return dailyEntries

    }catch(err){
      console.log(err)
    }
}