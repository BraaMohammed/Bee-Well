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
import { useState, useEffect } from "react";
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


// Default template with proper BlockNote structure - using a function to generate a unique ID each time
const getDefaultTemplate = () => [
    {
      id: "default-block-" + Date.now(),
      type: "paragraph",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left"
      },
      content: [
        {
          type: "text",
          text: "Empty note template - this should only appear if no content is provided.",
          styles: {}
        }
      ],
      children: []
    }
];

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

export default function App({ getEditorState, intialContentFocused, setCurrentHtmlNoteContent, isNewNote, setHtmlContentForNewNotes }) {
  const [triggerReFresh, setTriggerReFresh] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState(null);

  // Process the initial content once when the component mounts or when intialContentFocused changes
  useEffect(() => {
    console.log("BlockNoteEditor: Processing initial content", intialContentFocused);
    
    // Function to validate and process the initial content
    const processInitialContent = (content) => {
      // If content is already an array with at least one valid block
      if (Array.isArray(content) && content.length > 0 && content[0].type) {
        console.log("Using provided array content directly");
        return content;
      }
      
      // If content is a string, try to parse it
      if (typeof content === 'string' && content.trim() !== '') {
        try {
          const parsedContent = JSON.parse(content);
          // Check if parsed content is valid
          if (Array.isArray(parsedContent) && parsedContent.length > 0 && parsedContent[0].type) {
            console.log("Using parsed string content");
            return parsedContent;
          }
        } catch (e) {
          console.warn("Failed to parse content string:", e);
        }
      }
      
      // If we reach here, use the default template
      console.log("No valid content found, using default template");
      return getDefaultTemplate();
    };

    // Process and set the initial content
    const validContent = processInitialContent(intialContentFocused);
    setInitialEditorContent(validContent);
  }, [intialContentFocused]);

  // Only create the editor once we have processed the initial content
  const editor = useCreateBlockNote({
    schema,
    initialContent: initialEditorContent || getDefaultTemplate(),
    uploadFile: async (file) => {
      const [res] = await uploadFiles("imageUploader", { files: [file] });
      setTriggerReFresh(prev => !prev);
      return res.url;
    },
  });

  const handleEditorChange = async (editor) => {
    const content = editor.topLevelBlocks;
    console.log("Editor content changed:", content);
    const filteredContent = content.filter(block => 
      (block.content && block.content.length > 0) || 
      block.type === "image" || 
      block.type === "video" || 
      block.type === "file" || 
      block.type === "audio" || 
      block.type === "YoutubeEmbed"
    );
    
    getEditorState(filteredContent);
    
    const html = await editor.blocksToHTMLLossy(editor.document);
    if (!isNewNote) {
      setCurrentHtmlNoteContent(html);
    } else {
      setHtmlContentForNewNotes(html);
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
  };
   
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
  };
   
  // The combined "red theme",
  // we pass this to BlockNoteView and then the editor will automatically
  // switch between lightRedTheme / darkRedTheme based on the system theme
  const redTheme = {
    light: lightRedTheme,
    dark: darkRedTheme,
  };
   
  // Don't render editor until we've processed the initial content
  if (!initialEditorContent) {
    return <div>Loading editor...</div>;
  }

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView 
      theme={redTheme} 
      editor={editor} 
      formattingToolbar={false} 
      onChange={handleEditorChange} 
      test-css 
      slashMenu={false} 
    >
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
