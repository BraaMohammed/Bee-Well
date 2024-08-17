import User from "../../../lib/models/User";
import dbConnect from "../../../lib/dbConnect";
import { NextResponse } from "next/server";




export async function POST(req) {
    await dbConnect();
    try {
      const {name,email,password} = await req.json();
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
  
      const user = new User({ name, email, password });
      await user.save();
      return NextResponse.json({ success: true, data: user }, { status: 201 });
  
    } catch (error) {
      console.error("Error occurred: ", error);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }
  }









/*





export async function POST(req, res) {
    console.log(req.body); // Log the request body

    await dbConnect();
       try {
            const user = new User(req.body);
            await user.save();
            // Create a new NextResponse instance with the JSON payload
            return new NextResponse(JSON.stringify({ success: true, data: user }), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            // Create a new NextResponse instance with the error message
            return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    
}





















*/

























/*

 await dbConnect();

    if (req.method === 'POST') {
        try {
            const user = new User(req.body);
            await user.save();
            // Create a new NextResponse instance with the JSON payload
            return new NextResponse(JSON.stringify({ success: true, data: user }), {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            // Create a new NextResponse instance with the error message
            return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }



*/