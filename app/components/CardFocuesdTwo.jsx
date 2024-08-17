'use client'
import React, { useEffect, useState } from 'react'
import { CiSquareRemove } from "react-icons/ci";
//import dynamic from 'next/dynamic';
import NoteViewer from './NoteViewer';
import saveNote from '../actions/saveNote';
import LabelDropDownInCardFocused from './LabelDropDownInCardFocused';
import SettingsDropDownInCardFocused from './SettingsDropDownInCardFocused';
import { IoMdClose } from "react-icons/io";
import { convertStateToHtml } from '../actions/convertStateToHtml';


const CardFocuesdTwo = ({ setCurrentHtmlNoteContent, onClose, isNewNote, intialContentFocused, id, 
  headingContentFromTheDb, refreshFunction, labelFromDb, backgroundColorFromDb, dateFromDb , setCurrentHeading }) => {



  const [headingContent, setHeadingContnet] = useState(headingContentFromTheDb)
  const [newNote, setNewNote] = useState(isNewNote)
  const [editorState, setEditorState] = useState(null);
  const [currentLabel, setCurrentLabel] = useState(labelFromDb || "") //you should get current label from the db
  const [backgroundColor, setBackgroundColor] = useState(backgroundColorFromDb || "rgb(64 64 64)")


  
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }


  const getEditorState = (editorState) => {
    setEditorState(editorState)
  }




  const submitToDb = async () => {
    try {

      const result = await saveNote({ heading: headingContent.trimEnd() || "", content: editorState, isNewNote: newNote, id, label: currentLabel, backgroundColor: backgroundColor });
      // console.log(result)
      if (newNote) {
        refreshFunction(prev => !prev)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const debouncedSubmitToDb = debounce(submitToDb, 100)


 useEffect(() => {
    if (!newNote) {
      debouncedSubmitToDb();
    }
  }, [headingContent, editorState, currentLabel,backgroundColor ]);




  useEffect(
    () => {
      if (editorState && !newNote) {
        setCurrentHtmlNoteContent(convertStateToHtml(editorState))
      }
    }, [editorState]
  )

  useEffect(
    ()=>{
      if(headingContent && !newNote ){
        setCurrentHeading(headingContent.trimEnd())
      }

    } , [headingContent]
  )



  return (
    <div onClick={() => {
      debouncedSubmitToDb()
      setNewNote(false)
    //  refreshFunction(prev => !prev)
      onClose()
    }}  className=" fixed inset-0 bg-slate-600 bg-opacity-50 flex justify-center items-center min-h-svh z-30 ease-in-out duration-300   ">
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: backgroundColor }} className=' md:max-w-[635px] max-w-[500px] max-h-[700px]  flex flex-col gap-4 mb-4 p-6 rounded-xl mt-6 mx-4 z-30 overflow-y-auto overflow-x-clip scrollbar-webkit ease-in-out duration-300 '>
        <div className=' flex items-center justify-between '  >
          <CiSquareRemove onClick={() => {
            debouncedSubmitToDb()
            setNewNote(false)
           // refreshFunction(prev => !prev)
            onClose()
          }} size={45} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40"></CiSquareRemove>
          <LabelDropDownInCardFocused refreshFunction={refreshFunction} id={id} labelFromDb={labelFromDb} setCurrentLabel={setCurrentLabel} />
        </div>
        <h1
          contentEditable="true"
          onInput={(e) => setHeadingContnet(e.target.innerHTML)}
          className="font-semibold text-xl focus:outline-none md:text-2xl empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 before:text-gray-400"
          data-placeholder="Enter your heading here"
        >
          {headingContentFromTheDb}
        </h1>

        <NoteViewer intialContentFocused={intialContentFocused} getEditorState={getEditorState} />
        <div className=' flex items-center justify-between '>
          <p className=' text-sm'>{dateFromDb}</p>
          <SettingsDropDownInCardFocused setBackgroundColor={setBackgroundColor} backgroundColorFromDb={backgroundColorFromDb} id={id} setCurrentLabel={setCurrentLabel} />
        </div>
      </div>
    </div>
  )
}

export default CardFocuesdTwo


//we need note content and id for rendering exsiting notes
// we need getnotes api endpoint







//        <h1 contenteditable="true" onInput={(e) => setHeadingContnet(e.target.innerHTML)} className=' font-semibold text-xl focus:outline-none md:text-2xl'>{headingContentFromTheDb}</h1>














/*

const CardFocuesdTwo = ({ onClose, isNewNote, intialContentFocused, id, headingContentFromTheDb, refreshFunction , labelFromDb ,backgroundColorFromDb ,dateFromDb }) => {



  const [headingContent, setHeadingContnet] = useState(headingContentFromTheDb)
  const [newNote, setNewNote] = useState(isNewNote)
  const [editorState, setEditorState] = useState(null);
  const [currentLabel , setCurrentLabel] = useState(labelFromDb||"") //you should get current label from the db
  const [backgroundColor , setBackgroundColor] = useState(backgroundColorFromDb||"rgb(64 64 64)")

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }


  const getEditorState = (editorState) => {
    setEditorState(editorState)
  }




  const submitToDb = async () => {
    try {

      const result = await saveNote({ heading: headingContent, content: editorState, isNewNote: newNote, id ,label :currentLabel , backgroundColor:backgroundColor });
      console.log(result)
      if (newNote) {
        refreshFunction(prev => !prev)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const debouncedSubmitToDb = debounce(submitToDb, 500)


  useEffect(() => {
    if (!newNote) {
      debouncedSubmitToDb();
    }
  }, [headingContent, editorState, currentLabel,backgroundColor ,  debouncedSubmitToDb]);




  return (
    <div onClick={() => {
      onClose()
      refreshFunction(prev => !prev)
      if (newNote) {
        debouncedSubmitToDb()
        setNewNote(false)

      }
    }} className=" fixed inset-0 bg-slate-600 bg-opacity-50 flex justify-center items-center min-h-svh z-30 ease-in-out duration-300   ">
      <div onClick={(e) => e.stopPropagation()} style={{backgroundColor:backgroundColor}} className=' md:max-w-[635px] max-w-[500px] max-h-[700px]  flex flex-col gap-4 mb-4 p-6 rounded-xl mt-6 mx-4 z-30 overflow-y-auto overflow-x-clip scrollbar-webkit ease-in-out duration-300 '>
        <div className=' flex items-center justify-between '  >
          <CiSquareRemove onClick={() => {
            onClose()
            refreshFunction(prev => !prev)
            if (newNote) {
              debouncedSubmitToDb()
              setNewNote(false)
            }
          }} size={45} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40"></CiSquareRemove>
          <LabelDropDownInCardFocused id={id} labelFromDb={labelFromDb} setCurrentLabel={setCurrentLabel}/>
        </div>
        <h1
          contentEditable="true"
          onInput={(e) => setHeadingContnet(e.target.innerHTML)}
          className="font-semibold text-xl focus:outline-none md:text-2xl empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 before:text-gray-400"
          data-placeholder="Enter your heading here"
        >
          {headingContentFromTheDb}
        </h1>

        <NoteViewer intialContentFocused={intialContentFocused} getEditorState={getEditorState} />
        <div  className=' flex items-center justify-between '>
        <p className=' text-sm'>{dateFromDb}</p>
        <SettingsDropDownInCardFocused setBackgroundColor={setBackgroundColor} backgroundColorFromDb={backgroundColorFromDb} id={id} setCurrentLabel={setCurrentLabel}/>
        </div>
      </div>
    </div>
  )
}

export default CardFocuesdTwo



*/













/*const submitToDb = async () => {
         if (session){
            await fetch ('/api/savenote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({session: session })
            })
         }
    }

  */





//fixed inset-0 bg-slate-600 bg-opacity-50 flex justify-center items-center min-h-screen gpt wrapperClassName="overflow-y-hidden"



/*const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
);
*/


//flex justify-center items-center min-h-svh bg-slate-600 mine bg-opacity-50 z-30
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css.map"
//import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

/*
 'use client'
import React, { useState } from 'react'
import { CiSquareRemove } from "react-icons/ci";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css.map"
//import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
);



 
const CardFocuesdTwo = ({ onClose }) => {
    
    const [scrollbarState , scrollbarStateSetter] = useState("hidden")

    let style =` bg-neutral-700 w-[500px] max-h-[700px]  flex flex-col gap-4 p-6 rounded-xl mt-6 mx-4 z-30 overflow-y-${scrollbarState}`

    return (
        <div onClick={onClose} className=" fixed inset-0 bg-slate-600 bg-opacity-50 flex justify-center items-center min-h-svh z-30   ">
            <div onClick={(e) => e.stopPropagation()} className=' bg-neutral-700 w-[500px] max-h-[700px]  flex flex-col gap-4 p-6 rounded-xl mt-6 mx-4 z-30 overflow-y-scroll'>
                <div>
                <CiSquareRemove  size={45} className=" hover:opacity-70 hover:text-red-600  ease-in-out duration-200 active:opacity-40"></CiSquareRemove>
                </div>
                <h1 className='font-semibold text-xl md:text-2xl'>My First Heading Notes </h1>
                <Editor  
                toolbar={{
                    options: [
                        'inline',
                        'blockType',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'textAlign',
                        'colorPicker', // Make sure this is included
                        'embedded',
                        'remove',
                        'history'
                    ],
                    inline: { inDropdown: true },
                    blockType: { inDropdown: true },
                    fontSize: { inDropdown: true },
                    fontFamily: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    colorPicker: { inDropdown: true }, // Include this option
                    embedded: { inDropdown: true },
                    remove: { inDropdown: true },
                    history: { inDropdown: true }
                }}
                
                editorClassName="overflow-y-hidden"  toolbarOnFocus  />
                <p className=' text-sm'>7 octber 2023</p>
            </div>
        </div>
    )
}

export default CardFocuesdTwo
*/
































/*
<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione, iure. Iste, ratione quidem. Quisquam unde omnis aut, sequi nemo fugiat consectetur nostrum tenetur alias, quo ea libero sapiente odit? Nisi. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores tempora minima tenetur quasi molestias. Non expedita similique facilis quos, asperiores, itaque quo iure laborum ipsa perspiciatis aliquam. Aperiam, magni dignissimos.
      </p>
*/


