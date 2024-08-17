"use client"
import { CiEdit } from "react-icons/ci";
import { CiSquareRemove } from "react-icons/ci";
import CardFocuesdTwo from "./CardFocuesdTwo";
import { useEffect, useState } from "react";
import { convertStateToHtml } from "../actions/convertStateToHtml";
import saveNote from "../actions/saveNote";
import { format } from "date-fns";
import { IoMdClose } from "react-icons/io";




const Card = ({headingContentFromTheDb, intialContentFocused , id , refreshFunction , labelFromDb , backgroundColorFromDb , dateFromDb }) => {

  const [isClicked, setIsClicked] = useState(false)
  const [cardMovedToDeleted , setCardMovedToDeleted] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0); // we use this state because of the broken h1 list which of verbum which shows only when you are at the top of the page 
  const [currentHtmlNoteContent , setCurrentHtmlNoteContent] = useState(convertStateToHtml(intialContentFocused ))
  const [currentHeading , setCurrentHeading] = useState(headingContentFromTheDb.replace(/&nbsp;/g, ""))

  const handleClick = () => {
    // Store the current scroll position
    const currentScrollPos = window.scrollY;
    setPrevScrollPos(currentScrollPos);

    // Scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' }); 

    setIsClicked(true);
    document.body.style.overflow = 'hidden';  //lock scrolling of the page when the modal is rendered
  };

  const handleClose = () => {
    setIsClicked(false);

    // Restore the previous scroll position
    window.scrollTo({ top: prevScrollPos, behavior: 'smooth' });

    document.body.style.overflow = 'auto';
  };

  //const htmlNoteContent = convertStateToHtml(intialContentFocused );

  const moveNoteToDeleted = async()=>{
     const res = await saveNote({heading: headingContentFromTheDb , content: intialContentFocused , id :id  , label :"deleted" , backgroundColor :backgroundColorFromDb})
     console.log(res)
     refreshFunction(true)
  }

  useEffect(
    ()=>{
      if(cardMovedToDeleted == true) {
        moveNoteToDeleted()
      }
    } , [cardMovedToDeleted]
  )
  
  

  return (
    <>
    <div onClick={handleClick} style={{backgroundColor:backgroundColorFromDb}} className=" max-w-80 min-w-80 flex gap-8 flex-col rounded-xl justify-center py-8 px-4 hover:opacity-60 ease-in-out duration-500 drop-shadow-2xl hover:drop-shadow-2xl  ">
    <div className=" flex gap-2 items-center">
      <CiEdit  size={40} className=" hover:text-green-300 ease-in-out duration-200 active:opacity-40 " ></CiEdit> <IoMdClose onClick={(e)=>{e.stopPropagation() ; setCardMovedToDeleted(true)}} size={30} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40  "></IoMdClose>
    </div>
    <h1 className=" font-semibold break-words	 text-2xl md:text-2xl">{currentHeading}</h1>
    <div className=" overflow-hidden max-h-44 text-sm" dangerouslySetInnerHTML={{ __html: currentHtmlNoteContent }} />
    <div className="flex justify-between  text-white">
      <p className=" text-sm">{format(dateFromDb , "PP")}</p> <p className=" text-sm">{labelFromDb}</p>
    </div>
  </div>
  <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isClicked ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <CardFocuesdTwo
          setCurrentHtmlNoteContent={setCurrentHtmlNoteContent}
          labelFromDb={labelFromDb}
          refreshFunction={refreshFunction}
          id={id}
          headingContentFromTheDb={headingContentFromTheDb.replace(/&nbsp;/g, "")}
          intialContentFocused={intialContentFocused}
          backgroundColorFromDb={backgroundColorFromDb}
          onClose={handleClose}
          dateFromDb={format(dateFromDb, "PP")}
          setCurrentHeading={setCurrentHeading}
        />
      </div>   
       </>
  )
}

export default Card


/*


const Card = ({headingContentFromTheDb, intialContentFocused , id , refreshFunction , labelFromDb , backgroundColorFromDb , dateFromDb }) => {

  const [isClicked, setIsClicked] = useState(false)
  const [cardMovedToDeleted , setCardMovedToDeleted] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0); // we use this state because of the broken h1 list which of verbum which shows only when you are at the top of the page 

  const handleClick = () => {
    // Store the current scroll position
    const currentScrollPos = window.scrollY;
    setPrevScrollPos(currentScrollPos);

    // Scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' }); 

    setIsClicked(true);
    document.body.style.overflow = 'hidden';  //lock scrolling of the page when the modal is rendered
  };

  const handleClose = () => {
    setIsClicked(false);

    // Restore the previous scroll position
    window.scrollTo({ top: prevScrollPos, behavior: 'smooth' });

    document.body.style.overflow = 'auto';
  };

  const htmlNoteContent = convertStateToHtml(intialContentFocused );

  const moveNoteToDeleted = async()=>{
     const res = await saveNote({heading: headingContentFromTheDb , content: intialContentFocused , id :id  , label :"deleted" , backgroundColor :backgroundColorFromDb})
     console.log(res)
     refreshFunction(true)
  }

  useEffect(
    ()=>{
      if(cardMovedToDeleted == true) {
        moveNoteToDeleted()
      }
    } , [cardMovedToDeleted]
  )
  
  

  return (
    <>
    <div onClick={handleClick} style={{backgroundColor:backgroundColorFromDb}} className=" max-w-80 min-w-80 flex gap-8 flex-col rounded-xl justify-center py-8 px-4 hover:opacity-60 ease-in-out duration-500 drop-shadow-2xl hover:drop-shadow-2xl  ">
    <div className=" flex gap-2 items-center">
      <CiEdit  size={40} className=" hover:text-green-300 ease-in-out duration-200 active:opacity-40 " ></CiEdit> <IoMdClose onClick={(e)=>{e.stopPropagation() ; setCardMovedToDeleted(true)}} size={30} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40  "></IoMdClose>
    </div>
    <h1 className=" font-semibold break-words	 text-2xl md:text-2xl">{headingContentFromTheDb.replace(/&nbsp;/g, "")}</h1>
    <div className=" overflow-hidden max-h-44 text-sm" dangerouslySetInnerHTML={{ __html: htmlNoteContent }} />
    <div className="flex justify-between  text-white">
      <p className=" text-sm">{format(dateFromDb , "PP")}</p> <p className=" text-sm">{labelFromDb}</p>
    </div>
  </div>
  {isClicked && <CardFocuesdTwo labelFromDb={labelFromDb} refreshFunction={refreshFunction} id={id} headingContentFromTheDb={headingContentFromTheDb.replace(/&nbsp;/g, "")}  intialContentFocused={intialContentFocused} backgroundColorFromDb={backgroundColorFromDb}  onClose={handleClose} dateFromDb={format(dateFromDb , "PP")} />}
    </>
  )
}

export default Card



*/











































/* 

<div className=" bg-neutral-700 max-w-80 flex gap-8 flex-col rounded-xl justify-center py-8 px-4 hover:bg-neutral-800 ease-in-out duration-500 drop-shadow-2xl hover:drop-shadow-2xl  ">
        <div className=" flex gap-2">
            <CiEdit onClick={focusSetter} size={40} className=" hover:opacity-70 ease-in-out duration-200 active:opacity-40 " ></CiEdit> <CiSquareRemove size={40} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40  "></CiSquareRemove>
        </div>
      <h1 className=" font-semibold text-2xl md:text-3xl">This Is My First Note Heading</h1>
      <p >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit corrupti ducimus, repellat voluptates alias, unde harum amet iure culpa, repellendus at quod magnam eos ea. Quia quibusdam id odio laboriosam.</p>
       <div className="flex justify-between text-gray-400">
        <p className=" text-sm">7 Octber 23</p> <p className=" text-sm">Label One</p>
       </div>
    </div>


*/