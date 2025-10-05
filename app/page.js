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
    <HomePageClient/>
  );
}









































/*

import Card from "./components/Card";
import Sidebar from "./components/Sidebar";
import Input from "./components/Input";
import SidebarMobile from "./components/SidebarMobile";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";
import { redirect } from 'next/navigation'
import { getServerSideProps } from "next/dist/build/templates/pages";


export default async function Home() {



  const session = await getServerSession(authOptions)
  if (session == null) { redirect('/signin') }

  async function  getServerSideProps(){
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    try{
    const response = await fetch(`${baseUrl}/api/getnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    if (response.status == 200) {
      return notes = await response.json();
    }
  }catch(error){
    console.log(error)
  }
}
  return (

    <>
      <div className=" bg-neutral-300 flex gap-x-4 ">

        <Sidebar />
        <SidebarMobile />
        <div className="lg:ml-[16.666667%] flex flex-col  items-center w-full pt-10 gap-0">
          <div className="hidden lg:flex gap-4 items-center ">
            <p className=" text-green-700 text-xl">Welcome Back User Name Search For A Note Here </p>
            <Input />
          </div>
          <div className="flex flex-wrap h-full w-full gap-6 px-8 py-14  items-center">

          </div>
        </div>
      </div>
    </>
  );
}
*/