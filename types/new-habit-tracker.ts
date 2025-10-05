export type CheckboxHabitType = {
    id: string
    name: string
    description: string
    importance:  0.5 | 0.625 | 0.75 | 0.875 | 1
    shouldBeDone?: boolean
    habitType: 'checkbox'
}

export type SelectHabitType = {
    id: string
    name: string
    description: string
    importance:  0.5 | 0.625 | 0.75 | 0.875 | 1
    bestOption?: string
    habitType: 'select'
    options: string[]
}

export type NumberHabitType = {
    id: string
    name: string
    description: string
    importance:  0.5 | 0.625 | 0.75 | 0.875 | 1
    habitType: 'number'
    targetValue?: number
}

export type TextAreaHabitType = {
    id: string
    name: string
    description: string
    importance:  0.5 | 0.625 | 0.75 | 0.875 | 1
    habitType: 'textArea'
}

export type habitsCategoryType = {
    id: string;
    name: string;
    description: string;
    categoryHabits: Array<CheckboxHabitType | SelectHabitType | NumberHabitType | TextAreaHabitType>;
}

export type habitTemplateType = { 
 id: string;
 userId: string;
 categories: habitsCategoryType[];
}


export type habitEntry = {
    id: string
    habitId: string
    date: string // ISO date string (YYYY-MM-DD)
    value: boolean | string | number | null
    createdAt?: string
    updatedAt?: string
}

export type dayEntry = {
    id: string
    date: string // ISO date string (YYYY-MM-DD)  
    userId: string
    habits: habitEntry[]
    createdAt?: string
    updatedAt?: string
}