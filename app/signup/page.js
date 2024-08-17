"use client"
import { useState } from 'react'
import Image from 'next/image'
import { FaGoogle } from "react-icons/fa";
import React from 'react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const Home = () => {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);


   
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                // Sign in the user after successful signup
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result.error) {
                    console.error('Error signing in:', result.error);
                } else {
                    // Redirect to home or dashboard after successful sign-in
                    console.log('Successfully signed in:', result);
                    router.push('/');

                }
            } else {
                const data = await res.json();
                console.error('Signup error:', data.message);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const googleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await signIn('google', { callbackUrl: '/' } )


    }





    return (
        <div className=' w-svw min-h-screen bg-neutral-600 flex justify-center items-center overflow-x-hidden'>
            <div className=' mx-auto w-5/6 h-full bg-neutral-600 flex flex-col md:flex-row'>
                <div className='le bg-neutral-600 h-screen w-full flex flex-col justify-center items-center gap-4'>
                    <Image src="/logo.png" width={150} height={150}></Image>
                    <div className=' flex flex-col justify-center items-center gap-0'>
                        <div className=' text-2xl font-semibold'>Lets get your life back in order</div>
                        <div>please enter your data to continue</div>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                        <div className=' flex flex-col gap-0'>
                            <span>enter your name</span>
                            <input type='text' value={name} onChange={(e) => setName(e.target.value)} className=' rounded-lg p-2 text-neutral-800'></input>
                        </div>
                        <div className=' flex flex-col gap-0'>
                            <span>enter your email</span>
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className=' rounded-lg p-2 text-neutral-800'></input>
                        </div>
                        <div className=' flex flex-col gap-0'>
                            <span>enter your password</span>
                            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} className=' rounded-lg p-2 text-neutral-800'></input>
                        </div>
                        <button disabled={isLoading} type='submit' className=' bg-green-700 rounded-lg w-full h-12 font-normal text-xl hover:opacity-75 active:opacity-60 ease-in-out duration-300 disabled:bg-green-900 '>Continue To The App</button>
                        <button disabled={isLoading} type='button' onClick={googleSignUp} className=' bg-neutral-200 text-neutral-800 p-6  rounded-lg w-full h-8 font-normal text-xl hover:opacity-75 active:opacity-60 ease-in-out duration-300 flex justify-center items-center gap-2 disabled:bg-neutral-500'>Sign Up With Google Acount <FaGoogle /> </button>
                        <span className=' self-center'>already have an acount ? <span onClick={()=>{router.push('/signin')}} className=' font-bold hover:opacity-75 active:opacity-60 ease-in-out duration-300 '>Sign in</span></span>
                    </form>
                </div>
                <div className="flex justify-center items-center h-svh md:w-10/12 md:h-svh relative drop-shadow-lg ">
                    <Image
                        src="/ph2.webp"
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

export default Home




















/*

 const res = await fetch(addUser(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const response = await res.json()
        console.log(response)
        if(!res.ok){
            console.log('user didnt created' + res.statusText)
        }



        or '/api/addUser'
*/



/*

"use client"
//import addUser from "../backend/actions/addUser/route"
import { useState } from "react"

export default function Home() {

    const dataScema = { name: "", email: "", password: "" }

    const [currentData, setCurrentData] = useState(dataScema)

    const addDataToCurrentData = (event) => {
        const { name, value } = event.target;
        setCurrentData(prevData => ({
            ...prevData,
            [name]: value
        }));

    }

    const testFunction = async (data) => {
        const res = await fetch('../backend/actions/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentData)
        })

        const response = await res.json()
        console.log(response)
        if(!res.ok){
            console.log('user didnt created' + res.statusText)
        }

        console.log(typeof data.name)
        console.log(typeof data.email)
        console.log(typeof data.password)
    }

    return (<>
        <div className=" flex flex-col h-svh justify-around items-center gap-1 bg-neutral-700">
            <div className="flex flex-col h-60 my-auto gap-3 justify-around items-center bg-neutral-700">
                <h1>welcome to our app BeeWell!</h1>
                <p>to continue please provide your data !</p>
                <div className="flex gap-2 flex-col items-start justify-center">
                    <p>please add your name</p>
                   <input value={value} onChange={(value)=>{addDataToCurrentData}} name="name" type="text" placeholder="your name" className=" text-black rounded-md p-4"></input>
                    <p>please add your email</p>
                    <input onChange={addDataToCurrentData} name="email" type="text" placeholder="your email" className=" text-black rounded-md p-4"></input>
                    <p>please add your password</p>
                    <input onChange={addDataToCurrentData} name="password" type="password" placeholder="your password" className=" text-black rounded-md p-4"></input>
                </div>
                <button onClick={() => { testFunction(currentData) }} className=" p-2 bg-green-700 rounded-md">submit your data</button>
            </div>
        </div>
    </>)
}


/*

 const res = await fetch(addUser(), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const response = await res.json()
        console.log(response)
        if(!res.ok){
            console.log('user didnt created' + res.statusText)
        }



        or '/api/addUser'
*/
