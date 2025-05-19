import { useEffect, useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JournalTemplate } from '@/types/journalRelatedTypes';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';
import { saveJournalTemplate } from '@/app/actions/saveJournalTemplate';
import { getJournalTemplate } from '@/app/actions/getJournalTemplate';

const BlockNoteEditor = dynamic(() => import("@/components/my-components/blocknoteEditor/BlockNoteEditor"), { ssr: false });

interface TemplateEditorProps {
  template?: JournalTemplate;
  onSave?: (content: any) => void; // Kept onSave for now, can be removed if not needed by parent
  // Added prop to refresh data in parent component
  onTemplateSaved?: () => void; 
}

export function TemplateEditor({ template, onSave, onTemplateSaved }: TemplateEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<any>(template?.content || []);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [initialContentLoaded, setInitialContentLoaded] = useState(!!template); // Track if initial content is loaded

  useEffect(() => {
    if (template) {
      setContent(template.content);
      setInitialContentLoaded(true);
    }
  }, [template]);

  // Fetch template when dialog opens if not already loaded
  useEffect(() => {
    if (isOpen && !initialContentLoaded) {
      const fetchTemplate = async () => {
        setIsLoading(true);
        try {
          const fetchedTemplate = await getJournalTemplate();
          if (fetchedTemplate && fetchedTemplate.content) {
            setContent(fetchedTemplate.content);
          }
        } catch (error) {
          console.error("Failed to fetch template:", error);
          // Handle error (e.g., show a toast message)
        } finally {
          setIsLoading(false);
          setInitialContentLoaded(true); // Mark as loaded even if fetch failed or no template
        }
      };
      fetchTemplate();
    }
    // Reset initial content loaded state when dialog closes
    if (!isOpen) {
        setInitialContentLoaded(!!template); // Reset based on prop for next open
    }
  }, [isOpen, initialContentLoaded, template]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveJournalTemplate(content);
      if (onSave) { // Call original onSave if provided
        onSave(content);
      }
      if (onTemplateSaved) { // Call new prop to notify parent
        onTemplateSaved();
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to save template:", error);
      // Handle error (e.g., show a toast message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-700 
                    active:opacity-60 ease-in-out duration-300 bg-green-600 text-white"
        >
          Edit Template <IoIosAddCircleOutline size={20} />
        </Button>
      </DialogTrigger>

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
                Journal Template
              </h1>
              <p className="font-extralight lg:text-sm text-xs">
                Customize your daily journal template
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleSave}
                disabled={isLoading} // Disable button when loading
                className="px-4 py-1 bg-green-600 hover:bg-green-800 ease-in-out duration-300 rounded-xl"
              >
                {isLoading ? 'Saving...' : 'Save Template'}
              </Button>
          
            </div>
          </div>

          {/* Editor */}
          <div className="flex-grow min-h-0">
            {isOpen && (isLoading && !content.length && !initialContentLoaded) ? ( // Show loading indicator if fetching initial content and content is empty
                <div className="flex items-center justify-center h-full">
                    <p>Loading template...</p>
                </div>
            ) : (                <BlockNoteEditor
                  getEditorState={setContent} 
                  intialContentFocused={content}
                  isNewNote={false}
                  setCurrentHtmlNoteContent={(html) => {/* Template doesn't need HTML content */}}
                  setHtmlContentForNewNotes={(html) => {/* Template doesn't need HTML content */}}
                />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
