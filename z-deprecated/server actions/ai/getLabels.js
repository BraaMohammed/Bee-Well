"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/z-deprecated/lib-old/dbConnect";
import { authOptions } from "@/lib/authOptions";
import Label from "../../lib-old/models/Label";

export default async function getLabels() {
    try {
       // console.log('Starting getLabels function');
        
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }
       // console.log('Session retrieved:', session);

        const userEmail = session.user.email;
       // console.log('User email:', userEmail);

        await dbConnect();

       // console.log('Database connected');

        const res = await Label.find({ userEmail });
        const labels = JSON.stringify(res)
       // console.log('Labels found:', labels);
        return labels;
    } catch (err) {
        console.error('Error in getLabels function:', err);
        throw err; // Optionally rethrow the error if you want it to propagate
    }
}
