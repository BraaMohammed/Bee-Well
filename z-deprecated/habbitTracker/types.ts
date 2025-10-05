
//this file isnt being used right now, but it will be used in the future
export interface BaseHabit {
    id: string; // unique identifier for the habit
  name: string;
  importance?: number; // 0-1 scale, defaults to 0.75 , five options 0.5 , 0.625 , 0.75, 0.875, 1
  shouldBeDone?: boolean; // defaults to true
  uiOrder?: number; // optional UI order for the habit
  categoryId?: string; // optional ID for the category this habit belongs to
}

export interface BooleanTrackedHabit extends BaseHabit {
  type: "booleanTracking"; // was "checkList"
}

export interface NumericTrackedHabit extends BaseHabit {
  type: "numericTracking"; // was "numberInput"
  target?: number; // target value for the habit
}

export interface JournalEntryHabit extends BaseHabit { //ignore this for now 
  type: "journalEntry"; // was "textArea"
}

export interface MultipleChoiceHabit extends BaseHabit {
  type: "multipleChoice"; // was "select"
  options: string[];
  target?: string; // best/target option
}

export type Habit = BooleanTrackedHabit | NumericTrackedHabit | JournalEntryHabit | MultipleChoiceHabit;

export interface HabitCategory {
    id?: string; // optional ID for the category
  categoryName: string;
habits: Habit[]; // array of habits in this category 
uiOrder?: number; // optional UI order for the category
}

export interface TrackedHabits {
  _id?: string;
  categories: HabitCategory[];
}

// Daily entry types for tracking user inputs
export interface DailyEntryElement {
  elementIndex: number;
  elementType: "booleanTracking" | "numericTracking" | "journalEntry" | "multipleChoice";
  userInput: boolean | string | number;
  elementText: string;
  target?: string | number;
}

export interface DailyEntryCategory {
  categoryIndex: number;
  categoryName: string;
  elements: DailyEntryElement[];
}

export type DailyEntry = DailyEntryCategory[];

// Editable elements state type
export interface EditableElements {
  [key: string]: boolean; // key format: "categoryIndex-elementIndex" or "categoryIndex-category"
}

// New element addition type
export interface NewHabit {
  type?: "booleanTracking" | "numericTracking" | "journalEntry" | "multipleChoice";
  id: string;
    name: string;
    importance?: number; // 0-1 scale, defaults to 0.75
    shouldBeDone?: boolean; // defaults to true
    uiOrder?: number; // optional UI order for the habit
  options?: string[]; // for multipleChoice habits
    target?: string | number; // for numericTracking and multipleChoice habits
    
}

