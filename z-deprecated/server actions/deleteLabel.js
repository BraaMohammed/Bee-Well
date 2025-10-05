"use server"
import { getServerSession } from "next-auth";
import dbConnect from "@/z-deprecated/lib-old/dbConnect";
import { authOptions } from "@/lib-old/authOptions";
import Label from "../lib-old/models/Label";


export default async function deleteLabel( id ) {

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            throw new Error('You must be logged in to save a note');
        }
        await dbConnect();


        if (id) {
            const label = await Label.findById(id)
            if(label){
                console.log(label)
                await label.deleteOne()
                console.log('label removing done ')
            }else{
                console.log('couldnt find the label to remove !!')
            }
        
        }else{
            console.log('couldnt find the id of the  label to remove !!')

        }
       
    }
    catch (err) {
        console.log(err)
        console.log("label did not removed successfully!!!")

    }
}