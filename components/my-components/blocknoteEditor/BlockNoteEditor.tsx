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
  Block,
  PartialBlock,
  BlockNoteEditor,
} from "@blocknote/core";
import { FaYoutube } from "react-icons/fa";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { SuggestionMenuController, SuggestionMenuProps, DefaultReactSuggestionItem } from "@blocknote/react";
import { getDefaultReactSlashMenuItems } from "@blocknote/react";
import BlockNoteErrorBoundary from './BlockNoteErrorBoundary';

// Define types based on the schema
type MySchema = typeof schema;
export type MyBlock = Block<MySchema["blockSchema"], MySchema["inlineContentSchema"], MySchema["styleSchema"]>;
type MyPartialBlock = PartialBlock<MySchema["blockSchema"], MySchema["inlineContentSchema"], MySchema["styleSchema"]>;
type MyEditor = BlockNoteEditor<MySchema["blockSchema"], MySchema["inlineContentSchema"], MySchema["styleSchema"]>;

interface AppProps {
  getEditorState: (content: MyBlock[]) => void;
  intialContentFocused?: string | MyPartialBlock[];
  setCurrentHtmlNoteContent: (html: string) => void;
  isNewNote: boolean;
  setHtmlContentForNewNotes: (html: string) => void;
}

const test: MyPartialBlock[] =  [
    {
      type: "paragraph",
      content: [{ type: "text", text: "here is a new note but your honset thought and your best ideas here", styles: {} }],
    }, ]

    
    const schema = BlockNoteSchema.create({
      blockSpecs: {
        // enable the default blocks if desired
        ...defaultBlockSpecs,
     
        // Add your own custom blocks:
        YoutubeEmbed: YoutubeEmbed,
      },
    });

    const insertYoutubeEmbed = (editor: MyEditor): DefaultReactSuggestionItem => ({
      title: "Embed A Youtube Video",
      onItemClick: () => {
        insertOrUpdateBlock(editor, {
          type: "YoutubeEmbed",
        });
      },
      group: "Media",
      icon: <FaYoutube />,
    });
   

export default function App({ getEditorState ,  intialContentFocused ,  setCurrentHtmlNoteContent , isNewNote , setHtmlContentForNewNotes }: AppProps) {

    const fixEmptyBlocks = (blocks: MyPartialBlock[]): MyPartialBlock[] => {
      return blocks.map(block => {
        if (block && block.type === "paragraph") {
          // Check if content is undefined, null, an empty string, or an empty array
          const isEmptyContent = !block.content ||
                                 (typeof block.content === 'string' && block.content.trim() === "") ||
                                 (Array.isArray(block.content) && block.content.length === 0);
          if (isEmptyContent) {
            return { ...block, content: [{ type: "text", text: "", styles: {} }] };
          }
        }
        return block;
      });
    };

    const getInitialContent = (content: string | MyPartialBlock[] | undefined): MyPartialBlock[] => {
      let blocks: MyPartialBlock[];
      if (Array.isArray(content)) {
        blocks = content;
      } else if (typeof content === 'string') {
        try {
          blocks = JSON.parse(content) as MyPartialBlock[];
        } catch {
          blocks = test;
        }
      } else {
        blocks = test;
      }
      return fixEmptyBlocks(blocks);
    }; 

    // Creates a new editor instance.
    const editor: MyEditor = useCreateBlockNote({
      schema , 
      initialContent: intialContentFocused ? getInitialContent(intialContentFocused) : test,
     uploadFile: async (file: File) => {
          const [res] = await uploadFiles("imageUploader" , {files: [file]});
          
          return res.url
      },

  });
    const handleEditorChange = async () => {
        const content: MyBlock[] = editor.topLevelBlocks;
        console.log(content)
        
        // Fix blocks with empty content to prevent crashes
        const processedContent: MyBlock[] = content.map(block => {
            if (block && block.type === "paragraph" && (!block.content || (Array.isArray(block.content) && block.content.length === 0))) {
                return { ...block, content: [{ type: "text", text: "", styles: {} }] };
            }
            return block;
        });
        
        const filteredContent: MyBlock[] = processedContent.filter(block => 
          (block.content && (Array.isArray(block.content) && block.content.length > 0)) || block.type === "image" || block.type === "video" || block.type === "file" || block.type === "audio" || block.type === "YoutubeEmbed"
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
      <BlockNoteErrorBoundary fallbackMessage="The text editor encountered an error.">
        <BlockNoteView theme={redTheme} editor={editor} formattingToolbar={false} onChange={handleEditorChange} slashMenu={false} >

          

          <SuggestionMenuController
            triggerCharacter={"/"}
            getItems={async (query) =>
              filterSuggestionItems(
                [
                  ...getDefaultReactSlashMenuItems(editor).filter(item => 
                    !("key" in item && (item.key === "video" || item.key === "audio" || item.title === "File"))
                  ),
                  insertYoutubeEmbed(editor)
                ],
                query
              )
            }
          />

          <FormattingToolbar />

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
      </BlockNoteErrorBoundary>
    );
}














//initialContent={intialContentFocused}


//const intialContentFocused = [{"id":"8bd664ba-9a90-4a3d-8eed-53bf85bb8401","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"Here is the new note","styles":{}}],"children":[]},{"id":"571f4444-609b-482b-9c17-8ad513a9d76f","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"add your best ideas and honset thoughts","styles":{}}],"children":[]},{"id":"f02d569c-24b1-46e0-b6f5-eb25192d91cb","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"hello world","styles":{}}],"children":[]},{"id":"b915e84b-6a3e-47fa-b2fe-e6de988c159a","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]