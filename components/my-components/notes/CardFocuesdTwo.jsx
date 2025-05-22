'use client'
import React, { useEffect, useState } from 'react'
import { CiSquareRemove } from "react-icons/ci";
import LabelDropDownInCardFocused from './LabelDropDownInCardFocused';
import SettingsDropDownInCardFocused from './SettingsDropDownInCardFocused';
import dynamic from 'next/dynamic';
const EditorTwo = dynamic(() => import("@/components/my-components/blocknoteEditor/BlockNoteEditor"), { ssr: false });
import saveNote from '@/app/actions/saveNote';
import { useToast } from '@/hooks/use-toast';

const CardFocuesdTwo = ({ setCurrentHtmlNoteContent, onClose, isNewNote, intialContentFocused, id,
  headingContentFromTheDb, refreshFunction, labelFromDb, backgroundColorFromDb, dateFromDb, setCurrentHeading, currentHtmlContent , setCardBackgroundColor , setCurrentCardLabel }) => {



  const [headingContent, setHeadingContnet] = useState(headingContentFromTheDb)
  const [newNote, setNewNote] = useState(isNewNote)
  const [editorState, setEditorState] = useState(null);
  const [currentLabel, setCurrentLabel] = useState(labelFromDb || "") //you should get current label from the db
  const [backgroundColor, setBackgroundColor] = useState(backgroundColorFromDb || "rgb(64 64 64)")
  const [htmlContentForNewNotes , setHtmlContentForNewNotes ] = useState("")
  const [labelChanged , setLabelChanged] = useState(false)
  const { toast } = useToast()


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
        const content = editorState && Array.isArray(editorState) && editorState.length > 0 
            ? JSON.stringify(editorState) 
            : "null";
            if(content == "null"){
              const result = await saveNote({
                heading: headingContent.trimEnd() || "", 
                content: undefined, 
                isNewNote: newNote,
                id, 
                label: currentLabel, 
                backgroundColor: backgroundColor,
                htmlContent: isNewNote ? htmlContentForNewNotes || "" : currentHtmlContent || ""
            });
            }else{
              const result = await saveNote({
                heading: headingContent.trimEnd() || "", 
                content: content, 
                isNewNote: newNote,
                id, 
                label: currentLabel, 
                backgroundColor: backgroundColor,
                htmlContent: isNewNote ? htmlContentForNewNotes || "" : currentHtmlContent || ""
            });
            }
       

        if (newNote) {
            refreshFunction(prev => !prev);
        }
    } catch (err) {
        console.log(err);
    }
};

  const debouncedSubmitToDb = debounce(submitToDb, 100)

//here bro 


  useEffect(() => {
    if (!newNote) {   
      setCurrentCardLabel(currentLabel)
      setLabelChanged(true)

    }
  }, [ currentLabel]); //when changing label , refetch





  useEffect(
    () => {
      if (headingContent && !newNote) {
        setCurrentHeading(headingContent.trimEnd())
      }

    }, [headingContent]
  )



  return (
    <div onClick={async () => {
      if (newNote) {
        toast({
          description: "new note have been created !.",
        })
      }
      setNewNote(false)
      await submitToDb();
      if(currentLabel == "archived" || currentLabel == "deleted"){
        refreshFunction(prev => !prev)
      }
      onClose()
    }} className=" fixed inset-0 bg-slate-600 bg-opacity-50 flex justify-center items-center min-h-svh z-30 ease-in-out duration-300   ">
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: backgroundColor }} className=' md:max-w-[635px] lg:w-[1100px]  max-w-[500px] lg:max-h-[700px] max-h-[550px]  flex flex-col gap-4 mb-4 p-6 rounded-xl mt-6 mx-4 z-30 overflow-y-auto overflow-x-clip scrollbar-webkit ease-in-out duration-300 '>
        <div className=' flex items-center justify-between '  >
          <CiSquareRemove onClick={async () => {
            if (newNote) {
              toast({
                description: "new note have been created !.",
              })
            }
            setNewNote(false)
            await submitToDb();
            onClose()
            if(labelChanged){
              refreshFunction(prev => !prev)
            }
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
        <div className='flex justify-center w-full'>
          <EditorTwo setHtmlContentForNewNotes={setHtmlContentForNewNotes} isNewNote={isNewNote} setCurrentHtmlNoteContent={setCurrentHtmlNoteContent} intialContentFocused={intialContentFocused} getEditorState={getEditorState} />
        </div>
        <div className=' flex items-center justify-between '>
          <p className=' text-sm'>{dateFromDb}</p>
          <SettingsDropDownInCardFocused setCardBackgroundColor={setCardBackgroundColor} setBackgroundColor={setBackgroundColor} backgroundColorFromDb={backgroundColorFromDb} id={id} setCurrentLabel={setCurrentLabel} />
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

 */








