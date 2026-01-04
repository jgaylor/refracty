-- Migration: Add is_favorite column to people table
-- Run this in your Supabase SQL editor

-- Add is_favorite column
ALTER TABLE people 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Create index on is_favorite for efficient filtering
CREATE INDEX IF NOT EXISTS idx_people_is_favorite ON people(is_favorite) WHERE is_favorite = TRUE;

