"use client"
import { useState } from 'react'
import Image from 'next/image'
import { FaGoogle } from "react-icons/fa";
import React from 'react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true)
        await signIn('credentials', { callbackUrl: '/',
            email,
            password })
    }

    const googleSignIn = async ()=>{
        setIsLoading(true)
        await signIn('google', { callbackUrl: '/' } )
    }



  return (
    <div className=' w-svw min-h-screen bg-neutral-600 flex justify-center items-center overflow-x-hidden'>
            <div className=' mx-auto w-5/6 h-full bg-neutral-600 flex flex-col md:flex-row'>
                <div className='le bg-neutral-600 h-screen w-full flex flex-col justify-center items-center gap-4'>
                    <Image src="/logo.png" width={150} height={150}></Image>
                    <div className=' flex flex-col justify-center items-center gap-0'>
                        <div className=' text-2xl font-semibold'>Welcome BacK</div>
                        <div>lets get back to the right track</div>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                       
                        <div className=' flex flex-col gap-0'>
                            <span>enter your email</span>
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className=' rounded-lg p-2 text-neutral-800'></input>
                        </div>
                        <div className=' flex flex-col gap-0'>
                            <span>enter your password</span>
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className=' rounded-lg p-2 text-neutral-800'></input>
                        </div>
                        <button disabled={isLoading} type='submit' className=' bg-green-700 rounded-lg w-full h-12 font-normal text-xl hover:opacity-75 active:opacity-60 ease-in-out duration-300 disabled:bg-green-900 '>Continue To The App</button>
                        <button disabled={isLoading} type='button' onClick={googleSignIn} className=' bg-neutral-200 text-neutral-800 p-6  rounded-lg w-full h-8 font-normal text-xl hover:opacity-75 active:opacity-60 ease-in-out duration-300 flex justify-center items-center gap-2 disabled:bg-neutral-500'>Sign In With Google Acount <FaGoogle /> </button>
                        <span className=' self-center'>dont have an acount ?<span onClick={()=>{router.push('/signup')}} className=' font-bold hover:opacity-75 active:opacity-60 ease-in-out duration-300 '>Sign Up</span></span>
                    </form>
                </div>
                <div className="flex justify-center items-center h-svh md:w-10/12 md:h-svh relative drop-shadow-lg ">
                    <Image
                        src="/ph1.webp"
                        layout="fill"
                        objectFit="cover"
                        alt="Descriptive text"
                        className='rounded-lg drop-shadow-2xl'
                    />
                </div>
            </div>
        </div>
  )
}

export default page