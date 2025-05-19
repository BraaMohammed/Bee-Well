import { Block } from '@blocknote/core';

export interface JournalTemplate {
    id: string;
    userId: string;
    content: Block[];
    updatedAt: Date;
    createdAt: Date;
}

export interface JournalEntry {
    id: string;
    userId: string;
    content: Block[];
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface JournalStats {
    totalEntries: number;
    streakDays: number;
    lastEntryDate: Date | null;
    writtenDates: Date[];
}
