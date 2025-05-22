'use client'
import "@blocknote/core/fonts/inter.css";
import { FormattingToolbar, useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
    BasicTextStyleButton,
    BlockTypeSelect,
    ColorStyleButton,
    CreateLinkButton,
    FileCaptionButton,
    FileReplaceButton,
    FormattingToolbarController,
    NestBlockButton,
    TextAlignButton,
    UnnestBlockButton,
  } from "@blocknote/react";
import { uploadFiles } from "@/lib/uploadthing";
import "./style.css";
import { useState } from "react";
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { FaYoutube } from "react-icons/fa";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { SuggestionMenuController } from "@blocknote/react";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";


const test =  [
    {
      type: "paragraph",
      content: "here is a new note but your honset thought and your best ideas here",
    }, ]

    
    const schema = BlockNoteSchema.create({
      blockSpecs: {
        // enable the default blocks if desired
        ...defaultBlockSpecs,
     
        // Add your own custom blocks:
        YoutubeEmbed: YoutubeEmbed,
      },
    });

    const insertYoutubeEmbed = (editor) => ({
      title: "Embed A Youtube Video",
      onItemClick: () => {
        insertOrUpdateBlock(editor, {
          type: "YoutubeEmbed",
        });
      },
      group: "Media",
      icon: <FaYoutube />,
    });
   

export default function App({ getEditorState ,  intialContentFocused ,  setCurrentHtmlNoteContent , isNewNote , setHtmlContentForNewNotes }) {

   const [triggerReFresh, setTriggerReFresh] = useState(false)

    const getInitialContent = (content) => {
        if (Array.isArray(content)) return content;
        try {
            return JSON.parse(content);
        } catch {
            return test;
        }
    }; 

    // Creates a new editor instance.
    const editor = useCreateBlockNote({
      schema , 
      initialContent: intialContentFocused ? getInitialContent(intialContentFocused) : test,
     uploadFile: async (file) => {
          const [res] = await uploadFiles("imageUploader" , {files: [file]});
          setTriggerReFresh(prev => !prev)
          return res.url
      },

  });


    const handleEditorChange = async (editor) => {
        const content = editor.topLevelBlocks;
        console.log(content)
        const filteredContent = content.filter(block => 
          (block.content && block.content.length > 0 && block) || block?.type === "image" || block?.type === "video" || block?.type === "file" || block?.type === "audio" || block?.type === "YoutubeEmbed"
        );
        console.log(filteredContent)
        getEditorState(filteredContent) 
        const html = await editor.blocksToHTMLLossy(editor.document);

        if(!isNewNote){
            setCurrentHtmlNoteContent(html)
        }else{
            setHtmlContentForNewNotes(html)
        }
        
      };




      const lightRedTheme = {
        colors: {
          editor: {
            text: "#222222",
          },
          menu: {
            text: "#222222",
            background: "#f5f5f5",
          },
          tooltip: {
            text: "#222222",
            background: "#e5e5e5",

          },
          hovered: {
            text: "#222222",
            background: "#e5e5e5",
          },
          selected: {
            text: "#222222",
            background: "#d4d4d4",

          },
          disabled: {
            text: "#222222",
            background: "#f5f5f5",

          },
          shadow: "#ffffff00",

        },
      } ;
       
      // The theme for dark mode,
      // users the light theme defined above with a few changes
      const darkRedTheme = {
        ...lightRedTheme,
        colors: {
          ...lightRedTheme.colors,
          editor: {
            text: "#ffffff",
            background: "#9b0000",
          },
          sideMenu: "#ffffff",
        },
      } ;
       
      // The combined "red theme",
      // we pass this to BlockNoteView and then the editor will automatically
      // switch between lightRedTheme / darkRedTheme based on the system theme
      const redTheme = {
        light: lightRedTheme,
        dark: darkRedTheme,
      };
       


    // Renders the editor instance using a React component.
    return (
        // Disables the default formatting toolbar and re-adds it without the
        // `FormattingToolbarController` component. You may have seen
        // `FormattingToolbarController` used in other examples, but we omit it here
        // as we want to control the position and visibility ourselves. BlockNote
        // also uses the `FormattingToolbarController` when displaying the
        // Formatting Toolbar by default.
    <BlockNoteView theme={redTheme} editor={editor} formattingToolbar={false} onChange={handleEditorChange} test-css slashMenu={false} >

      

      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          filterSuggestionItems(
            [
              ...getDefaultReactSlashMenuItems(editor).filter(item => 
                !(item.key === "video" || item.key === "audio" || item.title === "File")
              ),
              insertYoutubeEmbed(editor)
            ],
            query
          )
        }
      />

      <FormattingToolbar test-css />

      <FormattingToolbarController
        formattingToolbar={() => (
          <FormattingToolbar>
            <BlockTypeSelect key={"blockTypeSelect"} />

            {/* Extra button to toggle blue text & background */}

            <FileCaptionButton key={"fileCaptionButton"} />
            <FileReplaceButton key={"replaceFileButton"} />

            <BasicTextStyleButton
              basicTextStyle={"bold"}
              key={"boldStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"italic"}
              key={"italicStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"underline"}
              key={"underlineStyleButton"}
            />
            <BasicTextStyleButton
              basicTextStyle={"strike"}
              key={"strikeStyleButton"}
            />
            {/* Extra button to toggle code styles */}
            <BasicTextStyleButton
              key={"codeStyleButton"}
              basicTextStyle={"code"}
            />

            <TextAlignButton
              textAlignment={"left"}
              key={"textAlignLeftButton"}
            />
            <TextAlignButton
              textAlignment={"center"}
              key={"textAlignCenterButton"}
            />
            <TextAlignButton
              textAlignment={"right"}
              key={"textAlignRightButton"}
            />

            <ColorStyleButton key={"colorStyleButton"} />

            <NestBlockButton key={"nestBlockButton"} />
            <UnnestBlockButton key={"unnestBlockButton"} />

            <CreateLinkButton key={"createLinkButton"} />


          </FormattingToolbar>
        )}
      />
    </BlockNoteView>
  );
}














//initialContent={intialContentFocused}


//const intialContentFocused = [{"id":"8bd664ba-9a90-4a3d-8eed-53bf85bb8401","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"Here is the new note","styles":{}}],"children":[]},{"id":"571f4444-609b-482b-9c17-8ad513a9d76f","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"add your best ideas and honset thoughts","styles":{}}],"children":[]},{"id":"f02d569c-24b1-46e0-b6f5-eb25192d91cb","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"hello world","styles":{}}],"children":[]},{"id":"b915e84b-6a3e-47fa-b2fe-e6de988c159a","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]