"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import TrackedHabbits from "../lib/models/TrackedHabbits";


export default async function getTrackedHabbit() {
    try{
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }
        await dbConnect();

        const res = await TrackedHabbits.findOne({userEmail: session.user.email})

        const userTrackedHabbits =  JSON.stringify(res)
          
        console.log("we got user tracked habbits from the db done !")

      return userTrackedHabbits


    }
    catch(err){
        console.log(err)
    }
}