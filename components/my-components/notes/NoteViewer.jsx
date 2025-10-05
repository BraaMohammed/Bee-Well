'use client'
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
//import DragAndDropPlugin from '../actions/DragAndDropPlugin';
import { useCallback } from 'react';

const EditorComposer = dynamic(
  () =>
    import(
      'verbum'
    ).then((mod) => mod.EditorComposer),
  { ssr: false }
);

const Editor = dynamic(
  () => import('verbum').then((mod) => mod.Editor),
  { ssr: false }
);

const ToolbarPlugin = dynamic(
  () => import('verbum').then((mod) => mod.ToolbarPlugin),
  { ssr: false }
);

const AlignDropdown = dynamic(
  () => import('verbum').then((mod) => mod.AlignDropdown),
  { ssr: false }
);

const BackgroundColorPicker = dynamic(
  () => import('verbum').then((mod) => mod.BackgroundColorPicker),
  { ssr: false }
);

const BoldButton = dynamic(
  () => import('verbum').then((mod) => mod.BoldButton),
  { ssr: false }
);

const CodeFormatButton = dynamic(
  () => import('verbum').then((mod) => mod.CodeFormatButton),
  { ssr: false }
);

const FloatingLinkEditor = dynamic(
  () => import('verbum').then((mod) => mod.FloatingLinkEditor),
  { ssr: false }
);

const FontFamilyDropdown = dynamic(
  () => import('verbum').then((mod) => mod.FontFamilyDropdown),
  { ssr: false }
);

const FontSizeDropdown = dynamic(
  () => import('verbum').then((mod) => mod.FontSizeDropdown),
  { ssr: false }
);

const InsertDropdown = dynamic(
  () => import('verbum').then((mod) => mod.InsertDropdown),
  { ssr: false }
);

const InsertLinkButton = dynamic(
  () => import('verbum').then((mod) => mod.InsertLinkButton),
  { ssr: false }
);

const ItalicButton = dynamic(
  () => import('verbum').then((mod) => mod.ItalicButton),
  { ssr: false }
);

const TextColorPicker = dynamic(
  () => import('verbum').then((mod) => mod.TextColorPicker),
  { ssr: false }
);

const TextFormatDropdown = dynamic(
  () => import('verbum').then((mod) => mod.TextFormatDropdown),
  { ssr: false }
);

const UnderlineButton = dynamic(
  () => import('verbum').then((mod) => mod.UnderlineButton),
  { ssr: false }
);

const Divider = dynamic(
  () => import('verbum').then((mod) => mod.Divider),
  { ssr: false }
);
//




//our app is a note talking app
//this component is a part of note focused component 
//in the first load of the page it dont render
//when the user clicks on a note from the page the focused component renders and when he clicks of it , it is minized or something like that



const NoteViewer = ({ intialContentFocused, getEditorState }) => {


 const [hoveredElement , setHoveredElement] = useState(null)

 
// old code dont change
  const onChangeHandler = (editorState) => {
    getEditorState(editorState)
  }



/*
  const setupDragAndDrop = useCallback((editor) => {
    if (!editor) return;

    const handleMouseEnter = (event) => {
      const paragraph = event.target.closest('p');
      if (paragraph) {
        setHoveredElement(paragraph);
      }
    };

    const handleMouseLeave = () => {
      setHoveredElement(null);
    };

    const handleDragStart = (event) => {
      const dragHandle = event.target.closest('.drag-handle');
      if (!dragHandle) return;

      const paragraph = dragHandle.parentElement;
      event.dataTransfer.setData('text/html', paragraph.outerHTML);
      event.dataTransfer.setData('text/plain', paragraph.textContent);
    };

    const handleDragOver = (event) => {
      event.preventDefault();
      const paragraph = event.target.closest('p');
      if (paragraph) {
        const rect = paragraph.getBoundingClientRect();
        const middleY = rect.top + rect.height / 2;
        if (event.clientY < middleY) {
          paragraph.style.borderTop = '2px solid #007bff';
          paragraph.style.borderBottom = 'none';
        } else {
          paragraph.style.borderBottom = '2px solid #007bff';
          paragraph.style.borderTop = 'none';
        }
      }
    };

    const handleDragLeave = (event) => {
      const paragraph = event.target.closest('p');
      if (paragraph) {
        paragraph.style.borderTop = 'none';
        paragraph.style.borderBottom = 'none';
      }
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const content = event.dataTransfer.getData('text/html');
      const targetParagraph = event.target.closest('p');
      
      if (targetParagraph) {
        const rect = targetParagraph.getBoundingClientRect();
        const middleY = rect.top + rect.height / 2;
        const insertBefore = event.clientY < middleY;

        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const newNode = $createNodeFromHTML(content);
            if (insertBefore) {
              targetParagraph.insertAdjacentHTML('beforebegin', content);
            } else {
              targetParagraph.insertAdjacentHTML('afterend', content);
            }
            // Remove the original node
            newNode.getParent().remove();
          }
        });
      }

      // Reset all paragraph borders
      editor.getRootElement().querySelectorAll('p').forEach(p => {
        p.style.borderTop = 'none';
        p.style.borderBottom = 'none';
      });
    };

    const rootElement = editor.getRootElement();
    rootElement.addEventListener('mouseenter', handleMouseEnter, true);
    rootElement.addEventListener('mouseleave', handleMouseLeave, true);
    rootElement.addEventListener('dragstart', handleDragStart);
    rootElement.addEventListener('dragover', handleDragOver);
    rootElement.addEventListener('dragleave', handleDragLeave);
    rootElement.addEventListener('drop', handleDrop);

    return () => {
      if (rootElement) {
        rootElement.removeEventListener('mouseenter', handleMouseEnter, true);
        rootElement.removeEventListener('mouseleave', handleMouseLeave, true);
        rootElement.removeEventListener('dragstart', handleDragStart);
        rootElement.removeEventListener('dragover', handleDragOver);
        rootElement.removeEventListener('dragleave', handleDragLeave);
        rootElement.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  useEffect(() => {
    if (hoveredElement) {
      const dragHandle = document.createElement('div');
      dragHandle.className = 'drag-handle';
      dragHandle.style.position = 'absolute';
      dragHandle.style.left = '-20px';
      dragHandle.style.top = '50%';
      dragHandle.style.transform = 'translateY(-50%)';
      dragHandle.style.cursor = 'grab';
      dragHandle.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3h2v2H9V3zm4 0h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm-4 0h2v2H9v-2zm0-4h2v2H9V7zm-4 4h2v2H5v-2zm0-4h2v2H5V7zm8 8h2v2h-2v-2zm-4 0h2v2H9v-2zm-4 0h2v2H5v-2z"/></svg>';
      dragHandle.draggable = true;
      hoveredElement.style.position = 'relative';
      hoveredElement.appendChild(dragHandle);

      return () => {
        hoveredElement.removeChild(dragHandle);
        hoveredElement.style.position = '';
      };
    }
  }, [hoveredElement]);

*/
  

  return (
    <EditorComposer initialEditorState={intialContentFocused}>
      <Editor
        onChange={onChangeHandler}

        emojisEnabled={true}
        emojiPickerEnabled={true}
        hashtagsEnabled={true}
        
      >
        <ToolbarPlugin defaultBgColor="transparent" defaultFontColor="#FFFFFF" defaultFontSize="40px">
          <FontFamilyDropdown />
          <FontSizeDropdown />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <InsertDropdown enableYoutube={true} />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default NoteViewer;

//we need note content and id








/*useEffect(() => {
  // Use the dummy state as if it were fetched from the database
  setEditorState(JSON.stringify(dummyInitialStateObject));
}, []); */
// Empty dependency array means this runs once on mount







/*


 // const [editorState, setEditorState] = useState(null);
  // const [newNote, setNewNote] = useState(isNewNote);


  /*const onChangeHandler = (editorState) => {
    setEditorState(editorState);
    // If you need the serialized state for saving:
    const jsonString = JSON.stringify(editorState);
    console.log(jsonString);
    debouncedSubmitToDb()
  };
_________________________
*const submitToDb = async () => {
    const res = await fetch('/api/savenote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ heading: headingContent, content: editorState, isNewNote: newNote , id: id })
    });
    if (res.status === 200) {
      setNewNote(false);
    }
  };

  const debouncedSubmitToDb = debounce(submitToDb, 500);
______________________________
useEffect(() => {
    const timer = setTimeout(() => {
      const parentElement = document.querySelector('.ContentEditable__root');
      if (newNote) {
        parentElement.innerHTML = dummyEditorContent;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);
*/





































//semi working version

/*
'use client'
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRef } from 'react';


const EditorComposer = dynamic(
  () =>
    import(
      'verbum'
    ).then((mod) => mod.EditorComposer),
  { ssr: false }
);

const Editor = dynamic(
  () => import('verbum').then((mod) => mod.Editor),
  { ssr: false }
);

const ToolbarPlugin = dynamic(
  () => import('verbum').then((mod) => mod.ToolbarPlugin),
  { ssr: false }
);

const AlignDropdown = dynamic(
  () => import('verbum').then((mod) => mod.AlignDropdown),
  { ssr: false }
);

const BackgroundColorPicker = dynamic(
  () => import('verbum').then((mod) => mod.BackgroundColorPicker),
  { ssr: false }
);

const BoldButton = dynamic(
  () => import('verbum').then((mod) => mod.BoldButton),
  { ssr: false }
);

const CodeFormatButton = dynamic(
  () => import('verbum').then((mod) => mod.CodeFormatButton),
  { ssr: false }
);

const FloatingLinkEditor = dynamic(
  () => import('verbum').then((mod) => mod.FloatingLinkEditor),
  { ssr: false }
);

const FontFamilyDropdown = dynamic(
  () => import('verbum').then((mod) => mod.FontFamilyDropdown),
  { ssr: false }
);

const FontSizeDropdown = dynamic(
  () => import('verbum').then((mod) => mod.FontSizeDropdown),
  { ssr: false }
);

const InsertDropdown = dynamic(
  () => import('verbum').then((mod) => mod.InsertDropdown),
  { ssr: false }
);

const InsertLinkButton = dynamic(
  () => import('verbum').then((mod) => mod.InsertLinkButton),
  { ssr: false }
);

const ItalicButton = dynamic(
  () => import('verbum').then((mod) => mod.ItalicButton),
  { ssr: false }
);

const TextColorPicker = dynamic(
  () => import('verbum').then((mod) => mod.TextColorPicker),
  { ssr: false }
);

const TextFormatDropdown = dynamic(
  () => import('verbum').then((mod) => mod.TextFormatDropdown),
  { ssr: false }
);

const UnderlineButton = dynamic(
  () => import('verbum').then((mod) => mod.UnderlineButton),
  { ssr: false }
);

const Divider = dynamic(
  () => import('verbum').then((mod) => mod.Divider),
  { ssr: false }
);
//







const NoteViewer = ({ headingContent, isNewNote ,intialContentFocused }) => {


  const [editorState, setEditorState] = useState('');
  const [newNote, setNewNote] = useState(isNewNote)



  function debounce(func, wait) {  //chatgpt code , function to wait for the db , you shouldnt post a request every second
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }


  const onChangeHandler = (content)=>{
    setEditorState(content)
    console.log(editorState)

    }

    const dummyintialStateObject ={"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1},{"format":"","type":"youtube","version":1,"videoID":"ErJr0w67grg"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"color: #ffffff;","text":"Ana wStormyteam","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h1"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}

    const dummyintialState = JSON.stringify(dummyintialStateObject)

  const submitToDb = async () => {

    const res = await fetch('/api/savenote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ heading: headingContent, content: editorState, isNewNote: newNote})
    })
    if (res.status == 200) {
      setNewNote(false)
    }
  }
  const debouncedSubmitToDb = debounce(submitToDb, 500);


  return (
    <EditorComposer >
      <Editor initialEditorState={dummyintialState} onChange={onChangeHandler}
        emojisEnabled={true} emojiPickerEnabled={true} hashtagsEnabled={true}>
        <ToolbarPlugin defaultBgColor="#ffffff" defaultFontColor="#000" defaultFontSize="40px">
          <FontFamilyDropdown />
          <FontSizeDropdown />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown enableYoutube={true} />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default NoteViewer;



*/














//version need fix on 2nd render the contnet is lost 

/*

//our app is a note talking app
//this component is a part of note focused component 
//in the first load of the page it dont render
//when the user clicks on a note from the page the focused component renders and when he clicks of it , it is minized or something like that



const NoteViewer = ({ headingContent, isNewNote, intialContentFocused }) => {


  const [editorState, setEditorState] = useState('');
  const [newNote, setNewNote] = useState(isNewNote)
  const [isRendered, setIsRendered] = useState(false)
  const dummyEditorContent = `<h1 class="PlaygroundEditorTheme__h1 PlaygroundEditorTheme__ltr" dir="ltr"><strong class="PlaygroundEditorTheme__textBold PlaygroundEditorTheme__textUnderline" data-lexical-text="true" style="color: rgb(255, 255, 255);">Heading 1 </strong></h1><p class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr" dir="ltr"><span data-lexical-text="true" style="color: rgb(255, 255, 255);">1- point 1 </span></p><p class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr" dir="ltr"><span data-lexical-text="true" style="color: rgb(255, 255, 255);">2- point 2 </span></p><p class="PlaygroundEditorTheme__paragraph PlaygroundEditorTheme__ltr" dir="ltr"><span data-lexical-text="true" style="color: rgb(255, 255, 255);">3- point 3 </span></p><p class="PlaygroundEditorTheme__paragraph"><br></p><div data-lexical-decorator="true" contenteditable="false"><div class=""><iframe width="560" height="315" src="https://www.youtube.com/embed/qhbKRE1o55s" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" title="YouTube video"></iframe></div></div><p class="PlaygroundEditorTheme__paragraph"><br></p><div data-lexical-decorator="true" contenteditable="false"><div class=""><iframe width="560" height="315" src="https://www.youtube.com/embed/ViCYbZyO4xg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" title="YouTube video"></iframe></div></div><p class="PlaygroundEditorTheme__paragraph"><br></p>`




  function debounce(func, wait) {  // function to wait for the db , you shouldnt post a request every second 
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }



 
// the three following useEffect are used to render the editor content that we got from the db 
// we use thoose because of the broken library that dont support intial contnet
//for now we use dummyEditorContent as if we got the editor content from the db

  useEffect(() => {
    let observer;

    const checkAndSetContent = () => {
      const targetElement = document.querySelector('.__className_7df6af');
      const parentElement = document.querySelector('.ContentEditable__root');
      if (targetElement && targetElement.style.overflow === 'hidden' && parentElement) {
        setIsRendered(true);
        parentElement.innerHTML = dummyEditorContent;
      }
    };

    const initObserver = () => {
      observer = new MutationObserver(() => {
        checkAndSetContent();
      });

      const targetElement = document.querySelector('.__className_7df6af');
      if (targetElement) {
        observer.observe(targetElement, { attributes: true, attributeFilter: ['style'] });
        checkAndSetContent(); // Check once initially in case it's already rendered
      } else {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };

    initObserver();

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [dummyEditorContent]);

  useEffect(() => {
    if (!isRendered) {
      const parentElement = document.querySelector('.ContentEditable__root');
      if (parentElement) {
        parentElement.innerHTML = dummyEditorContent;
      }
    }
  }, [isRendered, dummyEditorContent]);


  // the 2 useEffect before this line make the focused note veiwer render dummyEditorContent when it opened after it first rendered 
  

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const parentElement = document.querySelector('.ContentEditable__root');
      if (parentElement) {
        setIsRendered(true);
        parentElement.innerHTML = dummyEditorContent;
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []); 

  // the useEffect before this line make the focused note veiwer render dummyEditorContent for the first render only 

  //never change the order of the useEffects otherwise the loading content wont work 




  const onChangeHandler = () => {
    const parentElement = document.querySelector('.ContentEditable__root');
    const content = parentElement.innerHTML;
    setEditorState(content)
    console.log(editorState)

  }




  const submitToDb = async () => {

    const res = await fetch('/api/savenote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ heading: headingContent, content: editorState, isNewNote: newNote })
    })
    if (res.status == 200) {
      setNewNote(false)
    }
  }


  const debouncedSubmitToDb = debounce(submitToDb, 500);



  return (
    <EditorComposer >
      <Editor onChange={onChangeHandler}
        emojisEnabled={true} emojiPickerEnabled={true} hashtagsEnabled={true}>
        <ToolbarPlugin defaultBgColor="#ffffff" defaultFontColor="#FFFFFF" defaultFontSize="40px">
          <FontFamilyDropdown />
          <FontSizeDropdown />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown enableYoutube={true} />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default NoteViewer;


*/