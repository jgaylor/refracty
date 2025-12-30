-- Migration: Create notes table
-- Run this in your Supabase SQL editor

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_person_id ON notes(person_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT notes for their own people
CREATE POLICY "Users can view notes for their own people"
  ON notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can INSERT notes for their own people
CREATE POLICY "Users can insert notes for their own people"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE notes for their own people
CREATE POLICY "Users can update notes for their own people"
  ON notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE notes for their own people
CREATE POLICY "Users can delete notes for their own people"
  ON notes
  FOR DELETE
  USING (auth.uid() = user_id);

