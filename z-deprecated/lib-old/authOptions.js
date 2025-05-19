import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from '@/lib/supabase/supabase'; // Import Supabase client
import type { NextAuthOptions, User as NextAuthUser, Account, Profile, Session, JWT } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

interface CustomUser extends NextAuthUser {
  // Add any custom properties you expect on the user object
  provider?: string;
}

interface CustomToken extends JWT {
    id?: string;
    provider?: string;
    // Add any other custom properties you want in the token
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
          console.warn("CredentialsProvider.authorize needs to be fully implemented if used with Supabase auth.");
          // Example for Supabase auth.signInWithPassword (requires proper setup):
          // if (!credentials?.email || !credentials.password) {
          //   return null;
          // }
          // const { data, error } = await supabase.auth.signInWithPassword({
          //   email: credentials.email as string,
          //   password: credentials.password as string,
          // });
          // if (error || !data.user) {
          //   console.error("Supabase credentials auth error:", error);
          //   return null;
          // }
          // // Return a user object compatible with NextAuth
          // return { 
          //   id: data.user.id, 
          //   email: data.user.email, 
          //   name: data.user.user_metadata?.full_name || data.user.email 
          // };
          return null; // Placeholder: No actual credential auth implemented here
        }
      })
    ],
    callbacks: {
      async jwt({ token, user, account, profile, trigger, session }): Promise<JWT> {
        const customToken = token as CustomToken;

        if (trigger === "update" && session?.user) {
          // When session is updated (e.g., via useUpdate hook)
          return { ...customToken, ...session.user };
        }

        // Initial sign-in or when user object is passed
        if (user) {
          customToken.id = user.id; // This is the user ID from the provider (e.g., Google's sub)
          customToken.email = user.email;
          customToken.name = user.name;
        }
        
        if (account) {
          customToken.provider = account.provider;
          // If you were using Supabase Auth and wanted to link, you might store account.access_token
          // customToken.accessToken = account.access_token; // Example
        }
        
        return customToken;
      },
      async signIn({ user, account, profile }): Promise<boolean | string> {
        if (account?.provider === 'google') {
          if (!user.email) {
            console.error("Google sign-in: Email is null. Denying sign-in.");
            return false; // Prevent sign-in if email is not available
          }
          // For Google sign-in with NextAuth as the primary provider and Supabase as a general DB:
          // We don't need to create a user in a custom 'public.users' table here if
          // user profile data (name, email) is managed by NextAuth session/token,
          // and the user.id (from Google) is used as a foreign key in other Supabase tables.
          // Your `types/supabase.ts` shows other tables expect a `user_id: string`.
          // This `user_id` will be `token.id` (derived from Google's `user.id`).
          console.log(`Google user signed in: ${user.email}. No custom DB profile write in signIn.`);
          return true; // Allow sign-in
        }

        if (account?.provider === 'credentials') {
          // `user` here is the result of the `authorize` callback.
          // If `authorize` returns a user object, sign-in is allowed.
          return !!user; 
        }
        
        // For other providers or unhandled cases, you might want to deny by default
        // or implement specific logic.
        // Returning true allows sign-in for any other configured provider by default.
        return true; 
      },
      async session({ session, token, user }): Promise<Session> {
        // `token` is the JWT token from the `jwt` callback
        // `user` is the user object from the database or provider (less commonly used here if using JWT strategy)
        const customToken = token as CustomToken;
        
        if (session.user) {
          session.user.id = customToken.id as string;
          session.user.name = customToken.name;
          session.user.email = customToken.email;
          (session.user as any).provider = customToken.provider; // Add provider to session user
        }
        
        return session;
      }
    },
    session: {
      strategy: "jwt",
    },
    // Optionally, define custom pages:
    // pages: {
    //   signIn: '/auth/signin',
    //   // signOut: '/auth/signout',
    //   // error: '/auth/error', // Error code passed in query string as ?error=
    //   // verifyRequest: '/auth/verify-request', // (used for email provider)
    //   // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
    // }
    // secret: process.env.NEXTAUTH_SECRET, // Recommended for production
    // debug: process.env.NODE_ENV === 'development', // Enable debug messages in development
};