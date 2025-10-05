import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  CheckboxHabitType,
  SelectHabitType,
  NumberHabitType,
  TextAreaHabitType,
  habitsCategoryType,
  habitTemplateType
} from '@/types/new-habit-tracker'
import { getHabitTemplate } from '@/actions/getHabitTemplate'
import { parseNestedJSON } from '@/lib/parseNestedJson'
type HabitType = CheckboxHabitType | SelectHabitType | NumberHabitType | TextAreaHabitType

interface HabitStore {
  // State
  habitTemplate: habitTemplateType 
  currentDate: string
  selectedCategoryId: string | null
  isLoading: boolean

  // Actions
  setHabitTemplate: (template: habitTemplateType) => void
  setCurrentDate: (date: string) => void
  setSelectedCategory: (categoryId: string | null) => void
  fetchHabitTemplate:  () => Promise<void>
  // Category Actions
  addCategory: (category: habitsCategoryType) => void
  updateCategory: (categoryId: string, updates: Partial<habitsCategoryType>) => void
  deleteCategory: (categoryId: string) => void

  // Habit Actions
  addHabit: (categoryId: string, habit: HabitType) => void
  updateHabit: (categoryId: string, habitId: string, updates: Partial<HabitType>) => void
  deleteHabit: (categoryId: string, habitId: string) => void

  // Utility Actions
  getHabitById: (habitId: string) => HabitType | null
  getCategoryById: (categoryId: string) => habitsCategoryType | null
  resetToDefaults: () => void
  setLoading: (loading: boolean) => void
}



export const useHabitStore = create<HabitStore>()(
  devtools(
    persist(
      (set, get) => ({
        habitTemplate: { id: '', userId: '', categories: [] }, // Add an initial default value
        fetchHabitTemplate: async () => {
          try {
            const res = await getHabitTemplate();
              console.log("Fetched habit template:", res);
            if(res.success && res.data) {
              const template = parseNestedJSON(res.data);
              console.log('setting habitTemplate' , template)
              set({ habitTemplate: template })
            } else {
              throw new Error("Failed to fetch habit template");
            }
          } catch (error) {
            console.error("Error fetching habit template:", error);
            throw error;
          }
          finally {
            set({ isLoading: false })
          }

        },
        currentDate: new Date().toDateString(),
        selectedCategoryId: null,
        isLoading: false,

        // Basic Setters
        setHabitTemplate: (template) => set({ habitTemplate: template }),
        setCurrentDate: (date) => set({ currentDate: date }),
        setSelectedCategory: (categoryId) => set({ selectedCategoryId: categoryId }),
        setLoading: (loading) => set({ isLoading: loading }),

        // Category Actions
        addCategory: (category) =>
          set((state) => ({
            habitTemplate: {
              ...state.habitTemplate,
              categories: [...state.habitTemplate.categories, category]
            }
          })),

        updateCategory: (categoryId, updates) =>
          set((state) => ({
            habitTemplate: {
              ...state.habitTemplate,
              categories: state.habitTemplate?.categories?.map(category =>
                category.id === categoryId ? { ...category, ...updates } : category
              )
            }
          })),

        deleteCategory: (categoryId) =>
          set((state) => ({
            habitTemplate: {
              ...state.habitTemplate,
              categories: state.habitTemplate?.categories?.filter(category => category.id !== categoryId)
            }
          })),

        // Habit Actions
        addHabit: (categoryId, habit) =>
          set((state) => ({
            habitTemplate: {
              ...state.habitTemplate,
              categories: state.habitTemplate?.categories?.map(category =>
                category.id === categoryId
                  ? { ...category, categoryHabits: [...category.categoryHabits, habit] }
                  : category
              )
            }
          })),

        updateHabit: (categoryId, habitId, updates) =>
          //@ts-ignore
          set((state) => ({
            habitTemplate: {
              ...state.habitTemplate,
              categories: state.habitTemplate?.categories?.map(category =>
                category.id === categoryId
                  ? {
                    ...category,
                    categoryHabits: category.categoryHabits.map(habit =>
                      habit.id === habitId ? { ...habit, ...updates } : habit
                    )
                  }
                  : category
              )
            }
          })),

        deleteHabit: (categoryId, habitId) =>
          set((state) => ({
            habitTemplate: {
              ...state.habitTemplate,
              categories: state.habitTemplate?.categories?.map(category =>
                category.id === categoryId
                  ? {
                    ...category,
                    categoryHabits: category.categoryHabits.filter(habit => habit.id !== habitId)
                  }
                  : category
              )
            }
          })),

        // Utility Functions
        getHabitById: (habitId) => {
          const state = get()
          for (const category of state.habitTemplate.categories) {
            const habit = category.categoryHabits.find(h => h.id === habitId)
            if (habit) return habit
          }
          return null
        },

        getCategoryById: (categoryId) => {
          const state = get()
          return state.habitTemplate?.categories?.find(c => c.id === categoryId) || null
        },

        resetToDefaults: () => set({
          currentDate: new Date().toDateString(),
          selectedCategoryId: null,
          isLoading: false
        })
      }),
      {
        name: 'habit-store', // localStorage key
        partialize: (state) => ({
          habitTemplate: state.habitTemplate,
          currentDate: state.currentDate
        }) // Only persist these fields
      }
    ),
    {
      name: 'habit-store' // DevTools name
    }
  )
)
