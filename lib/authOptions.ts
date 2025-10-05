import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User as NextAuthUser, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { supabase } from './supabase/supabase';
import { v4 as uuidv4 } from 'uuid';

// Extend the Session user type to include 'id' and 'provider'
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
}

interface CustomUser extends NextAuthUser {
  provider?: string;
}

interface CustomToken extends JWT {
  id?: string;
  provider?: string;
}

// UUID validation function
function isValidUUID(id: string | undefined): boolean {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        // Find user by email
        const { data: user, error } = await supabase
          .from('users')
          .select('id, name, email, created_at')
          .eq('email', credentials.email)
          .single();

        if (error) {
          console.log("User not found, creating new user:", credentials.email);
          // User not found, create new user with provided credentials
          const uuid = uuidv4();
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: uuid,
                name: credentials.email,
                email: credentials.email,
                created_at: new Date().toISOString(),
              }
            ])
            .select('id, name, email, created_at')
            .single();

          if (insertError || !newUser) {
            console.error("Error creating new user:", insertError);
            return null;
          }

          console.log("Created new user with ID:", newUser.id);
          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        }

        // User found, check password (not stored in db, so just allow login)
        console.log("Found existing user with ID:", user.id);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback - user:", user.email, "provider:", account?.provider);
      
      if (account?.provider === 'google') {
        const { name, email } = user;
        if (!email) return false;

        // Check if user exists
        const { data: existingUser, error: selectError } = await supabase
          .from('users')
          .select('id, name, email, created_at')
          .eq('email', email)
          .single();

        if (existingUser) {
          // Attach id to user for session/jwt
          console.log("Found existing Google user with ID:", existingUser.id);
          user.id = existingUser.id;
          user.name = existingUser.name;
          user.email = existingUser.email;
          return true;
        }

        // User does not exist, create user with proper UUID format
        const uuid = uuidv4(); // This generates a proper UUID
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: uuid,
              name: name ?? email,
              email: email,
              created_at: new Date().toISOString(),
            }
          ])
          .select('id, name, email, created_at')
          .single();

        if (insertError || !newUser) {
          console.error('Error saving new Google user to Supabase:', insertError);
          return false;
        }
        
        // Attach id to user for session/jwt
        console.log("Created new Google user with ID:", newUser.id);
        user.id = newUser.id;
        user.name = newUser.name;
        user.email = newUser.email;
        return true;
      }
      // Credentials provider handled in authorize
      return true;
    },

    async jwt({ token, user, account }) {
      const customToken = token as CustomToken;
      
      if (user) {
        // Only set the ID if it's a valid UUID
        if (isValidUUID(user.id)) {
          customToken.id = user.id;
          console.log("JWT using valid UUID:", user.id);
        } else {
          console.warn("Invalid UUID format for user.id:", user.id);
          
          // If we have an email, try to find the user by email to get proper UUID
          if (user.email) {
            try {
              const { data: dbUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();
                
              if (dbUser?.id && isValidUUID(dbUser.id)) {
                customToken.id = dbUser.id;
            //    console.log("Found correct UUID from database:", dbUser.id);
              } else if (dbUser) {
                console.error("Database returned invalid UUID format:", dbUser.id);
              }
            } catch (error) {
              console.error("Error looking up user UUID:", error);
            }
          }
        }
        
        customToken.email = user.email;
        customToken.name = user.name;
      }
      
      if (account) {
        customToken.provider = account.provider;
      }
      
      return customToken;
    },

    async session({ session, token }) {
      const customToken = token as CustomToken;
      
      if (session.user) {
        // Only use the ID if it's a valid UUID
        if (isValidUUID(customToken.id)) {
          session.user.id = customToken.id;
        //  console.log("Set session user ID to UUID:", session.user.id);
        } else {
          //console.warn("Token has invalid UUID:", customToken.id);
          
          // If we have an email, do one last attempt to find the user by email
          if (session.user.email) {
            try {
              const { data: dbUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', session.user.email)
                .single();
                
              if (dbUser?.id && isValidUUID(dbUser.id)) {
                session.user.id = dbUser.id;
                console.log("Session lookup found correct UUID:", dbUser.id);
              }
            } catch (error) {
              console.error("Error in session lookup for UUID:", error);
            }
          }
        }
        
        session.user.name = customToken.name ?? null;
        session.user.email = customToken.email ?? null;
        session.user.provider = customToken.provider;
      }
      
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};