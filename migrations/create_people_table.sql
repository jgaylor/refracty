-- Migration: Create people table
-- Run this in your Supabase SQL editor

-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  vibe_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_people_user_id ON people(user_id);

-- Enable Row Level Security
ALTER TABLE people ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own people
CREATE POLICY "Users can view their own people"
  ON people
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can INSERT their own people
CREATE POLICY "Users can insert their own people"
  ON people
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE their own people
CREATE POLICY "Users can update their own people"
  ON people
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE their own people
CREATE POLICY "Users can delete their own people"
  ON people
  FOR DELETE
  USING (auth.uid() = user_id);

