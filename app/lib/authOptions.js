import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/lib/models/User";
import dbConnect from "@/app/lib/dbConnect";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;



export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          await dbConnect();
          try {
            const user = await User.findOne({ email: credentials.email });
  
            if (user && user.password === credentials.password) { // Assuming you store plaintext passwords
              // Normally, you should hash and compare passwords securely
              return { id: user._id, email: user.email, name: user.name };
            } else {
              return null;
            }
          } catch (error) {
            console.error("Error in authorize function:", error);
            return null;
          }
        }
      })
    ],
    callbacks: {
      jwt: async ({ user, token, trigger, session }) => {
        if (trigger === "update") {
          return { ...token, ...session.user };
        }
        return { ...token, ...user };
      },
      async signIn({ user, account, profile }) {
        // Only save data for Google sign-ins
        if (account.provider === 'google') {
          const name = user.name
          const email = user.email
          const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
         const res = await fetch(`${baseUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
          });
  
          console.log(res);
        }
        return true; // Allow sign-in for other providers without additional actions
      },
    },
  }