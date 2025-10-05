'use server'
import { getServerSession } from "next-auth";
import dbConnect from "@/z-deprecated/lib-old/dbConnect";
import Note from "@/z-deprecated/lib-old/models/Note";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from 'next/cache';
import Label from "../../lib-old/models/Label";

export default async function saveNote({ heading, content, isNewNote, id, label , backgroundColor , htmlContent }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }

        await dbConnect();

        let result;
        if (isNewNote) {
            const note = new Note({ heading, content, label, userEmail: session.user.email , htmlContent , backgroundColor  });
            result = await note.save();
        } else if (id) {
            const note = await Note.findById(id);
            if (!note) {
                throw new Error('Note not found');
            }
            note.heading = heading || note.heading;
            note.content = content!== null && content || note.content;
            note.label = label || note.label;
            note.backgroundColor = backgroundColor || note.backgroundColor
            note.htmlContent = htmlContent || note.htmlContent
            result = await note.save();
           
            //following code is to change the labels id if label exsit
            if (label) {
                try {
                    const previousLabel = await Label.findOne({
                        userEmail: session.user.email,
                        notes: id
                    });


                    console.log("Previous Label found:", previousLabel);

                      
                    if (previousLabel) {
                        console.log("Previous label notes:", previousLabel.notes);

                        // Ensure notes array exists and is an array before filtering
                        if (Array.isArray(previousLabel.notes)) {
                            previousLabel.notes = previousLabel.notes.filter(noteId => noteId.toString() !== id.toString());
                            await previousLabel.save();
                            console.log("removed the note from the previous array ")
                        } else {
                            console.error('Previous label notes is not an array:', previousLabel.notes);
                        }
                    }

                    const newLabel = await Label.findOne({ 
                        userEmail: session.user.email,
                        name: label
                    });

                    if (newLabel) {
                        if (!newLabel.notes.includes(id)) {  // Check for duplicate
                            newLabel.notes.push(id);
                            await newLabel.save();
                        }
                    } else {
                        // Handle case where the new label does not exist, create it
                        const createdLabel = new Label({
                            userEmail: session.user.email,
                            name: label,
                            notes: [id]
                        });
                        await createdLabel.save();
                    }

                    console.log("Label's note updated");
                } catch (err) {
                    console.log(err);
                    console.log("Label's notes did not update!!!");
                }
            }

        } else {
            throw new Error('Invalid request');
        }

        console.log("Note saved successfully:", result);
       // const plainResult = JSON.parse(JSON.stringify(result));

//return { success: true, message: 'Note saved successfully', data: plainResult };
    } catch (err) {
        console.error('Error in saveNote:', err);
        throw err; // Re-throw the error to be handled by the caller
    }
}