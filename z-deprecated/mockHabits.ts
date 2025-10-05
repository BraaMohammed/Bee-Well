import { 
  CheckboxHabitType, 
  SelectHabitType, 
  NumberHabitType, 
  TextAreaHabitType, 
  habitsCategoryType, 
  habitTemplateType 
} from '@/types/new-habit-tracker'

// Mock Checkbox Habits
const mockCheckboxHabits: CheckboxHabitType[] = [
  {
    id: 'cb-1',
    name: 'Morning Exercise',
    description: 'Do 30 minutes of exercise in the morning',
    importance: 0.875,
    shouldBeDone: true,
    habitType: 'checkbox'
  },
  {
    id: 'cb-2',
    name: 'Read for 20 minutes',
    description: 'Read a book for personal development',
    importance: 0.75,
    shouldBeDone: true,
    habitType: 'checkbox'
  },
  {
    id: 'cb-3',
    name: 'Avoid Social Media Before Bed',
    description: 'No social media 1 hour before sleep',
    importance: 0.625,
    shouldBeDone: false,
    habitType: 'checkbox'
  }
]

// Mock Select Habits
const mockSelectHabits: SelectHabitType[] = [
  {
    id: 'sel-1',
    name: 'Mood Check',
    description: 'How are you feeling today?',
    importance: 0.75,
    habitType: 'select',
    options: ['Excellent', 'Good', 'Okay', 'Bad', 'Terrible'],
    bestOption: 'Excellent'
  },
  {
    id: 'sel-2',
    name: 'Energy Level',
    description: 'Rate your energy level',
    importance: 0.5,
    habitType: 'select',
    options: ['Very High', 'High', 'Medium', 'Low', 'Very Low'],
    bestOption: 'High'
  }
]

// Mock Number Habits
const mockNumberHabits: NumberHabitType[] = [
  {
    id: 'num-1',
    name: 'Water Intake',
    description: 'How many glasses of water did you drink?',
    importance: 0.875,
    habitType: 'number',
    targetValue: 8
  },
  {
    id: 'num-2',
    name: 'Hours of Sleep',
    description: 'How many hours did you sleep?',
    importance: 1,
    habitType: 'number',
    targetValue: 8
  },
  {
    id: 'num-3',
    name: 'Steps Walked',
    description: 'How many steps did you walk today?',
    importance: 0.75,
    habitType: 'number',
    targetValue: 10000
  }
]

// Mock TextArea Habits
const mockTextAreaHabits: TextAreaHabitType[] = [
  {
    id: 'ta-1',
    name: 'Daily Reflection',
    description: 'Write about your day and thoughts',
    importance: 0.625,
    habitType: 'textArea'
  },
  {
    id: 'ta-2',
    name: 'Gratitude Journal',
    description: 'Write 3 things you are grateful for',
    importance: 0.75,
    habitType: 'textArea'
  }
]

// Mock Categories
const mockCategories: habitsCategoryType[] = [
  {
    id: 'cat-1',
    name: 'Health & Fitness',
    description: 'Habits related to physical health and fitness',
    categoryHabits: [
      mockCheckboxHabits[0], // Morning Exercise
      mockNumberHabits[0],   // Water Intake
      mockNumberHabits[1],   // Hours of Sleep
      mockNumberHabits[2]    // Steps Walked
    ]
  },
  {
    id: 'cat-2',
    name: 'Personal Development',
    description: 'Habits for mental growth and learning',
    categoryHabits: [
      mockCheckboxHabits[1], // Read for 20 minutes
      mockTextAreaHabits[0]  // Daily Reflection
    ]
  },
  {
    id: 'cat-3',
    name: 'Mental Wellness',
    description: 'Habits for emotional and mental well-being',
    categoryHabits: [
      mockSelectHabits[0],   // Mood Check
      mockSelectHabits[1],   // Energy Level
      mockTextAreaHabits[1], // Gratitude Journal
      mockCheckboxHabits[2]  // Avoid Social Media
    ]
  }
]

// Mock Habit Template
export const mockHabitTemplate: habitTemplateType = {
  id: 'template-1',
  userId: 'user-123',
  categories: mockCategories
}

// Export individual arrays for flexibility
export {
  mockCheckboxHabits,
  mockSelectHabits,
  mockNumberHabits,
  mockTextAreaHabits,
  mockCategories
}
