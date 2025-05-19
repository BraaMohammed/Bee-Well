'use client'
import React, { useEffect, useState } from 'react'
import { convertStateToHtml } from '@/app/actions/convertStateToHtml'
import saveNote from '@/app/actions/saveNote'
import dynamic from 'next/dynamic'
import LabelDropDownInCardFocused from './LabelDropDownInCardFocused'
import { IoMdClose } from 'react-icons/io'
import { Maximize2, Minimize2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import SettingsDropDownInCardFocused from './SettingsDropDownInCardFocused'
import { useToast } from '@/hooks/use-toast'
import { cn } from "@/lib/utils"
const EditorTwo = dynamic(() => import("@/components/my-components/blocknoteEditor/BlockNoteEditor"), { ssr: false })

const CardFocusedDialog = ({ 
  setCurrentHtmlNoteContent, 
  isNewNote, 
  intialContentFocused, 
  id,
  headingContentFromTheDb = "", 
  refreshFunction, 
  labelFromDb, 
  backgroundColorFromDb, 
  dateFromDb, 
  setCurrentHeading, 
  currentHtmlContent,
  setCardBackgroundColor,
  setCurrentCardLabel,
  open,
  onOpenChange
}) => {
  const [headingContent, setHeadingContent] = useState(headingContentFromTheDb)
  const [newNote, setNewNote] = useState(isNewNote)
  const [editorState, setEditorState] = useState(null)
  const [currentLabel, setCurrentLabel] = useState(labelFromDb || "") 
  const [backgroundColor, setBackgroundColor] = useState(backgroundColorFromDb || "rgb(64 64 64)")
  const [htmlContentForNewNotes, setHtmlContentForNewNotes] = useState("")
  const [labelChanged, setLabelChanged] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { toast } = useToast()

  function debounce(func, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  const getEditorState = (editorState) => {
    setEditorState(editorState)
  }

  const submitToDb = async () => {
    try {
      const content = editorState && Array.isArray(editorState) && editorState.length > 0 
        ? JSON.stringify(editorState) 
        : "null"
      
      if(content === "null") {
        const result = await saveNote({
          heading: headingContent.trimEnd() || "", 
          content: undefined, 
          isNewNote: newNote,
          id, 
          label: currentLabel, 
          backgroundColor: backgroundColor,
          htmlContent: isNewNote ? htmlContentForNewNotes || "" : currentHtmlContent || ""
        })
      } else {
        const result = await saveNote({
          heading: headingContent.trimEnd() || "", 
          content: content, 
          isNewNote: newNote,
          id, 
          label: currentLabel, 
          backgroundColor: backgroundColor,
          htmlContent: isNewNote ? htmlContentForNewNotes || "" : currentHtmlContent || ""
        })
      }

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
      setCurrentCardLabel(currentLabel)
      setLabelChanged(true)
    }
  }, [currentLabel])

  useEffect(() => {
    if (editorState && !newNote) {
      setCurrentHtmlNoteContent(convertStateToHtml(editorState))
    }
  }, [editorState])

  useEffect(() => {
    if (headingContent && !newNote) {
      setCurrentHeading(headingContent.trimEnd())
    }
  }, [headingContent])

  const handleClose = () => {
    if (newNote) {
      debouncedSubmitToDb()
      toast({
        description: "New note has been created!",
      })
    }
    setNewNote(false)
    debouncedSubmitToDb()
    if(currentLabel === "archived" || currentLabel === "deleted"){
      refreshFunction(prev => !prev)
    }
    if(labelChanged) {
      refreshFunction(prev => !prev)
    }
    document.body.style.overflow = 'auto'; // Reset scroll lock
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        document.body.style.overflow = 'auto';
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent 
        style={{ 
          borderRadius: isFullscreen ? "0px" : "20px",
          backgroundColor: backgroundColor 
        }}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] border-none shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          `${isFullscreen 
            ? 'h-screen w-screen max-w-none !rounded-none !translate-x-0 !translate-y-0 !left-0 !top-0 fixed inset-0 p-0' 
            : 'mx-auto max-w-[85%] lg:max-w-[60%] h-[80vh] p-0'}`
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Fixed header */}
          <div className="flex-none p-6">
            <div className="flex items-center justify-between w-full mb-4">
            <div></div>
              <div className="flex items-center gap-4">
                <LabelDropDownInCardFocused 
                  refreshFunction={refreshFunction} 
                  id={id} 
                  labelFromDb={labelFromDb} 
                  setCurrentLabel={setCurrentLabel} 
                />
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="hover:opacity-70 duration-200"
                >
                  {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <h1
              contentEditable="true"
              onInput={(e) => setHeadingContent(e.target.innerHTML)}
              className="font-semibold text-3xl focus:outline-none md:text-2xl empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 before:text-gray-400"
              data-placeholder="Enter your heading here"
            >
              {headingContentFromTheDb}
            </h1>
            <hr className="w-full border-b border-neutral-600 my-2" />
          </div>

          {/* Scrollable editor section */}
          <div className="flex-1 overflow-y-auto scrollbar-webkit px-6">
            <EditorTwo 
              setHtmlContentForNewNotes={setHtmlContentForNewNotes} 
              isNewNote={isNewNote} 
              setCurrentHtmlNoteContent={setCurrentHtmlNoteContent} 
              intialContentFocused={intialContentFocused} 
              getEditorState={getEditorState} 
            />
          </div>

          {/* Fixed footer */}
          <div className="flex-none p-6">
            <div className="flex items-center justify-between border-t border-neutral-600 pt-4">
              <p className="text-sm text-neutral-200">{dateFromDb}</p>
              <SettingsDropDownInCardFocused 
                setCardBackgroundColor={setCardBackgroundColor} 
                setBackgroundColor={setBackgroundColor} 
                backgroundColorFromDb={backgroundColorFromDb} 
                id={id} 
                setCurrentLabel={setCurrentLabel} 
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CardFocusedDialog
