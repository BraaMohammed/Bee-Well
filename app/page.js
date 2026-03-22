import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from 'next/navigation'
import HomePageClient from "@/components/my-components/notes/HomePageClient";
export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session == null) {
    redirect('/signin');
  }

  return (
    <HomePageClient />
  );
}









































