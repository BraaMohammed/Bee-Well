import { dayEntry, habitTemplateType, habitEntry as habitEntryType, habitsCategoryType, CheckboxHabitType, SelectHabitType, NumberHabitType, TextAreaHabitType } from "@/types/new-habit-tracker";

export const calculateDailyRating = (dayEntry: dayEntry, habitTemplate: habitTemplateType): number => {
    let totalImportance = 0;
    let weightedSuccess = 0;

    if (!dayEntry || !habitTemplate || !dayEntry.habits) {
        return 0;
    }

    if (Array.isArray(habitTemplate.categories)) {
        const allHabits = habitTemplate.categories.flatMap(category => category.categoryHabits);
    
    for (const habit of allHabits) {
        const entry = dayEntry.habits.find(e => e.habitId === habit.id);
        if (!entry) continue;

        totalImportance += habit.importance;

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
                if (target !== undefined && !isNaN(value)) {
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
}else{
    return 0;
}
}
