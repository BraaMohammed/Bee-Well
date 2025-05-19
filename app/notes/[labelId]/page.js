"use server"
import { authOptions } from "../../lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import HomePageClient from "@/components/my-components/notes/HomePageClient"
export default async function LabelNotes({params}) {
    const session = await getServerSession(authOptions);
    if (session == null) {
      redirect('/signin');
    }
    const { labelId } = params;

    const labelIdString = labelId.toString()
  

    console.log(labelIdString)

 
   return(
    <HomePageClient labelId={labelIdString}/>
   )     

}
