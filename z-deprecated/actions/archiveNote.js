"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import { authOptions } from "@/app/lib/authOptions";
import Label from "../lib/models/Label";
import Note from "../lib/models/Note";




export default async function archiveNote({ id }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }

        await dbConnect();

        //finding if the note has a current label or not and if it has one delete it from the label 

        /*
        const note = await Note.findById(id)
        if (note.label) {

            console.log("found exsiting label in the note ")
            const previousLabel = await Label.findOne({
                userEmail: session.user.email,
                notes: id
            });

            if (Array.isArray(previousLabel.notes)) {
                console.log("deleted the note from its previous label ")

                previousLabel.notes = previousLabel.notes.filter(noteId => noteId.toString() !== id.toString());
                await previousLabel.save();
            }
        }
            */

        //finding if archived notes is already exsit or not if it exsits push the note id to it and if it dont exsit create it and add the note to it 
        const exsitingArchiveLabel = await Label.findOne({ userEmail: session.user.email, name: "archived" })

        if (exsitingArchiveLabel) {
            if (Array.isArray(exsitingArchiveLabel.notes)) {
                exsitingArchiveLabel.notes.push(id)
                await exsitingArchiveLabel.save();
            }
        }
        else {
            let notesArr = []
            notesArr.push(id)
            const newArchiveLabel = await new Label({ name: "archived", userEmail: session.user.email, notes: notesArr })
            const res = await newArchiveLabel.save()
            console.log(res)
        }


    }
    catch (err) {

        console.log(err)
    }
}

