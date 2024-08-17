import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/lib/dbConnect";
import Note from "@/app/lib/models/Note";
import { authOptions } from "@/app/lib/authOptions"
import Label from "@/app/lib/models/Label";

export async function GET(req) {

    const session = await getServerSession(authOptions);
    if (!session) {
        throw new Error('You must be logged in to save a note');
    }

    //console.log(session)

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const labelId = searchParams.get('labelId');
    console.log(labelId)

    try {
        const userEmail = session.user.email
        if (labelId) {
              const label = await Label.findOne({_id: labelId})

              console.log(`found the label ${label} `)
               
              const notes = await Note.find({userEmail:userEmail , label : label.name})
              
              return NextResponse.json(notes, { status: 200 });
        } else {
            const notes = await Note.find({ userEmail : userEmail , label : { $nin: ['archived', 'deleted'] } });
            console.log(`we got all the notes `)

            // Return the notes as JSON response
            return NextResponse.json(notes, { status: 200 });
        }
    } catch (error) {
        // Handle any errors that might occur
        return NextResponse.json({ error: 'Error retrieving notes' }, { status: 500 });
    }



}


//this api route will get all the notes for now
// later on you should expect a query in the request 


/*if (session == null) {
        return NextResponse.json({ error: 'You must be logged in to get your note' }, { status: 401 });
    } */