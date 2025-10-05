'use server'
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import DailyEntry from "../lib/models/DailyEntry";
import mongoose from 'mongoose';


export default async function saveDailyEntry({ id, entriesFromClient }) {
    let session;
    try {
        session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }

        await dbConnect();

        const mongoSession = await mongoose.startSession();
        mongoSession.startTransaction();

        try {
            const existingDailyEntry = await DailyEntry.findById(id).session(mongoSession);

            if (!existingDailyEntry) {
                throw new Error("Couldn't find the current daily entry");
            }

            existingDailyEntry.entries = entriesFromClient || existingDailyEntry.entries;

            const res = await existingDailyEntry.save({ session: mongoSession });

            // Commit the transaction
            await mongoSession.commitTransaction();
            mongoSession.endSession();

            return res.toObject(); // Return the saved document if needed

        } catch (err) {
            await mongoSession.abortTransaction();
            mongoSession.endSession();
            throw err;
        }

    } catch (err) {
        console.log(err);
        throw err;
    }
}