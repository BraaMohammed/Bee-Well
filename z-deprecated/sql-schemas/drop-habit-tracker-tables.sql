-- Drop Habit Tracker Tables Script
-- This script safely removes all habit tracker tables in the correct order
-- Run this BEFORE running the new-habit-tracker-schema.sql

-- First, drop all views that depend on the tables
DROP VIEW IF EXISTS daily_entries_with_habits CASCADE;
DROP VIEW IF EXISTS habit_templates_complete CASCADE;

-- Drop all functions that depend on the tables
DROP FUNCTION IF EXISTS get_daily_entries_for_period(UUID, DATE, DATE) CASCADE;
DROP FUNCTION IF EXISTS get_user_habit_template(UUID) CASCADE;

-- Drop all triggers (they will be dropped with tables, but explicit is safer)
DROP TRIGGER IF EXISTS update_daily_habit_entries_updated_at ON daily_habit_entries;
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
DROP TRIGGER IF EXISTS update_habit_categories_updated_at ON habit_categories;
DROP TRIGGER IF EXISTS update_habit_templates_updated_at ON habit_templates;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Drop tables in reverse dependency order (child tables first)
-- This ensures foreign key constraints don't prevent dropping

-- 1. Drop daily_habit_entries (references habits)
DROP TABLE IF EXISTS daily_habit_entries CASCADE;

-- 2. Drop habits (references habit_categories)
DROP TABLE IF EXISTS habits CASCADE;

-- 3. Drop habit_categories (references habit_templates)
DROP TABLE IF EXISTS habit_categories CASCADE;

-- 4. Drop habit_templates (references auth.users, but that's external)
DROP TABLE IF EXISTS habit_templates CASCADE;

-- Confirm cleanup
SELECT 'All habit tracker tables, views, and functions have been dropped successfully.' as message;
