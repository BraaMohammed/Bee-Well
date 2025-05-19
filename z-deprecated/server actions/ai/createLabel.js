"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/z-deprecated/lib-old/dbConnect";
import { authOptions } from "@/lib/authOptions";
import Label from "../../lib-old/models/Label";


export default async function createLabel({ id, labelName }) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }
        await dbConnect();

        let notesArr = []

        if (id) {
            notesArr.push(id)
        }
        console.log(notesArr)
        const label = await new Label({ name: labelName, userEmail: session.user.email, notes: notesArr })
        const res = await label.save()
        console.log(res)
        console.log("label created successfully")
    }
    catch (err) {
        console.log(err)
        console.log("label did not created successfully!!!")

    }
}

