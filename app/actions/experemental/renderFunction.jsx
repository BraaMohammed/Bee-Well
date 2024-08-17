"use client"








const renderFunction = (element, categoryIndex, elementIndex , setSelectedItem, setShowNewOption, 
                       setNewOptionName, selectedItem, showNewOption, newOptionName, handleNewOption
                        , editingElement , setEditingElement ,  elementNewName , setElementNewName , showEditableElementName , setShowEditableElementName  ) => {
 

           
       const handleNameChange = (categoryIndex , elementIndex ,newName)=>{
       }



    switch (element.type) {
        case "checkList":
            return (
                <div className="flex gap-2  items-center font-normal group ">
                       <div contentEditable={showEditableElementName ? "true" : 'false'}>  {element.text} </div>  <Checkbox className="w-4 h-4" type="checkbox" />
                    <MdOutlineEdit onClick={()=>{ setShowEditableElementName(true) }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />
                    <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />

                </div>
            )
        case "numberInput":
            return (<div className="flex gap-2 items-center group font-normal">
              <div contentEditable={showEditableElementName ? "true" : 'false'}>   {element.text} </div>  <input style={{ borderRadius: "6px" }} className="text-neutral-950 focus:outline-none border-none rounded-lg lg:p-1 w-[10%] h-6 text-center" type="number" />
                <MdOutlineEdit onClick={()=>{ setShowEditableElementName(true) }} className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />

                <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />

            </div>)
        case "textArea":
            return (<div className=" flex flex-col group gap-1 font-normal ">
                <div className="flex gap-2">
                    {element.text}
                    <MdOutlineEdit className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end mb-1" size={18} />

                    <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end mb-1" size={18} />
                </div>
                <textarea className=" text-neutral-950 focus:outline-none border-none rounded-xl w-[60%] p-2" placeholder="enter your notes here" />

            </div>)

        case "select":
            return (<div className="flex gap-2 group">

                {element.text}

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

                <MdOutlineEdit className=" hidden group-hover:block ease-in-out duration-300 hover:text-green-500 active:opacity-60 justify-self-end " size={18} />
                <IoMdClose className=" hidden group-hover:block ease-in-out duration-300 hover:text-red-500 active:opacity-60 justify-self-end" size={18} />
            </div>)
    }
}

export default renderFunction