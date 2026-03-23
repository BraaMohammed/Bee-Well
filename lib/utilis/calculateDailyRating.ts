import { dayEntry, habitTemplateType, habitEntry as habitEntryType, habitsCategoryType, CheckboxHabitType, SelectHabitType, NumberHabitType, TextAreaHabitType } from "@/types/new-habit-tracker";

export const calculateDailyRating = (dayEntry: dayEntry, habitTemplate: habitTemplateType): number => {
    let totalImportance = 0;
    let weightedSuccess = 0;

    if (!habitTemplate || !Array.isArray(habitTemplate.categories)) {
        return 0;
    }

    // Build a map of entries for quick lookup
    const entryMap = new Map<string, habitEntryType>();
    if (dayEntry?.habits) {
        for (const entry of dayEntry.habits) {
            entryMap.set(entry.habitId, entry);
        }
    }

    // Iterate over ALL template habits (not just ones with entries)
    const allHabits = habitTemplate.categories.flatMap(category => category.categoryHabits);
    
    for (const habit of allHabits) {
        totalImportance += habit.importance;
        
        const entry = entryMap.get(habit.id);
        
        // If no entry for this habit, it contributes 0 to weightedSuccess
        if (!entry) continue;

        switch (habit.habitType) {
            case 'checkbox':
                if (entry.value === true) {
                    weightedSuccess += habit.importance;
                }
                break;
            case 'select':
                if (entry.value === (habit as SelectHabitType).bestOption) {
                    weightedSuccess += habit.importance;
                }
                break;
            case 'number':
                const target = (habit as NumberHabitType).targetValue;
                const value = Number(entry.value);
                if (target !== undefined && !isNaN(value) && target > 0) {
                    const ratio = Math.min(value / target, 1);
                    weightedSuccess += ratio * habit.importance;
                }
                break;
        }
    }

    if (totalImportance === 0) {
        return 0;
    }

    return (weightedSuccess / totalImportance) * 100;
}
