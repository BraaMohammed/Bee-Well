"use server"
import { authOptions } from "../../lib/authOptions"
import { getServerSession } from "next-auth"
import HomePageClient from "../../components/HomePageClient"
import { redirect } from "next/navigation"

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
