"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import TrackedHabbits from "../lib/models/TrackedHabbits";
import mongoose from "mongoose";



export default async function saveTrackedHabbits({ id, newTrackedHabbits }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('You must be logged in to save a note');
    }

    await dbConnect();

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        let res;

        if (id) {
            res = await TrackedHabbits.findByIdAndUpdate(id, newTrackedHabbits, { new: true, runValidators: true, session: dbSession });
            if (!res) {
                throw new Error('Tracked habbits not found');
            }
            console.log("Tracked habbits updated");
        } 
        /*else {
            const correctedHabbits = {habbits : newTrackedHabbits.habbits[0] }
            const createdTrackedHabbits = { ...correctedHabbits, userEmail: session.user.email };
            const newTrackedHabbitsDocument = new TrackedHabbits(createdTrackedHabbits);
            res = await newTrackedHabbitsDocument.save({ session: dbSession });
            console.log("Created a new tracked habbits");
        }*/

        await dbSession.commitTransaction();
        dbSession.endSession();

        return res.toObject(); // Convert Mongoose document to plain object
    } catch (err) {
        await dbSession.abortTransaction();
        dbSession.endSession();
        console.log(err);
        throw err; // Rethrow error to be caught in submitToDb
    }
}








/*





export default async function saveTrackedHabbits({ id, newTrackedHabbits }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }
        await dbConnect();
       let res
        if (id) {
            try {
                let oldTrackedHabbits = await TrackedHabbits.findById(id)
                oldTrackedHabbits.set(newTrackedHabbits);
                 res = await oldTrackedHabbits.save();
                console.log("tracked habbits updated done")

            }
            catch (err) {
                console.log(err)
                console.log("couldnt update the exsiting tracked habbits")

            }
        } else {
            try {

                const createdTrackedHabbits = { ...newTrackedHabbits, userEmail: session.user.email };
                const newTrackedHabbitsDocument = new TrackedHabbits(createdTrackedHabbits);
                 res = await newTrackedHabbitsDocument.save();
                console.log("created a new tracked habbits")
            }
            catch (err) {
                console.log(err)
                console.log("couldnt create a new tracked habbits !!!")
            }
        }
        return res.toObject()
    } catch (err) {
        console.log(err)
    }
}








*/