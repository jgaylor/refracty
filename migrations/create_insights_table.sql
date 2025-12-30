-- Migration: Create insights table
-- Run this in your Supabase SQL editor

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_category CHECK (category IN ('motivated_by', 'preferred_communication', 'works_best_when', 'collaboration_style', 'feedback_approach'))
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_insights_person_id ON insights(person_id);
CREATE INDEX IF NOT EXISTS idx_insights_user_id ON insights(user_id);
CREATE INDEX IF NOT EXISTS idx_insights_person_category ON insights(person_id, category);

-- Enable Row Level Security
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT insights for their own people
CREATE POLICY "Users can view insights for their own people"
  ON insights
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can INSERT insights for their own people
CREATE POLICY "Users can insert insights for their own people"
  ON insights
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can UPDATE insights for their own people
CREATE POLICY "Users can update insights for their own people"
  ON insights
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can DELETE insights for their own people
CREATE POLICY "Users can delete insights for their own people"
  ON insights
  FOR DELETE
  USING (auth.uid() = user_id);

