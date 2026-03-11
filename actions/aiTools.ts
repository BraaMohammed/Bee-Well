'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getNotes } from '@/actions/getNotes';
import { getLabels } from '@/actions/getLabels';
import { getJournalEntriesByYear } from '@/actions/getAllJournalEntries';

// ==========================================
// Isolated AI Tools as Server Actions
// ==========================================

export async function aiGetNotesOverview(labelName?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const notes = await getNotes(labelName ? { labelName } : {});
        return {
            success: true,
            count: notes.length,
            notes: notes.map(note => ({
                id: note.id,
                heading: note.heading || 'Untitled',
                labelName: note.labelName,
                created_at: note.created_at,
                hasContent: !!note.content
            }))
        };
    } catch (error) {
        console.error('Error in aiGetNotesOverview:', error);
        return { success: false, error: 'Failed to fetch notes overview' };
    }
}

export async function aiGetNotesByIds(noteIds: string[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const allNotes = await getNotes({});
        const selectedNotes = allNotes.filter(note => noteIds.includes(note.id));

        if (selectedNotes.length === 0) {
            return { success: false, error: 'No notes found with provided IDs' };
        }

        return {
            success: true,
            count: selectedNotes.length,
            notes: selectedNotes.map(note => ({
                id: note.id,
                heading: note.heading,
                content: note.content,
                htmlContent: note.htmlContent,
                labelName: note.labelName,
                backgroundColor: note.backgroundColor,
                created_at: note.created_at
            }))
        };
    } catch (error) {
        console.error('Error in aiGetNotesByIds:', error);
        return { success: false, error: 'Failed to fetch specific notes' };
    }
}

export async function aiGetLabels() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const labels = await getLabels();
        return {
            success: true,
            labels: labels.map(label => ({
                id: label.id,
                name: label.name,
                color: label.color,
                notesCount: label.notesIds?.length || 0
            }))
        };
    } catch (error) {
        console.error('Error in aiGetLabels:', error);
        return { success: false, error: 'Failed to fetch labels' };
    }
}

export async function aiGetJournalOverview(year: number) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const entries = await getJournalEntriesByYear(year);
        return {
            success: true,
            year,
            count: entries.length,
            dates: entries.map(entry => ({
                id: entry.id,
                date: entry.date,
                createdAt: entry.createdAt,
                hasContent: !!entry.content
            }))
        };
    } catch (error) {
        console.error('Error in aiGetJournalOverview:', error);
        return { success: false, error: 'Failed to fetch journal overview' };
    }
}

export async function aiGetJournalEntriesByDateRange(startDate: string, endDate: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const year = parseInt(startDate.split('-')[0]);
        const allEntries = await getJournalEntriesByYear(year);

        const filteredEntries = allEntries.filter(entry => {
            const entryDate = entry.date instanceof Date
                ? entry.date.toISOString().split('T')[0]
                : entry.date;
            return entryDate >= startDate && entryDate <= endDate;
        });

        return {
            success: true,
            count: filteredEntries.length,
            startDate,
            endDate,
            entries: filteredEntries.map(entry => ({
                id: entry.id,
                date: entry.date,
                content: entry.content,
                createdAt: entry.createdAt,
                updatedAt: entry.updatedAt
            }))
        };
    } catch (error) {
        console.error('Error in aiGetJournalEntriesByDateRange:', error);
        return { success: false, error: 'Failed to fetch journal entries' };
    }
}

export async function aiGetHabitsOverview() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const { getHabitTemplate } = await import('@/actions/getHabitTemplate');
        const result = await getHabitTemplate();

        if (!result.success || !result.data) {
            return { success: false, error: result.error || 'No habit template found' };
        }

        const habitsOverview = Object.entries(result.data.categories || {}).flatMap(([categoryName, category]: [string, any]) =>
            Object.entries((category as any).habits || {}).map(([habitKey, habit]: [string, any]) => ({
                habitKey,
                name: habit.name || habitKey,
                category: categoryName,
                type: habit.type || 'unknown',
                config: habit.type === 'checkbox' ? 'Yes/No tracking' :
                    habit.type === 'counter' ? `Counter (Goal: ${habit.goal || 'N/A'})` :
                        habit.type === 'slider' ? `Slider (Range: ${habit.min || 0}-${habit.max || 100})` :
                            'Unknown type'
            }))
        );

        return { success: true, count: habitsOverview.length, habits: habitsOverview };
    } catch (error) {
        console.error('Error in aiGetHabitsOverview:', error);
        return { success: false, error: 'Failed to fetch habits overview' };
    }
}

export async function aiGetHabitRecords(startDate: string, endDate: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const { getDailyEntries } = await import('@/actions/getDailyEntries');
        const result = await getDailyEntries(session.user.id, startDate, endDate);

        if (!result.success) {
            return { success: false, error: result.error || 'Failed to fetch habit records' };
        }

        return {
            success: true,
            count: result.data?.length || 0,
            startDate,
            endDate,
            records: result.data || []
        };
    } catch (error) {
        console.error('Error in aiGetHabitRecords:', error);
        return { success: false, error: 'Failed to fetch habit records' };
    }
}

export async function aiGetHabitTemplateDetails() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error('Unauthorized');

    try {
        const { getHabitTemplate } = await import('@/actions/getHabitTemplate');
        const result = await getHabitTemplate();

        if (!result.success) {
            return { success: false, error: result.error || 'Failed to fetch habit template' };
        }

        return { success: true, template: result.data };
    } catch (error) {
        console.error('Error in aiGetHabitTemplateDetails:', error);
        return { success: false, error: 'Failed to fetch habit template details' };
    }
}
