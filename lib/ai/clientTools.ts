import { tool } from 'ai';
import { z } from 'zod';
import {
    aiGetNotesOverview,
    aiGetNotesByIds,
    aiGetLabels,
    aiGetJournalOverview,
    aiGetJournalEntriesByDateRange,
    aiGetHabitsOverview,
    aiGetHabitRecords,
    aiGetHabitTemplateDetails
} from '@/actions/aiTools';

export function getClientTools({ notes, journal, habits }: { notes: boolean, journal: boolean, habits: boolean }) {
    const tools: Record<string, any> = {};

    if (notes) {
        tools.getNotesOverview = tool({
            description: 'Get an overview of all user notes with titles and labels only (no content). Use this FIRST to see what notes exist, then call getNotesByIds for specific content.',
            inputSchema: z.object({
                labelName: z.string().optional().describe('Optional label name to filter notes by category'),
            }),
            execute: async ({ labelName }) => {
                return await aiGetNotesOverview(labelName);
            },
        });

        tools.getNotesByIds = tool({
            description: 'Get full content of specific notes by their IDs. Use this AFTER getNotesOverview to fetch only relevant notes.',
            inputSchema: z.object({
                noteIds: z.array(z.string()).describe('Array of note IDs to fetch full content for'),
            }),
            execute: async ({ noteIds }) => {
                return await aiGetNotesByIds(noteIds);
            },
        });

        tools.getLabels = tool({
            description: 'Get all user labels/categories to understand note organization',
            inputSchema: z.object({}),
            execute: async () => {
                return await aiGetLabels();
            },
        });
    }

    if (journal) {
        tools.getJournalOverview = tool({
            description: 'Get an overview of journal entries showing only dates and entry count. Use this FIRST to see available journal dates, then use getJournalEntriesByDateRange for specific content.',
            inputSchema: z.object({
                year: z.number().describe('Year to get journal overview for (e.g., 2025)'),
            }),
            execute: async ({ year }) => {
                return await aiGetJournalOverview(year);
            },
        });

        tools.getJournalEntriesByDateRange = tool({
            description: 'Get full journal entries within a specific date range. Use this AFTER getJournalOverview to fetch only relevant time periods.',
            inputSchema: z.object({
                startDate: z.string().describe('Start date in YYYY-MM-DD format'),
                endDate: z.string().describe('End date in YYYY-MM-DD format'),
            }),
            execute: async ({ startDate, endDate }) => {
                return await aiGetJournalEntriesByDateRange(startDate, endDate);
            },
        });
    }

    if (habits) {
        tools.getHabitsOverview = tool({
            description: 'Get an overview of all habits currently being tracked (names, categories, types). Use this FIRST to see what habits exist, then use getHabitRecords for historical data.',
            inputSchema: z.object({}),
            execute: async () => {
                return await aiGetHabitsOverview();
            },
        });

        tools.getHabitRecords = tool({
            description: 'Get habit tracking records within a specific date range. Use this AFTER getHabitsOverview to analyze habit performance over time.',
            inputSchema: z.object({
                startDate: z.string().describe('Start date in YYYY-MM-DD format'),
                endDate: z.string().describe('End date in YYYY-MM-DD format'),
            }),
            execute: async ({ startDate, endDate }) => {
                return await aiGetHabitRecords(startDate, endDate);
            },
        });

        tools.getHabitTemplateDetails = tool({
            description: 'Get the complete habit template with all configuration details. Use this when you need to understand habit goals, thresholds, and detailed settings.',
            inputSchema: z.object({}),
            execute: async () => {
                return await aiGetHabitTemplateDetails();
            },
        });
    }

    return tools;
}
