# Journal Page Refactor Plan (to match Habit Tracker UI)

## 1. Alignment and Padding Issues
- Review the main container, card grid, and analytics section for padding, margin, and alignment.
- Match the horizontal and vertical spacing, padding, and alignment to the habit tracker page (see screenshot for reference).
- Ensure consistent use of Tailwind classes for spacing and alignment.

## 2. Skeleton Loading State
- When loading, render the full page layout (header, year picker, analytics section, etc.)
- Replace only the journal entry cards with skeletons (use the same skeleton component as the habit tracker page).
- Analytics section should render with empty or placeholder data, not disappear during loading.

## 3. Analytics Component Horizontal Fill
- The analytics (activity chart) should fill the available horizontal space, just like analytics in the habit tracker page.
- Use flex/grid and responsive width classes to ensure the analytics card stretches to fill the row, with proper border radius and shadow.

## 4. Custom Year Dropdown (Like HabbitPicker)
- Create a new dropdown component for year selection, copying the style and structure from the custom dropdown in `HabbitPicker.jsx`.
- Only show years for which there are journal entries (dynamically build the year list from the loaded entries).
- Replace the shadcn select in the journal page with this new dropdown.

## 5. Activity Chart: Only Count Non-Empty Entries
- Update the logic in the activity chart to only count a day as 'written' if the entry for that day has non-empty content.
- This matches the analytics logic in the habit tracker page.

## 6. BlockNote Editor Error ("initialContent must be a non-empty array of blocks")
- Minimal fix: Ensure that when passing initial content to the BlockNote editor, it is always a non-empty array of blocks.
- If the entry is empty, pass a default minimal block (e.g., a single empty paragraph block) instead of an empty array or undefined.
- Do not refactor or change the editor logic beyond this minimal fix.

---

## Implementation Steps
1. Create the custom year dropdown component (copy from HabbitPicker, adjust for years).
2. Refactor the journal page layout to match the habit tracker (spacing, alignment, analytics fill).
3. Update the loading state to show the full layout with skeleton cards and analytics placeholder.
4. Update the activity chart logic to only count non-empty entries.
5. Patch the BlockNote editor usage to always provide a non-empty array for initial content.

---

## Notes
- Do not change unrelated logic or refactor working code.
- Use the screenshot and habit tracker code as the visual and functional reference for all changes.
- Test with multiple years and empty/non-empty entries to ensure correct dropdown and analytics behavior.
