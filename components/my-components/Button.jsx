'use client'
import { useSession } from "next-auth/react"
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiBookmarkPlus } from "react-icons/ci";
import { PiSignOutThin } from "react-icons/pi";
import { signOut } from "next-auth/react"

const Button = (props) => {
 
  const { data: session, status } = useSession()
  const functionName = props.icon

  const iconHandler = (name) => {
    if (name === "addNote") return <IoIosAddCircleOutline size={36} /> //dont use , use independent button 
    if (name === "addLabel") return <CiBookmarkPlus size={36} />
    if (name === "signOut") return <PiSignOutThin size={36} />
  }
  const onClickHandler = () => {
    if (functionName === "signOut") {
      signOut({ callbackUrl: '/signin' })
      console.log(status)
    }

    

  }

  const buttonStyles = `max-w-64 flex justify-center items-center gap-2 px-4 py-0.5 rounded-full text-sm hover:opacity-75 active:opacity-60 ease-in-out duration-300 ${props.color}`;

  return (<>
    <button onClick={onClickHandler} className={buttonStyles}>
      {iconHandler(props.icon)} {props.text}
    </button>
    </>
  );
};

export default Button;


