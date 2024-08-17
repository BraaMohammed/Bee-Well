
/*
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import Note from "@/app/lib/models/Note";
import { authOptions } from "@/app/lib/authOptions";

//wait for now 

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'You must be logged in to save a note' }, { status: 401 });
        }

        const { heading, content, label, isNewNote, id } = await req.json();
        console.log(typeof(id))

        await dbConnect();

        if (isNewNote==true) {
            try {
                const note = new Note({ heading, content, label, userEmail: session.user.email });
                await note.save();
                return NextResponse.json({ success: true }, { status: 201 });
            } catch (err) {
                console.error(err);
                return NextResponse.json({ error: 'Error saving note' }, { status: 400 });
            }
        } else if (id) {
            try {
                const note = await Note.findById(id);
                if (!note) {
                    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
                }
                note.heading = heading || note.heading;
                note.content = content || note.content;
                note.label = label || note.label;
                await note.save();
                return NextResponse.json({ success: 'Note edited successfully' }, { status: 200 });
            } catch (err) {
                console.error(err);
                return NextResponse.json({ error: 'Error updating note' }, { status: 400 });
            }
        } else {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }
    } catch (err) {
        console.error('Error in session or request handling:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
*/