"use server"
import { authOptions } from "../../lib/authOptions"
import { getServerSession } from "next-auth"
import HomePageClient from "../../components/HomePageClient"
import { redirect } from "next/navigation"
import dbConnect from "@/app/lib/dbConnect"
import Label from "@/app/lib/models/Label"


export default async function archivedNotes(){
    const session = await getServerSession(authOptions);
    if (session == null) {
      redirect('/signin');
    }

    await dbConnect()
    
    let archivedLabelIdString = null
    const archivedLabel = await Label.findOne({name:"archived" , userEmail: session.user.email})
    if(archivedLabel){
         const archivedLabelId = archivedLabel._id 
         archivedLabelIdString = archivedLabelId.toString()
    }
    else{
         const archivedLabelNew = await new Label({ userEmail: session.user.email, name: "archived"});
         await archivedLabelNew.save()
         archivedLabelIdString = archivedLabelNew._id.toString()
    }


    return(
    <HomePageClient labelId={archivedLabelIdString} />
    )
}