import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/lib/models/User";
import dbConnect from "@/app/lib/dbConnect";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase/supabase';
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
  
            if (user && user.password === credentials.password) {
              // Save to Supabase
              const { data: existingSupabaseUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', credentials.email)
                .single();

              if (!existingSupabaseUser) {
                const uuid = uuidv4();
                await supabase
                  .from('users')
                  .insert([{
                    id: uuid,
                    name: user.name,
                    email: user.email,
                    created_at: new Date().toISOString(),
                  }]);
              }

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
        if (account.provider === 'google') {
          const name = user.name;
          const email = user.email;

          // Save to MongoDB
          const baseUrl = process.env.NEXTAUTH_URL || 'https://bee-well.vercel.app';
          await fetch(`${baseUrl}/api/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
          });

          // Save to Supabase
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

          if (!existingUser) {
            const uuid = uuidv4();
            await supabase
              .from('users')
              .insert([{
                id: uuid,
                name: name,
                email: email,
                created_at: new Date().toISOString(),
              }]);
          }
        }
        return true;
      },
    },
  }