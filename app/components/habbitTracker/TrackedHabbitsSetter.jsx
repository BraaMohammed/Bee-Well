"use client"
import { useState } from "react"
import { IoAdd } from "react-icons/io5";
import { useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import SelectTrackingTypeDropdown from "./SelectTrackingTypeDropdown";
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { MdDone } from "react-icons/md";
//import getTrackedHabbit from "@/app/actions/getTrackedHabbit";
import saveTrackedHabbits from "@/app/actions/saveTrackedHabbits";
import { debounce } from "@/app/actions/experemental/debounce";
import saveDailyEntry from "@/app/actions/saveDailyEntry";
import SelectBestOptionDropDown from "./SelectBestOptionDropDown";
import DeleteHabbitAlert from "./DeleteHabbitAlert";
import { useLayoutEffect } from "react";



const TrackedHabbitsSetter = ({ trackedHabbitsFromDb, newCategorySubmited, newCategoryName, setTiggerRefresh, id, entryFromDb, resetStates }) => {  // id is the id of the day's entry from the db 

    const [currentElements, setCurrentElements] = useState(trackedHabbitsFromDb) //state to store the current elements "tracked habbits"
    const [newOptionName, setNewOptionName] = useState("add the new option") //state for the new option name 
    const [showNewOption, setShowNewOption] = useState(false) // ui state to show the input field of adding a new option 
    const [selectedItem, setSelectedItem] = useState({ defaultText: "select an option" }) //state to show the selected item from a dropdown *****need modification currently only work for one dropdown 
    const [editableElements, setEditableElements] = useState({});
    const [addedNewElement, setAddedNewElement] = useState({}) //state to select the type of the new element eg: checkbox , input etc , and its category position ex :{type:"checkbox" , categoryIndex : 0 }
    const [dailyEntry, setDailyEntry] = useState(entryFromDb)
    


    let showElementEditingTextIcons
    let defaultFieldValue = null
    




    useEffect(
        () => {
            if (resetStates == true) {
                setCurrentElements(trackedHabbitsFromDb)
            }
        }, [resetStates]
    )





    useEffect(
        () => {
            if (currentElements && currentElements.habbits && newCategoryName && newCategorySubmited == true) {
                const newCategory = { categoryName: newCategoryName, elements: [] }
                setCurrentElements(
                    prevElements => {
                        const updatedElements = [...prevElements.habbits];
                        if (!updatedElements.some(c => c.categoryName == newCategoryName)) {
                            updatedElements.push(newCategory)
                            const newElements = { ...prevElements, habbits: updatedElements }
                            return newElements
                        } else {
                            return prevElements
                        }
                    }
                )

            }

        }, [newCategorySubmited]
    )



    useEffect(
        () => {
            if (currentElements && currentElements.habbits[addedNewElement.categoryIndex] && addedNewElement.type) {
                const newElement = addedNewElement.type !== "select" ? { type: addedNewElement.type, text: "edit the habbit name here" } : { type: addedNewElement.type, text: "edit the habbit name here", options: [] }
                handleAddingNewElement(addedNewElement.categoryIndex, newElement)
                setAddedNewElement({})

            }
        }
        , [addedNewElement]
    )


    const handleAddingNewElement = (categoryIndex, newElement) => {
        setCurrentElements(prevElements => {
            const updatedElements = prevElements.habbits.map((category, index) => {
                if (index === categoryIndex) {
                    return {
                        ...category,
                        elements: [...category.elements, newElement]
                    };
                }
                return category;
            });
            return { ...prevElements, habbits: updatedElements };
        });

        setEditableElements(prev => ({
            ...prev,
            [`${categoryIndex}-category`]: false
        }));
    };

    const handleEditStart = (categoryIndex, elementIndex) => {
        if (elementIndex === undefined) {
            setEditableElements({
                ...editableElements,
                [`${categoryIndex}-category`]: true
            });
        } else {
            setEditableElements({
                ...editableElements,
                [`${categoryIndex}-${elementIndex}`]: true
            });
        }
    };

    const handleEditChange = (categoryIndex, elementIndex, newText, newBestOption) => {
        if (elementIndex === undefined) {
            setCurrentElements(prevElements => {
                const updatedElements = prevElements.habbits.map((category, index) => {
                    if (index === categoryIndex) {
                        return {
                            ...category,
                            categoryName: newText
                        };
                    }
                    return category;
                });
                return { ...prevElements, habbits: updatedElements };
            });
        } else {
            if (newBestOption && newText == undefined) {
                setCurrentElements(prevElements => {
                    const updatedElements = prevElements.habbits.map((category, index) => {
                        if (index === categoryIndex) {
                            const updatedCategoryElements = category.elements.map((element, elIndex) => {
                                if (elIndex === elementIndex) {
                                    return { ...element, target: newBestOption };
                                }
                                return element;
                            });
                            return { ...category, elements: updatedCategoryElements };
                        }
                        return category;
                    });
                    return { ...prevElements, habbits: updatedElements };
                });

            } else {
                setCurrentElements(prevElements => {
                    const updatedElements = prevElements.habbits.map((category, index) => {
                        if (index === categoryIndex) {
                            const updatedCategoryElements = category.elements.map((element, elIndex) => {
                                if (elIndex === elementIndex) {
                                    return { ...element, text: newText };
                                }
                                return element;
                            });
                            return { ...category, elements: updatedCategoryElements };
                        }
                        return category;
                    });
                    return { ...prevElements, habbits: updatedElements };
                });
            }

        }
    };


    const handleEditEnd = (categoryIndex, elementIndex) => {
        if (elementIndex === undefined) {
            setEditableElements({
                ...editableElements,
                [`${categoryIndex}-category`]: false
            });
        } else {
            setEditableElements({
                ...editableElements,
                [`${categoryIndex}-${elementIndex}`]: false
            });
        }
    };





    const handleNewOption = (categoryIndex, elementIndex, newOption) => { //this function is to edit the options of an exsiting tracked habbits 
        setCurrentElements(prevElements => {
            const updatedElements = [...prevElements.habbits];
            if (updatedElements[categoryIndex].elements[elementIndex].options &&
                !updatedElements[categoryIndex].elements[elementIndex].options.includes(newOption)) {
                updatedElements[categoryIndex].elements[elementIndex].options.push(newOption);
            }
            const newElements = { ...prevElements, habbits: updatedElements }
            return newElements;
        })
        setShowNewOption(false)
    }

    const handleDeleteOption = (categoryIndex, elementIndex, option) => {
        setCurrentElements(prevElements => {
            const updatedElements = [...prevElements.habbits];
            if (updatedElements[categoryIndex].elements[elementIndex].options) {
                const optionIndex = updatedElements[categoryIndex].elements[elementIndex].options.findIndex(n => n == option);
                if (optionIndex !== -1) {
                    updatedElements[categoryIndex].elements[elementIndex].options.splice(optionIndex, 1);
                }
            }
            const newElements = { ...prevElements, habbits: updatedElements }
            return newElements;
        })
    }


    const handleDeleteTrackedHabbit = async (categoryIndex, elementIndex) => {
        if (elementIndex !== undefined) {
            setCurrentElements(prevElements => {
                const updatedElements = prevElements.habbits.map((category, index) => {
                    if (index === categoryIndex) {
                        const updatedCategoryElements = category.elements.filter((_, elIndex) => elIndex !== elementIndex);
                        return { ...category, elements: updatedCategoryElements };
                    }
                    return category;
                });
                return { ...prevElements, habbits: updatedElements };
            });
        } else {
            setCurrentElements(prevElements => {
                const updatedElements = prevElements.habbits.filter((_, index) => index !== categoryIndex);
                return { ...prevElements, habbits: updatedElements };
            });
            setTiggerRefresh(prev => !prev)

        }

    };

    const submitToDb = async (newTrackedHabbits) => {
        if (newTrackedHabbits && newTrackedHabbits.habbits) {
            try {
                const dataToSend = { id: newTrackedHabbits._id, newTrackedHabbits: newTrackedHabbits }
                const res = await saveTrackedHabbits(dataToSend)
                setTiggerRefresh(prev => !prev)

            }
            catch (err) {
                console.log(err)
            }

        }
    }

    const debouncedSubmitToDb = debounce(submitToDb, 500)






    const handleDailyEntryChange = async (categoryIndex, elementIndex, elementType, content, target) => {
        setDailyEntry(prevEntries => {
            const updatedEntries = [...prevEntries];

            // Find the entry for the specific category
            let categoryEntry = updatedEntries.find(e => e.categoryIndex === categoryIndex);
            let cate = currentElements.habbits[categoryIndex]
            let categoryName = cate.categoryName
            let ele = cate.elements[elementIndex]
            let elementName = ele.text

            if (!categoryEntry) {
                // If category doesn't exist, create a new one with the element
                updatedEntries.push({
                    categoryIndex: categoryIndex,
                    categoryName: categoryName,
                    elements: [{
                        elementIndex: elementIndex,
                        elementType: elementType,
                        userInput: content,
                        elementText: elementName,
                        target: target
                    }]
                });
            } else {
                // If category exists, check if the element exists
                const elementEntry = categoryEntry.elements.find(el => el.elementIndex === elementIndex);
                categoryEntry.categoryName = categoryName

                if (!elementEntry) {
                    // If element doesn't exist, add it
                    categoryEntry.elements.push({
                        elementIndex: elementIndex,
                        elementType: elementType,
                        userInput: content,
                        elementText: elementName,
                        target: target
                    });
                } else {
                    // If element exists, update it
                    elementEntry.userInput = content;
                    elementEntry.elementType = elementType;
                    elementEntry.elementText = elementName
                    elementEntry.target = target
                }
            }

            return updatedEntries;
        });
    };


    const saveDailyEntryToDb = async (id, dailyEntry) => {
        try {
            const dataToSend = { id: id, entriesFromClient: dailyEntry }
            const res = await saveDailyEntry(dataToSend)
            setTiggerRefresh(prev => !prev)

        } catch (err) {
            console.log(err)
        }

    }

    const debouncedSaveDailyEntry = debounce(saveDailyEntryToDb, 500)


    useEffect(
        () => {
            if (dailyEntry && dailyEntry.length !== 0) {

                debouncedSaveDailyEntry(id, dailyEntry)

                dailyEntry.forEach(category => {  //seting the option from the db 
                    category.elements.forEach(element => {
                        if (element.elementType === 'select') {
                            setSelectedItem(prevState => ({
                                ...prevState,
                                [`${category.categoryIndex}-${element.elementIndex}`]: element.userInput
                            }));
                        }
                    });
                });

            }





        }, [dailyEntry]


    )


    /*   useEffect(() => { //probably remove 
            if (
               currentElements &&
               trackedHabbitsFromDb &&
               !currentElements.habbits.every((element, index) => element === trackedHabbitsFromDb.habbits[index])
             ) {
               setCurrentElements(trackedHabbitsFromDb);
             }
         }, [trackedHabbitsFromDb]);
   */


    //console.log(currentElements)

    useEffect(() => {

        debouncedSubmitToDb(currentElements);


    }, [currentElements]);





    const renderFunction = (element, categoryIndex, elementIndex) => {

        const ca = dailyEntry.find(c => c.categoryIndex === categoryIndex);
        const el = ca && ca.elements ? ca.elements.find(el => el.elementIndex === elementIndex) : null;
        const defaultFieldValue = el && el.elementType === element.type ? el.userInput : null;




        switch (element.type) {



            case "checkList":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false


             
                return (
                    <div key={elementIndex} className="flex gap-2  items-center font-normal group ">
                        <h2 className="focus:outline-none border-none" onBlur={(e) => {
                            handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                            handleEditEnd(categoryIndex, elementIndex);
                        }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  > {element.text} </h2>
                        <Checkbox checked={defaultFieldValue !== null ? defaultFieldValue : false} onCheckedChange={(checked) =>
                            handleDailyEntryChange(categoryIndex, elementIndex, "checkList", checked)
                        } className="w-4 h-4" type="checkbox" />
                        {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}
                        {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                            <MdDone onClick={(e) => {
                                handleEditEnd(categoryIndex, elementIndex);
                            }} size={18} className=" hover:text-green-500 ease-in-out duration-300" />
                        }
                        <DeleteHabbitAlert habbitName={element.text} handleDeleteTrackedHabbit={handleDeleteTrackedHabbit} categoryIndex={categoryIndex} elementIndex={elementIndex} />

                    </div>
                )



            case "numberInput":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false


               
                console.log( `default value is  ${defaultFieldValue} for ${element.text}`)
                return (
                    <div key={elementIndex} className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center group font-normal">
                            <div className="flex flex-col gap-2">
                                <h2 className="focus:outline-none border-none" onBlur={(e) => {
                                    handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                                    handleEditEnd(categoryIndex, elementIndex);
                                }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text} </h2>

                            </div>
                            <input value={defaultFieldValue !== null && defaultFieldValue} onChange={(e) =>
                                handleDailyEntryChange(categoryIndex, elementIndex, "numberInput", e.target.value, element.target)
                            } style={{ borderRadius: "6px" }} className="text-neutral-950 focus:outline-none border-none rounded-lg lg:p-1 w-[10%] h-6 text-center" type="number" />
                            {!showElementEditingTextIcons && <>
                                <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />
                            </>}
                            {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                                <MdDone onClick={(e) => {
                                    handleEditEnd(categoryIndex, elementIndex);
                                }} size={18} className=" hover:text-green-500 ease-in-out duration-300" />
                            }

                            <DeleteHabbitAlert habbitName={element.text} handleDeleteTrackedHabbit={handleDeleteTrackedHabbit} categoryIndex={categoryIndex} elementIndex={elementIndex} />

                        </div>
                        {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                            <SelectBestOptionDropDown bestOptionFromDb={element.target} handleEditChange={handleEditChange} categoryIndex={categoryIndex} elementIndex={elementIndex} />
                        }
                    </div>

                )




            case "textArea":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false


                

                return (<div key={elementIndex} className=" flex flex-col group gap-1 font-normal ">
                    <h2 onBlur={(e) => {
                        handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                        handleEditEnd(categoryIndex, elementIndex);
                    }} className="flex gap-2 focus:outline-none border-none" contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text}
                        {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}
                        {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                            <MdDone onClick={(e) => {
                                handleEditEnd(categoryIndex, elementIndex);
                            }} size={18} className=" hover:text-green-500 ease-in-out duration-300" />
                        }
                        <DeleteHabbitAlert habbitName={element.text} handleDeleteTrackedHabbit={handleDeleteTrackedHabbit} categoryIndex={categoryIndex} elementIndex={elementIndex} />
                    </h2>
                    <textarea value={defaultFieldValue !== null && defaultFieldValue} onChange={(e) =>
                        handleDailyEntryChange(categoryIndex, elementIndex, "textArea", e.target.value)
                    } className=" text-neutral-950 focus:outline-none border-none rounded-xl w-[60%] p-2" placeholder="enter your notes here" />

                </div>)






            case "select":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false


                

                return (
                    <div key={elementIndex} className="flex flex-col gap-2"  >

                        <div className="flex gap-2 group">
                            <h2 className="focus:outline-none border-none" onBlur={(e) => {
                                handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                                handleEditEnd(categoryIndex, elementIndex);
                            }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text} </h2>

                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex gap-2 items-center bg-neutral-600 px-2 rounded-xl">
                                    {selectedItem[`${categoryIndex}-${elementIndex}`] || selectedItem.defaultText}
                                    <RiArrowDropDownLine size={30} />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className=" flex flex-col gap-1  shadow-lg rounded-xl p-2 shadow-neutral-950 border-none bg-neutral-600  ">

                                    {element.options && element.options.map((o, index) => <p key={index} style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDailyEntryChange(categoryIndex, elementIndex, "select", o, element.target);
                                        }}>{o}

                                        < MdDeleteForever onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteOption(categoryIndex, elementIndex, o)
                                        }} size={20} className=" opacity-0 group-hover:opacity-100 ease-in-out  duration-300 text-neutral-300 hover:text-red-700" />  </p>)}

                                    <p onClick={() => { setShowNewOption(true) }} style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 p-1 flex gap-2 items-center">Add An Option <IoAdd size={20} /> </p>

                                    {showNewOption && <div className="flex gap-2 items-center justify-between group"> <input style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 bg-neutral-600  p-1 focus:border-none focus:outline-none" placeholder={newOptionName} contentEditable="true" onChange={(e) => { setNewOptionName(e.target.value) }}></input>

                                        <MdDone onClick={() => { handleNewOption(categoryIndex, elementIndex, newOptionName.trim()) }} size={22} className=" hover:text-green-500 ease-in-out duration-300" /> </div>}


                                </DropdownMenuContent>
                            </DropdownMenu>
                            {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                                <MdDone onClick={(e) => {
                                    handleEditEnd(categoryIndex, elementIndex);
                                }} size={18} className=" hover:text-green-500 ease-in-out duration-300" />
                            }
                            {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}
                            <DeleteHabbitAlert habbitName={element.text} handleDeleteTrackedHabbit={handleDeleteTrackedHabbit} categoryIndex={categoryIndex} elementIndex={elementIndex} />
                        </div>

                        {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                            <SelectBestOptionDropDown bestOptionFromDb={element.target} handleEditChange={handleEditChange} categoryIndex={categoryIndex} elementIndex={elementIndex} options={element.options && element.options} />
                        }
                    </div>
                )




        }
    }


    /*
     {editableElements[`${categoryIndex}-${elementIndex}`] == true &&
                                <MdDone onClick={(e) => {
                                handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                                handleEditEnd(categoryIndex, elementIndex);
                            }} className=" hover:text-green-500 ease-in-out duration-300"    />
                            }
    
    */




    return (
        <div>
            {currentElements && currentElements.habbits ? (
                currentElements.habbits.map((category, categoryIndex) => (
                    <div className="flex flex-col gap-2 item" key={categoryIndex}>
                        <h2 onBlur={(e) => {
                            if (editableElements[`${categoryIndex}-category`]) {
                                handleEditChange(categoryIndex, undefined, e.target.textContent);
                                handleEditEnd(categoryIndex, undefined);
                            }
                        }}
                            contentEditable={editableElements[`${categoryIndex}-category`] || false}
                            className="lg:text-2xl text-xl font-semibold flex gap-2 group items-center pt-6"
                        >
                            {category.categoryName}
                            < SelectTrackingTypeDropdown setAddedNewElement={setAddedNewElement} categoryIndex={categoryIndex} triggerElement={<IoAdd size={20} className=" hidden active:opacity-60 group-hover:block hover:text-green-500 ease-in-out duration-300" />} ></SelectTrackingTypeDropdown>

                            <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex) }} size={20} className=" hidden active:opacity-60 group-hover:block hover:text-green-500 ease-in-out duration-300" />

                            <DeleteHabbitAlert habbitName={category.categoryName} handleDeleteTrackedHabbit={handleDeleteTrackedHabbit} categoryIndex={categoryIndex} elementIndex={undefined} />

                        </h2>
                        <div className="flex flex-col gap-4">
                            {category.elements.map((element, elementIndex) =>
                                renderFunction(element, categoryIndex, elementIndex)
                            )}
                        </div>
                    </div>
                ))
            ) : <>
                <p className="  text-xl text-current text-white"> you currently have no tracked habbits </p>
                <p className=" text-xl text-current text-white"> Start by adding a category and add habbits to it  </p>
            </>}
        </div>
    )
}

export default TrackedHabbitsSetter












/*    setEditableElements(prevEditableElements => ({
                        ...prevEditableElements,
                        [`${addedNewElement.categoryIndex}-${currentElements.habbits[addedNewElement.categoryIndex].elements.length}`]: true
                    }));*/








/*
   const handleNewOption = (categoryIndex, elementIndex, newOption) => {
        setCurrentElements(prevElements => {
            const updatedElements = [...prevElements];
            if (!updatedElements[categoryIndex].elements[elementIndex].options.includes(newOption)) {
                updatedElements[categoryIndex].elements[elementIndex].options.push(newOption);
            }
            return updatedElements;
        });
        setShowNewOption(false);
    };


*/








/*



 return (<div key={elementIndex} className="flex gap-2 group">
                    <h2 className="focus:outline-none border-none" onBlur={(e) => {
                        handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                        handleEditEnd(categoryIndex, elementIndex);
                    }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text} </h2>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex gap-2 items-center bg-neutral-600 px-2 rounded-xl">
                            {selectedItem[`${categoryIndex}-${elementIndex}`] || selectedItem.defaultText}
                            <RiArrowDropDownLine size={30} />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className=" flex flex-col gap-1  shadow-lg rounded-xl p-2 shadow-neutral-950 border-none bg-neutral-600  ">

                            {element.options && element.options.map((e, index) => <p key={index} style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between"
                                onClick={() => {
                                    setSelectedItem({
                                        ...selectedItem,
                                        [`${categoryIndex}-${elementIndex}`]: e
                                    });
                                    handleDailyEntryChange(categoryIndex, elementIndex, "select", e);
                                }}>{e}

                                < MdDeleteForever size={20} className=" opacity-0 group-hover:opacity-100 ease-in-out  duration-300 text-neutral-300 hover:text-red-700" />  </p>)}

                            <p onClick={() => { setShowNewOption(true) }} style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 p-1 flex gap-2 items-center">Add An Option <IoAdd size={20} /> </p>

                            {showNewOption && <div className="flex gap-2 items-center justify-between group"> <input style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 bg-neutral-600  p-1 focus:border-none focus:outline-none" placeholder={newOptionName} contentEditable="true" onChange={(e) => { setNewOptionName(e.target.value) }}></input>

                                <MdDone onClick={() => { handleNewOption(categoryIndex, elementIndex, newOptionName.trim()) }} size={22} className=" hover:text-green-500 ease-in-out duration-300" /> </div>}


                        </DropdownMenuContent>
                    </DropdownMenu>

                    {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}
                    <IoMdClose onClick={() => { handleDeleteTrackedHabbit(categoryIndex, elementIndex) }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end" size={18} />
                </div>)






*/

























/*




 /*  const gettrackedHabbitsFromDb = async () => {
        try {
            const res = await getTrackedHabbit()
            const fetchedData = JSON.parse(res)
            setTrackedHabbitsFromDb(fetchedData)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        
        gettrackedHabbitsFromDb()

    }, [])

    useEffect(() => {
        if (trackedHabbitsFromDb && trackedHabbitsFromDb.habbits) {
            setCurrentElements(trackedHabbitsFromDb.habbits)
        }
    }, [trackedHabbitsFromDb])*/























/*

const TrackedHabbitsSetter = ({ trackedHabbitsFromDb }) => {

    const [currentElements, setCurrentElements] = useState(trackedHabbitsFromDb.habbits.elements || []) //state to store the current elements "tracked habbits"
    const [newOptionName, setNewOptionName] = useState("add the new option") //state for the new option name 
    const [showNewOption, setShowNewOption] = useState(false) // ui state to show the input field of adding a new option 
    const [selectedItem, setSelectedItem] = useState("select an option") //state to show the selected item from a dropdown *****need modification currently only work for one dropdown 
    const [editableElements, setEditableElements] = useState({});
    const [addedNewElement, setAddedNewElement] = useState({}) //state to select the type of the new element eg: checkbox , input etc , and its category position ex :{type:"checkbox" , categoryIndex : 0 }

    let showElementEditingTextIcons


   // useEffect(
     //   () => {
       //    const newElement = {type : addedNewElement.type , text :""}
         //  handleAddingNewElement(addedNewElement.categoryIndex ,newElement )
    //       setEditableElements(addedNewElement.categoryIndex , currentElements[addedNewElement.categoryIndex].elements.length ) //this function accept category index and element index 
//
  //      }
    //    , [addedNewElement]
   // )


    const handleAddingNewElement = (categoryIndex, newElement) => {
        setCurrentElements(prevElements => {
            const updatedElements = [...prevElements.habbits];
            updatedElements[categoryIndex].elements.push(newElement);
            const newElements = { ...prevElements, habbits: updatedElements }
            return newElements;
        })
    }

    const handleEditStart = (categoryIndex, elementIndex) => { //to make the element editable
        setEditableElements({
            ...editableElements,
            [`${categoryIndex}-${elementIndex}`]: true
        });
    };

    const handleEditChange = (categoryIndex, elementIndex, newText) => {//saving the new habbit text or name to the current elements
        setCurrentElements(prevElements => {
            const updatedElements = [...prevElements.habbits];
            updatedElements[categoryIndex].elements[elementIndex].text = newText;
            return { ...prevElements, habbits: updatedElements };
        });
    };

    const handleEditEnd = (categoryIndex, elementIndex) => { // to set it back as not editable
        setEditableElements({
            ...editableElements,
            [`${categoryIndex}-${elementIndex}`]: false
        });
    };


    useEffect(() => {
        if (trackedHabbitsFromDb) {
            setCurrentElements(trackedHabbitsFromDb);
        }
    }, [trackedHabbitsFromDb]);


    const handleNewOption = (categoryIndex, elementIndex, newOption) => { //this function is to edit the options of an exsiting tracked habbits 
        setCurrentElements(prevElements => {
            const updatedElements = [...prevElements.habbits];
            if (!updatedElements[categoryIndex].elements[elementIndex].options.includes(newOption)) {
                updatedElements[categoryIndex].elements[elementIndex].options.push(newOption);
            }
            const newElements = { ...prevElements, habbits: updatedElements }
            return newElements;
        })
        setShowNewOption(false)
    }







    const renderFunction = (element, categoryIndex, elementIndex) => {
        switch (element.type) {
            case "checkList":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false
                return (
                    <div className="flex gap-2  items-center font-normal group ">
                        <h2 className="focus:outline-none border-none" onBlur={(e) => {
                            handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                            handleEditEnd(categoryIndex, elementIndex);
                        }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text} </h2>  <Checkbox className="w-4 h-4" type="checkbox" />
                        {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}
                        <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />

                    </div>
                )
            case "numberInput":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false

                return (<div className="flex gap-2 items-center group font-normal">
                    <h2 className="focus:outline-none border-none" onBlur={(e) => {
                        handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                        handleEditEnd(categoryIndex, elementIndex);
                    }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text} </h2>   <input style={{ borderRadius: "6px" }} className="text-neutral-950 focus:outline-none border-none rounded-lg lg:p-1 w-[10%] h-6 text-center" type="number" />
                    {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}

                    <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />

                </div>)
            case "textArea":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false

                return (<div className=" flex flex-col group gap-1 font-normal ">
                    <h2 onBlur={(e) => {
                        handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                        handleEditEnd(categoryIndex, elementIndex);
                    }} className="flex gap-2 focus:outline-none border-none" contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text}
                        {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}

                        <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />
                    </h2>
                    <textarea className=" text-neutral-950 focus:outline-none border-none rounded-xl w-[60%] p-2" placeholder="enter your notes here" />

                </div>)

            case "select":
                showElementEditingTextIcons = editableElements[`${categoryIndex}-${elementIndex}`] || false

                return (<div className="flex gap-2 group">
                    <h2 className="focus:outline-none border-none" onBlur={(e) => {
                        handleEditChange(categoryIndex, elementIndex, e.target.textContent);
                        handleEditEnd(categoryIndex, elementIndex);
                    }} contentEditable={editableElements[`${categoryIndex}-${elementIndex}`] || false}  >   {element.text} </h2>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex gap-2 items-center bg-neutral-600 px-2 rounded-xl">{selectedItem}<RiArrowDropDownLine size={30} /></DropdownMenuTrigger>


                        <DropdownMenuContent className=" flex flex-col gap-1  shadow-lg rounded-xl p-2 shadow-neutral-950 border-none bg-neutral-600  ">

                            {element.options.map((e, index) => <p key={index} style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 p-1 group flex gap-2 items-center justify-between" onClick={() => setSelectedItem(e)}>{e}
                                < MdDeleteForever size={20} className=" opacity-0 group-hover:opacity-100 ease-in-out  duration-300 text-neutral-300 hover:text-red-700" />  </p>)}

                            <p onClick={() => { setShowNewOption(true) }} style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 p-1 flex gap-2 items-center">Add An Option <IoAdd size={20} /> </p>

                            {showNewOption && <div className="flex gap-2 items-center justify-between group"> <input style={{ borderRadius: "5px" }} className="hover:bg-neutral-500 bg-neutral-600  p-1 focus:border-none focus:outline-none" placeholder={newOptionName} contentEditable="true" onChange={(e) => { setNewOptionName(e.target.value) }}></input>

                                <MdDone onClick={() => { handleNewOption(categoryIndex, elementIndex, newOptionName.trim()) }} size={22} className=" hover:text-green-500 ease-in-out duration-300" /> </div>}


                        </DropdownMenuContent>
                    </DropdownMenu>

                    {!showElementEditingTextIcons && <MdOutlineEdit onClick={() => { handleEditStart(categoryIndex, elementIndex); }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />}
                    <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end" size={18} />
                </div>)
        }
    }




















    return (
        <div>
            {currentElements.habbits && currentElements.habbits.length > 0 ? (
                currentElements.habbits.map((category, categoryIndex) => (
                    <div className="flex flex-col gap-2 item" key={category._id}>
                        <h2 className="lg:text-2xl text-xl font-semibold flex gap-2 group items-center">{category.categoryName}
                            < SelectTrackingTypeDropdown setAddedNewElement={setAddedNewElement} categoryIndex={categoryIndex} triggerElement={<IoAdd size={20} className=" hidden active:opacity-60 group-hover:block hover:text-green-500 ease-in-out duration-300" />} ></SelectTrackingTypeDropdown>
                            <MdOutlineEdit size={20} className=" hidden active:opacity-60 group-hover:block hover:text-green-500 ease-in-out duration-300" />
                            <IoMdClose size={20} className=" hidden active:opacity-60 group-hover:block hover:text-red-500 ease-in-out duration-300" />
                        </h2>
                        <div className="flex flex-col gap-3">
                            {category.elements.map((element, elementIndex) =>
                                renderFunction(element, categoryIndex, elementIndex)
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className=" text-center text-xl">No habits found start by adding new habbits or add a category.</p>
            )}
        </div>
    )
}

export default TrackedHabbitsSetter




 



*/