import { useState } from 'react';
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { JournalEntry } from "@/types/journalRelatedTypes";
import { JournalDialog } from './JournalDialog';
import type { Block } from "@blocknote/core";

interface JournalCardProps {
  entry?: JournalEntry;
  date: Date;
  onSave?: () => void;
  templateContent?: Block[];
}

export function JournalCard({ entry, date, onSave, templateContent }: JournalCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <Card 
        onClick={() => setIsDialogOpen(true)}
        className="border-none w-64 bg-neutral-600 shadow-xl shadow-neutral-600 rounded-xl 
                  hover:translate-y-5 ease-in-out duration-300 text-neutral-200 hover:bg-neutral-500 
                  cursor-pointer"
      >
        <CardContent className="flex flex-col aspect-square items-center justify-center p-6 gap-4 text-center">
          <span className="text-4xl font-semibold">{format(date, 'PPPP')}</span>
        
        </CardContent>
      </Card>      <JournalDialog 
        entry={entry}
        date={date}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEntrySaved={onSave}
        templateContent={templateContent}
      />
    </>
  );
}

//  <span className="text-4xl font-semibold">{format(date, 'MMMM yyyy')}</span>
