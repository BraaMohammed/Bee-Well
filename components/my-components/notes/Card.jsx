"use client"
import { CiEdit } from "react-icons/ci";
import CardFocuesdTwo from "./CardFocuesdTwo";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { IoMdClose } from "react-icons/io";
import { useToast } from "@/hooks/use-toast";
import CardFocusedDialog from "./CardFocusedDialog";
import { saveNote } from "@/actions/saveNote";


const Card = ({ headingContentFromTheDb, intialContentFocused, id, refreshFunction, labelFromDb, backgroundColorFromDb, dateFromDb, htmlIntialContent }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [cardMovedToDeleted, setCardMovedToDeleted] = useState(false)
  const [currentHtmlNoteContent, setCurrentHtmlNoteContent] = useState(htmlIntialContent)
  const [currentHeading, setCurrentHeading] = useState(headingContentFromTheDb.replace(/&nbsp;/g, ""))
  const [cardBackgroundColor, setCardBackgroundColor] = useState(backgroundColorFromDb)
  const [currentLabel, setCurrentLabel] = useState(labelFromDb);
  const { toast } = useToast();

  const handleClick = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';  //lock scrolling of the page when the modal is rendered
  };

  const moveNoteToDeleted = async () => {
    const res = await saveNote({ heading: headingContentFromTheDb, content: intialContentFocused, id: id, label: "deleted", backgroundColor: backgroundColorFromDb })
    console.log(res)
    refreshFunction(true)
  }

  useEffect(
    () => {
      if (cardMovedToDeleted == true) {
        moveNoteToDeleted()
      }
    }, [cardMovedToDeleted]
  )

  return (
    <>
      <div onClick={handleClick} style={{ backgroundColor: cardBackgroundColor }} className="max-w-80 min-w-80 flex gap-8 flex-col rounded-xl justify-center py-8 px-4 hover:opacity-60 ease-in-out duration-500 drop-shadow-2xl hover:drop-shadow-2xl">
        <div className="flex gap-2 items-center text-white">
          <CiEdit size={40} className="hover:text-green-300 ease-in-out duration-200 active:opacity-40" />
          <IoMdClose
            onClick={(e) => {
              e.stopPropagation();
              setCardMovedToDeleted(true);
              toast({
                description: "the note has been moved to deleted notes",
              });
            }}
            size={30}
            className="hover:opacity-70 hover:text-red-600 ease-in-out duration-200 active:opacity-40"
          />
        </div>
        <h1 className="font-semibold break-words text-2xl text-white md:text-2xl">
          {currentHeading.replace(/&nbsp;/g, "")}
        </h1>
        <div className="overflow-hidden max-h-44 text-sm text-white" dangerouslySetInnerHTML={{ __html: currentHtmlNoteContent }} />
        <div className="flex justify-between text-white">
          <p className="text-sm">{format(dateFromDb, "PP")}</p>
          <p className="text-sm">{currentLabel}</p>
        </div>
      </div>
      <CardFocusedDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        setCurrentHtmlNoteContent={setCurrentHtmlNoteContent}
        labelFromDb={labelFromDb}
        refreshFunction={refreshFunction}
        id={id}
        headingContentFromTheDb={headingContentFromTheDb.replace(/&nbsp;/g, "")}
        intialContentFocused={intialContentFocused}
        backgroundColorFromDb={backgroundColorFromDb}
        dateFromDb={format(dateFromDb, "PP")}
        setCurrentHeading={setCurrentHeading}
        currentHtmlContent={currentHtmlNoteContent}
        setCardBackgroundColor={setCardBackgroundColor}
        setCurrentCardLabel={setCurrentLabel}
      />
    </>
  )
}

export default Card


