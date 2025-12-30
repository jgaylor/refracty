-- Migration: Add appearance column to profiles table
-- Run this in your Supabase SQL editor

-- Add appearance column with default value 'system'
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS appearance TEXT NOT NULL DEFAULT 'system';

-- Add check constraint to ensure only valid values
ALTER TABLE profiles
ADD CONSTRAINT check_appearance 
CHECK (appearance IN ('system', 'light', 'dark'));

-- Update existing rows to have 'system' as default (if any exist without the value)
UPDATE profiles 
SET appearance = 'system' 
WHERE appearance IS NULL;

