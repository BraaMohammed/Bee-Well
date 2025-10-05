# Journal Feature Documentation

This document outlines the structure and interaction of components and server actions related to the journal feature in the Bee-Well application.

## Overview

The journal feature allows users to create, view, and manage daily journal entries. Users can also define a template for their entries and view statistics about their journaling activity. The feature relies on a set of React components for the user interface and server actions for data persistence and retrieval.

## Data Types (`types/journalRelatedTypes.ts`)

This file defines the core data structures used throughout the journal feature:

*   **`JournalEntry`**: Represents a single journal entry made by a user for a specific date.
    *   `id: string`
    *   `userId: string`
    *   `content: Block[]` (Rich text content from BlockNote editor)
    *   `date: Date`
    *   `createdAt: Date`
    *   `updatedAt: Date`
*   **`JournalTemplate`**: Defines the structure of a user's preferred journal template.
    *   `id: string`
    *   `userId: string`
    *   `content: Block[]` (Rich text content for the template)
    *   `updatedAt: Date`
    *   `createdAt: Date`
*   **`JournalStats`**: Holds statistics related to a user's journaling activity.
    *   `totalEntries: number`
    *   `streakDays: number`
    *   `lastEntryDate: Date | null`
    *   `writtenDates: Date[]` (Array of dates for which entries exist, used by the activity chart)

## UI Components (`components/my-components/journal/`)

These React components are responsible for rendering the user interface of the journal feature.

### 1. `JournalCard.tsx` (within a Carousel)

*   **Purpose**: Displays a visual card for each day, indicating whether a journal entry exists for that day. These cards will be presented in a carousel/slider interface, allowing users to swipe or navigate through dates.
*   **Props**:
    *   `entry?: JournalEntry`: The journal entry object if one exists for the card's date.
    *   `date: Date`: The specific date this card represents.
    *   `onSave?: () => void`: Callback function, likely to refresh data on the parent page after an entry is saved via the dialog.
    *   `templateContent?: Block[]`: The user's journal template content, passed down to `JournalDialog`.
*   **Interaction**:
    *   Displays the day and month/year.
    *   Shows "Entry written" if an `entry` is provided.
    *   On click, it opens the `JournalDialog` component, passing the `entry`, `date`, `onSave` callback, and `templateContent`.
    *   The collection of `JournalCard`s will be rendered within a carousel component (e.g., `shadcn/ui` Carousel) on the `app/journal/page.tsx`.

### 2. `JournalDialog.tsx`

*   **Purpose**: A dialog modal for creating a new journal entry or editing an existing one. It uses the `BlockNoteEditor` for rich text input.
*   **Props**:
    *   `entry?: JournalEntry`: The existing journal entry if editing.
    *   `date: Date`: The date for which the entry is being made/edited.
    *   `isOpen: boolean`: Controls the visibility of the dialog.
    *   `onClose: () => void`: Function to call when the dialog should be closed.
    *   `onEntrySaved?: () => void`: Callback invoked after an entry is successfully saved.
    *   `templateContent?: Block[]`: The content of the user's journal template, used if creating a new entry and no specific entry for the date exists.
*   **Interaction**:
    *   **Loading Content**:
        1.  When opened, if an `entry` prop is provided and its date matches the dialog's `date`, it loads `entry.content` into the editor.
        2.  If no `entry` is provided or the dates don't match, it *should* ideally attempt to fetch the specific journal entry for the given `date` (e.g., using a `getJournalEntryByDate(date)` server action).
        3.  If no entry is found for the `date` (neither passed as a prop nor fetched), it loads the `templateContent` into the editor.
        4.  If no entry and no template, it starts with an empty editor.
    *   **Saving Content**:
        *   When the user saves, the `handleSave` function calls the `saveJournalEntry(date, content)` server action.
        *   After a successful save, it calls the `onEntrySaved` prop (if provided) to notify the parent component (e.g., `JournalPage`) to refresh its data.
    *   **Closing**: Calls `onClose` when the dialog is dismissed. If there are unsaved changes (`isDirty`), it attempts to save before closing.

### 3. `JournalActivityChart.tsx`

*   **Purpose**: Displays a visual representation (similar to a GitHub contribution graph) of the user's journaling activity over the past year.
*   **Props**:
    *   `writtenDates: Date[]`: An array of dates for which journal entries have been written. This data typically comes from `JournalStats`.
*   **Interaction**:
    *   Generates a grid of cells, each representing a day in the last 365 days.
    *   Colors cells based on whether an entry exists for that day (derived from `writtenDates`).
    *   Provides tooltips showing the date and entry status.

### 4. `TemplateEditor.tsx`

*   **Purpose**: A dialog modal that allows the user to create or edit their journal template using the `BlockNoteEditor`.
*   **Props**:
    *   `template?: JournalTemplate`: The existing journal template, if one exists.
    *   `onTemplateSaved?: () => void`: Callback invoked after the template is successfully saved.
*   **Interaction**:
    *   **Loading Content**:
        *   When opened, if a `template` prop is provided, it loads `template.content` into the editor.
        *   If no `template` is provided, it *should* call the `getJournalTemplate()` server action to fetch the user's current template. If no template exists, it starts with an empty editor.
    *   **Saving Content**:
        *   When the user saves, the `handleSave` function calls the `saveJournalTemplate(content)` server action.
        *   After a successful save, it calls the `onTemplateSaved` prop (if provided) to notify the parent component.

## Page Component (`app/journal/page.tsx`)

*   **Purpose**: The main page for the journal feature. It orchestrates the display of journal entries, stats, and provides access to template editing.
*   **State Management**:
    *   Manages `entries`, `template`, `stats`, `currentYear`, `isLoading`, `error`.
*   **Interaction**:
    *   **Data Fetching**:
        *   On load and when `currentYear` changes, it calls:
            *   `getJournalEntriesByYear(currentYear)` to fetch entries.
            *   `getJournalTemplate()` to fetch the user's template.
            *   `getJournalStats()` to fetch activity statistics.
        *   A daily background process (e.g., Supabase Edge Function or cron job) will ensure a blank `JournalEntry` instance is created for the current day if one doesn't already exist. This pre-populates an entry for the user.
    *   **Rendering**:
        *   Renders `JournalActivityChart`, passing `stats.writtenDates`.
        *   Renders a carousel component (e.g., from `shadcn/ui`) containing `JournalCard` components. It will map over a range of dates (e.g., current month or a defined period around the current date) to generate these cards. It passes the relevant `entry` (if found in `entriesByDate` map), `date`, `template.content` (as `templateContent`), and `handleEntrySaved` (as `onSave`) to each `JournalCard`.
        *   Provides UI elements to change the `currentYear` (which might influence the date range of the carousel).
        *   *Should* provide a UI element (e.g., a button) to open the `TemplateEditor.tsx` component, passing the fetched `template` and an `onTemplateSaved` callback to refresh the template data.
    *   **Callbacks**:
        *   `handleEntrySaved`: Called by `JournalDialog` (via `JournalCard`) after an entry is saved. This function re-fetches journal entries and stats to update the UI.
        *   An equivalent `handleTemplateSaved` (not explicitly shown but implied) would re-fetch the template if `TemplateEditor` signals a save.

## Server Actions (`app/actions/`)

These server-side functions handle data operations with the database (Supabase).

### 1. `getJournalEntriesByYear(year: number): Promise<JournalEntry[]>`
    (from `getAllJournalEntries.ts`)

*   **Purpose**: Fetches all journal entries for a specific user and year.
*   **Called by**: `app/journal/page.tsx` to populate the journal view.
*   **Note**: The `JournalDialog.tsx` currently calls this with a `Date` object, which is incorrect. It should ideally use a more specific action like `getJournalEntryByDate`.

### 2. `getJournalEntryByDate(date: Date): Promise<JournalEntry | null>`

*   **Purpose**: Fetches a single journal entry for a specific user and date.
*   **Should be called by**: `JournalDialog.tsx` when it opens, to load content for the specified date if not already passed via props.
*   *(This action was previously hypothetical and is now a core part of the implemented logic.)*

### 3. `saveJournalEntry(date: Date, content: Block[]): Promise<JournalEntry>`

*   **Purpose**: Creates a new journal entry or updates an existing one for a specific user and date.
*   **Called by**: `JournalDialog.tsx` when the user saves an entry.

### 4. `getJournalTemplate(): Promise<JournalTemplate | null>`

*   **Purpose**: Fetches the journal template for the currently authenticated user.
*   **Called by**:
    *   `app/journal/page.tsx` to pass to `JournalCard` and potentially `TemplateEditor`.
    *   `TemplateEditor.tsx` if it needs to fetch the template itself.

### 5. `saveJournalTemplate(content: Block[]): Promise<JournalTemplate>`

*   **Purpose**: Creates or updates the journal template for the currently authenticated user.
*   **Called by**: `TemplateEditor.tsx` when the user saves template changes.

### 6. `getJournalStats(): Promise<JournalStats>`

*   **Purpose**: Retrieves statistics about the user's journal entries (total entries, streak, last entry date, and all written dates in the past year).
*   **Called by**: `app/journal/page.tsx` to display stats and populate the `JournalActivityChart`.

### 7. `createDailyJournalEntry(): Promise<JournalEntry | null>` (New Server Action - for background task)

*   **Purpose**: Intended to be called by a daily scheduled task (e.g., Supabase Edge Function / cron job). Checks if a journal entry exists for the current user for the current date. If not, it creates a new, blank (or template-based) entry.
*   **Implementation Details**:
    *   Get current date.
    *   Authenticate/identify the user (this depends on how the cron job is set up and if it runs per user or globally).
    *   Check if an entry for `userId` and `currentDate` already exists.
    *   If not, create a new `JournalEntry` (potentially using the user's `JournalTemplate` if available, otherwise blank content).
    *   This action is primarily for automated daily creation, not direct user interaction.

## Development Plan to Ship Feature

This plan outlines the necessary steps to complete the journal feature, prioritizing the most critical items first.

**Phase 1: Core Entry Loading and Saving Logic**

1.  **Create `getJournalEntryByDate` Server Action:**
    *   **File:** `app/actions/getJournalEntry.ts` (or a similar new file in `app/actions/`)
    *   **Purpose:** Fetch a single journal entry for a specific user and date.
    *   **Implementation Details:**
        *   Accept `date: Date` as a parameter.
        *   Authenticate the user (`getServerSession`).
        *   Query `journal_entries` table, filter by `userId` and `date` (ensure correct date formatting for DB, e.g., `YYYY-MM-DD`).
        *   Use `.single()` for an expected single entry.
        *   Return `JournalEntry | null`.
        *   Use `parseNestedJSON` if applicable.

2.  **Update `JournalDialog.tsx` to Use `getJournalEntryByDate`:**
    *   **File:** `components/my-components/journal/JournalDialog.tsx`
    *   **Purpose:** Correctly load journal entry content.
    *   **Implementation Details:**
        *   Import the new `getJournalEntryByDate` action.
        *   In `useEffect` (`loadContent` function), replace `getJournalEntriesByYear(date)` with `getJournalEntryByDate(date)`.
        *   Adjust logic to handle the response: if `fetchedEntry` exists, use its content; otherwise, use `templateContent`.

3.  **Complete `saveJournalEntry.ts` (New Entry Creation):**
    *   **File:** `app/actions/saveJournalEntry.ts`
    *   **Purpose:** Enable creation of new journal entries.
    *   **Implementation Details:**
        *   In the `else` block (for new entries):
            *   Construct the new entry object (id, userId, content, date, createdAt, updatedAt).
            *   Use `supabase.from('journal_entries').insert({...}).select().single()`.
            *   Add error handling.
            *   Return the created entry (use `parseNestedJSON` if needed).

**Phase 2: Template Editing and Integration**

4.  **Complete `saveJournalTemplate.ts` (New Template Creation):**
    *   **File:** `app/actions/saveJournalTemplate.ts`
    *   **Purpose:** Enable creation of new journal templates.
    *   **Implementation Details:**
        *   In the `else` block (for new templates):
            *   Ensure `supabase.from('journal_templates').insert({...})` is correct.
            *   Add error handling.
            *   Return the created template (use `parseNestedJSON` if needed).

5.  **Update `TemplateEditor.tsx` to Fetch Template**:
    *   **File:** `components/my-components/journal/TemplateEditor.tsx`
    *   **Purpose:** Load existing journal template on dialog open.
    *   **Implementation Details:**
        *   Import `getJournalTemplate` action.
        *   In `useEffect` (when `isOpen && !initialContentLoaded`):
            *   Inside `fetchTemplate`, call `const fetchedTemplate = await getJournalTemplate();`.
            *   If `fetchedTemplate`, set `setContent(fetchedTemplate.content || []);`.
            *   Update `isLoading` and `initialContentLoaded` states.

6.  **Update `app/journal/page.tsx` to Integrate `TemplateEditor` and Carousel for Journal Cards:**
    *   **File:** `app/journal/page.tsx`
    *   **Purpose:** Allow users to open template editor, refresh template data on save, and display journal cards in a carousel.
    *   **Implementation Details:**
        *   Import `TemplateEditor`.
        *   Add state for `TemplateEditor` visibility (e.g., `isTemplateEditorOpen`).
        *   Add a UI element (e.g., button) to set `isTemplateEditorOpen` to `true`.
        *   Render `<TemplateEditor />` with props: `template`, `isOpen`, `onClose`, and `onTemplateSaved`.
        *   Implement `onTemplateSaved` callback: re-fetch template (`getJournalTemplate()`), update page's `template` state, and close dialog.
        *   Implement a carousel (e.g., using `shadcn/ui` Carousel) to display `JournalCard`s.
        *   The `datesForYear` (or a similar new state, e.g., `datesForCarousel`) logic will need to be adjusted to provide a sequence of dates for the carousel (e.g., all days in the current month, or a sliding window of N days).
        *   The carousel should allow navigation to past/future dates, potentially triggering re-fetching of entries if the date range changes significantly.

**Phase 3: Refinements and Testing**

7.  **User Experience and Robustness:**
    *   Review and implement comprehensive loading states in all relevant components.
    *   Implement user-friendly error messages (e.g., toasts) for failed server actions.
    *   Design and implement UI for empty states (no entries, no template).

8.  **Thorough Testing:**
    *   Manually test all user flows as described in this README.
    *   Test edge cases (e.g., saving empty entry, network errors, concurrent edits if applicable).
    *   Verify responsive design if applicable.
    *   Test the daily journal entry creation (if implemented via a background job).

## Overall Workflow Example (Viewing and Editing an Entry)

1.  **(Background Process)**: A daily task (e.g., Supabase Edge Function) runs and calls `createDailyJournalEntry()`. If no entry exists for the user for today, a blank one (or one based on their template) is created.
2.  User navigates to the journal page (`app/journal/page.tsx`).
3.  `page.tsx` fetches initial data:
    *   `getJournalEntriesByYear()` for the current year.
    *   `getJournalTemplate()` for the user's template.
    *   `getJournalStats()` for activity.
4.  `page.tsx` renders a carousel of `JournalCard` components for a range of dates (e.g., current month). It also renders `JournalActivityChart`.
5.  User interacts with the carousel to find the `JournalCard` for a specific date.
6.  User clicks on a `JournalCard` for a specific date.
7.  `JournalCard` opens `JournalDialog`, passing the `date`, any existing `entry` for that date, the `templateContent`, and the `handleEntrySaved` callback from `page.tsx`.
8.  `JournalDialog` loads content:
    *   Uses the passed `entry.content` if available and for the correct date.
    *   Otherwise, it *should* fetch the entry for that specific `date` using an action like `getJournalEntryByDate(date)`.
    *   If no entry is found, it uses `templateContent`.
9.  User edits the content in the `BlockNoteEditor` within `JournalDialog`.
10.  User clicks "Save" (or closes the dialog with unsaved changes).
11.  `JournalDialog` calls `saveJournalEntry(date, newContent)`.
12.  `saveJournalEntry` action updates/inserts the entry in the database.
13.  `JournalDialog` calls its `onEntrySaved` prop, which is `page.tsx`'s `handleEntrySaved` function.
14.  `page.tsx`'s `handleEntrySaved` function re-fetches journal entries (`getJournalEntriesByYear()`) and stats (`getJournalStats()`) to update the UI with the latest changes.


