"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import DailyEntry from "../lib/models/DailyEntry";
import { format, parseISO, isValid } from "date-fns";

export default async function createDailyEntry({ dateFromClient }) {
    try {
        if (!dateFromClient) {
            throw new Error('Invalid date: dateFromClient is undefined');
        }

        const parsedDate = parseISO(dateFromClient); // Parse the date string into a Date object

        if (!isValid(parsedDate)) {
            throw new Error('Invalid date: dateFromClient is not a valid ISO date string');
        }

        const formattedDate = format(parsedDate, 'PPPP'); // Format the date to 'PPPP'

        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }

        await dbConnect();
        let res;

        const existingDailyEntry = await DailyEntry.findOne({ userEmail: session.user.email, date: formattedDate });

        if (!existingDailyEntry) {
            const newDailyEntry = new DailyEntry({ userEmail: session.user.email, date: formattedDate, entries: [] });
            res = await newDailyEntry.save();

            console.log(`Created a new daily entry for ${formattedDate}`);
            return res.toObject();
        } else {
            console.log(`A daily entry for ${formattedDate} already exists`);
            res = existingDailyEntry;
            return res.toObject();
        }
    } catch (err) {
        console.log(err.message);
    }
}