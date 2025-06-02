import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { JournalEntry } from '@/types/journalRelatedTypes';
import { format } from 'date-fns';
import { SlOptions } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import dynamic from 'next/dynamic';
import { saveJournalEntry } from '@/app/actions/saveJournalEntry';
import { getJournalEntryByDate } from '@/app/actions/getJournalEntry'; // Add this
// Import BlockNote core types and a temporary editor for HTML conversion
import { BlockNoteEditor as BlockNoteEditorType, Block } from '@blocknote/core';
import { MyBlock } from '@/components/my-components/blocknoteEditor/BlockNoteEditor';
const BlockNoteEditor = dynamic(() => import("@/components/my-components/blocknoteEditor/BlockNoteEditor"), { ssr: false });

const validateBlock = (block: any): boolean => {
  if (!block || typeof block !== 'object') return false;
  
  // Check required block properties
  if (!block.type || !block.content || !Array.isArray(block.content)) return false;
  
  // Validate block props
  if (!block.props || typeof block.props !== 'object') return false;
  
  // Validate content items
  return block.content.every((item: any) => 
    item && typeof item === 'object' && item.type && typeof item.type === 'string'
  );
};

const PLACEHOLDER_TEXT = "Here is a new note. Add your honest thoughts and best ideas here.";

// Helper function to convert blocks to HTML (client-side)
// This requires @blocknote/core to be available
async function convertBlocksToHtml(blocks: Block[]): Promise<string> {
  if (!blocks || blocks.length === 0) return '';
  // Create a temporary, headless editor instance for conversion
  const tempEditor = BlockNoteEditorType.create();
  const html = await tempEditor.blocksToHTMLLossy(blocks);
  // tempEditor.destroy(); // Removed destroy call
  return html;
}

interface JournalDialogProps {
  entry?: JournalEntry;
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  onEntrySaved?: () => void;
  templateContent?: Block[]; // Assuming templateContent is also Block[]
}

export function JournalDialog({ entry, date, isOpen, onClose, onEntrySaved, templateContent }: JournalDialogProps) {
  // 'content' state will store Block[] for saving and for initial editor content
  const [content, setContent] = useState<Block[] | null>(null);
  // 'editorHtmlContent' state is removed as initial content is passed as Block[]

  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialContentLoaded, setInitialContentLoaded] = useState(false);
  const [isNewEntry, setIsNewEntry] = useState(true); // To manage the isNewNote prop
  useEffect(() => {
    if (isOpen) {
      console.log("==== Journal Dialog Opened ====");
      console.log("Template content received:", JSON.stringify(templateContent));
      // Reset content to null when dialog opens and starts loading
      setContent(null);
      setInitialContentLoaded(false);
      setIsLoading(true);
      const loadContent = async () => {
        let newBlocks: Block[] | null = null;
        let entryExisted = false;
        try {
          // First, check if the entry prop is provided and matches the current date
          if (entry && entry.date && new Date(entry.date).toDateString() === date.toDateString()) {
            console.log("Existing entry found in props:", entry);
            const existingContent = entry.content || [];
            let shouldUseTemplateInstead = false;

            // Check if existingContent is the placeholder
            if (
              Array.isArray(existingContent) &&
              existingContent.length === 1 &&
              existingContent[0]?.type === "paragraph" &&
              existingContent[0]?.content &&
              Array.isArray(existingContent[0].content) &&
              existingContent[0]?.content.length === 1 &&
              existingContent[0]?.content[0].type === "text" &&
              existingContent[0]?.content[0].text === PLACEHOLDER_TEXT
            ) {
              // Now check if a valid templateContent is available
              if (templateContent && Array.isArray(templateContent) && templateContent.length > 0) {
                console.log("Existing entry is placeholder and template is available. Prioritizing template.");
                shouldUseTemplateInstead = true;
              }
            }

            if (shouldUseTemplateInstead && templateContent) {
              console.log("Using provided template content from props (overriding placeholder)");
              newBlocks = JSON.parse(JSON.stringify(templateContent)); // Deep copy
              if(newBlocks)
              newBlocks = newBlocks?.map(block => ({
                ...block,
                id: "template-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9)
              }));
              console.log("Final blocks to use (from template overriding placeholder):", JSON.stringify(newBlocks));
              entryExisted = false; // Effectively, we are starting with a template
            } else {
              console.log("Using existing entry content (not a placeholder or no template to override):", JSON.stringify(existingContent));
              newBlocks = existingContent;
              entryExisted = true;
            }
          } else {
            // If not, fetch the entry for the specific date
            console.log("Fetching entry for date:", date);
            const fetchedEntry = await getJournalEntryByDate(date); // Use the new action
            console.log("Fetched entry result:", fetchedEntry);
            if (fetchedEntry) {
              const fetchedContent = fetchedEntry.content || [];
              let shouldUseTemplateInsteadFromFetched = false;
              // Check if fetchedContent is the placeholder
              if (
                Array.isArray(fetchedContent) &&
                fetchedContent.length === 1 &&
                fetchedContent[0]?.type === "paragraph" &&
                fetchedContent[0]?.content &&
                Array.isArray(fetchedContent[0].content) &&
                fetchedContent[0]?.content.length === 1 &&
                fetchedContent[0]?.content[0].type === "text" &&
                fetchedContent[0]?.content[0].text === PLACEHOLDER_TEXT
              ) {
                if (templateContent && Array.isArray(templateContent) && templateContent.length > 0) {
                  console.log("Fetched entry is placeholder and template is available. Prioritizing template.");
                  shouldUseTemplateInsteadFromFetched = true;
                }
              }

              if (shouldUseTemplateInsteadFromFetched && templateContent) {
                console.log("Using provided template content from props (overriding fetched placeholder)");
                newBlocks = JSON.parse(JSON.stringify(templateContent));
                if(newBlocks) // Deep copy
                newBlocks = newBlocks?.map(block => ({
                  ...block,
                  id: "template-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9)
                }));
                entryExisted = false; // Effectively, we are starting with a template
              } else {
                newBlocks = fetchedContent;
                entryExisted = true;
                console.log("Using fetched entry content (not a placeholder or no template to override):");
              }
            } else {              // If no entry exists for the date, use template content
              console.log("No existing or fetched entry found, attempting to use template content:", JSON.stringify(templateContent));
              if (templateContent && Array.isArray(templateContent) && templateContent.length > 0) {
                console.log("Using provided template content from props for new entry");
                // Validate template content before using it
                const validTemplateContent = templateContent.filter(block => 
                  block && 
                  typeof block === 'object' && 
                  block.type && 
                  block.content && 
                  Array.isArray(block.content)
                );
                
                if (validTemplateContent.length > 0) {
                  newBlocks = JSON.parse(JSON.stringify(validTemplateContent));
                  if(newBlocks) {
                    newBlocks = newBlocks.map(block => ({
                      ...block,
                      id: "template-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9)
                    }));
                  }
                  console.log("Final blocks to use (from template for new entry):", JSON.stringify(newBlocks));
                } else {
                  // Fall back to default if template content is invalid
                  console.log("Template content was invalid, using fallback");
                  newBlocks = [
                    {
                      id: "fallback-block-" + Date.now(),
                      type: "paragraph",
                      props: {
                        textColor: "default",
                        backgroundColor: "default",
                        textAlignment: "left"
                      },
                      content: [
                        {
                          type: "text",
                          text: PLACEHOLDER_TEXT, // Use defined placeholder text
                          styles: {}
                        }
                      ],
                      children: []
                    }
                  ];
                }
              } else {
                console.log("No valid template content, using fallback for new entry");
                newBlocks = [
                  {
                    id: "fallback-block-" + Date.now(),
                    type: "paragraph",
                    props: {
                      textColor: "default",
                      backgroundColor: "default",
                      textAlignment: "left"
                    },
                    content: [
                      {
                        type: "text",
                        text: PLACEHOLDER_TEXT, // Use defined placeholder text
                        styles: {}
                      }
                    ],
                    children: []
                  }
                ];
              }
              entryExisted = false;
            }
          }
          setContent(newBlocks);
          setIsNewEntry(!entryExisted);
        } catch (error) {
          console.error("Failed to load journal entry:", error);
          setContent(null); // Set to null on error
          setIsNewEntry(true); // Assume new on error
        } finally {
          setIsLoading(false);
          setIsDirty(false);
          setInitialContentLoaded(true);
        }
      };
      loadContent();
    } else {
      setContent(null); // Reset to null when dialog is not open
      // setEditorHtmlContent(''); // Removed
      setIsDirty(false);
      setInitialContentLoaded(false);
    }
  }, [isOpen, date, entry, templateContent]);

  const handleSave = async () => {
    if (!isDirty || !initialContentLoaded) return;
    setIsLoading(true);
    try {
      // We save the 'content' state which is Block[]
      await saveJournalEntry(date, content);
      setIsDirty(false);
      if (onEntrySaved) onEntrySaved();
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttemptClose = async () => {
    if (isDirty && initialContentLoaded) await handleSave();
    onClose();
  };
    const handleEditorStateUpdate = useCallback((newBlocksFromEditor: MyBlock[]) => {
    if (initialContentLoaded && Array.isArray(newBlocksFromEditor)) {
      try {
        // More thorough validation of blocks
        const validBlocks = newBlocksFromEditor.filter(block => {
          if (!block || typeof block !== 'object') return false;
          
          // Ensure all required properties exist
          const hasRequiredProps = block.type 
            && block.content 
            && Array.isArray(block.content)
            && block.props
            && typeof block.props === 'object';
          
          if (!hasRequiredProps) return false;
          
          // Validate content items
          let hasValidContent = false;
          if (Array.isArray(block.content)) {
            hasValidContent = block.content.every((item: any) => 
              item && typeof item === 'object' && item.type && typeof item.type === 'string'
            );
          } else {
            hasValidContent = false;
          }
          
          return hasValidContent;
        });

        if (validBlocks.length > 0) {
          setContent(validBlocks as Block[]);
          setIsDirty(true);
        } else {
          console.warn('No valid blocks found in editor update');
        }
      } catch (error) {
        console.error('Error validating editor blocks:', error);
      }
    }
  }, [initialContentLoaded]);

  // Dummy functions for HTML content props as BlockNoteEditor expects them
  const handleSetCurrentHtml = (html: string) => {
    // console.log("Editor HTML updated (existing note):", html);
    // JournalDialog primarily works with Blocks, this callback is here to satisfy the prop requirement.
  };

  const handleSetHtmlForNewNotes = (html: string) => {
    // console.log("Editor HTML updated (new note):", html);
    // JournalDialog primarily works with Blocks, this callback is here to satisfy the prop requirement.
  };

  // Log content state whenever it changes
  useEffect(() => {
    // console.log("JournalDialog: content state is now:", JSON.stringify(content));
  }, [content]);

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => { if (!openState) handleAttemptClose(); }}>
      <DialogContent 
        className="bg-neutral-700 border-none focus:outline-none p-10 mx-auto 
                  max-w-[85%] lg:max-w-[40%] h-[80vh] overflow-y-auto scrollbar-webkit"
        style={{ borderRadius: "20px" }}
      >
        <div className="flex flex-col h-full gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="lg:text-3xl text-xl font-semibold">
                Journal Entry
              </h1>
              <p className="font-extralight lg:text-sm text-xs">
                Record your thoughts and reflections for the day
              </p>
            </div>
            <div className="flex items-center gap-4">
             
            </div>
          </div>

          {/* Date display */}
          <div className="text-sm font-medium">
            {format(date, 'PPPP')}
          </div>

          {/* Editor */}
          <div className="flex-grow min-h-0">
            {(isLoading && !initialContentLoaded) ? (
                <div className="flex items-center justify-center h-full">
                    <p>Loading entry...</p>
                </div>
            ) : (                <BlockNoteEditor
                  getEditorState={handleEditorStateUpdate} 
                  intialContentFocused={content || [{
                    id: "initial-" + Date.now(),
                    type: "paragraph",
                    props: {
                      textColor: "default",
                      backgroundColor: "default",
                      textAlignment: "left"
                    },
                    content: [{
                      type: "text",
                      text: "",
                      styles: {}
                    }],
                    children: []
                  }]} 
                  isNewNote={isNewEntry}
                  setCurrentHtmlNoteContent={handleSetCurrentHtml}
                  setHtmlContentForNewNotes={handleSetHtmlForNewNotes}
                />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
