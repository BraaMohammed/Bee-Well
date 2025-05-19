"use server"
import { authOptions } from "../../lib/authOptions"
import { getServerSession } from "next-auth"
import HomePageClient from "@/components/my-components/notes/HomePageClient"
import { redirect } from "next/navigation"
import dbConnect from "@/app/lib/dbConnect"
import Label from "@/app/lib/models/Label"


export default async function deletedNotes(){
    const session = await getServerSession(authOptions);
    if (session == null) {
      redirect('/signin');
    }

    await dbConnect()
    
    let deletedLabelIdString = null
    const deletedLabel = await Label.findOne({name:"deleted" , userEmail: session.user.email})
    if(deletedLabel){
         const deletedLabellId = deletedLabel._id 
         deletedLabelIdString = deletedLabellId.toString()
    }
    else{
         const deletedLabelNew = await new Label({ userEmail: session.user.email, name: "deleted"});
         await deletedLabelNew.save()
         deletedLabelIdString = deletedLabelNew._id.toString()
    }


    return(
    <HomePageClient labelId={deletedLabelIdString} />
    )
}