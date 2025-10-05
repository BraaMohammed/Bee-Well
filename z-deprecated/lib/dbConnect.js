'use server'
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI

let connection = {}

if (!MONGODB_URI) { console.error("the key is not avialable") }

const dbConnect = async () => {
  if(connection.isConnected)return

  try {
    const db = await mongoose.connect(MONGODB_URI)
    connection.isConnected = db.connections[0].readyState 
    
    console.log("db connected successfully")
  }
  catch (error) {
    console.error(error)
  }

}
export default dbConnect;






















/*
 
 
 
 
const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI){console.error("the key is not avialable") }

const dbConnect = async ()=>{
await mongoose.connect(MONGODB_URI)
 
} 
export default dbConnect;
 
 
*/