-- Task Tamer Database Schema
-- Run this in your Supabase SQL Editor

-- Note: auth.users is managed by Supabase and already has RLS enabled
-- We only enable RLS on our own tables below

-- Create daily_checkins table
CREATE TABLE daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  category TEXT CHECK (category IN ('urgent', 'important', 'soon', 'someday')) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create focus_sessions table
CREATE TABLE focus_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  how_it_went TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create daily_spins table
CREATE TABLE daily_spins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  reroll_count INTEGER DEFAULT 0 CHECK (reroll_count <= 3),
  UNIQUE(user_id, date)
);

-- Row Level Security Policies
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_spins ENABLE ROW LEVEL SECURITY;

-- Policies for daily_checkins
CREATE POLICY "Users can view their own check-ins"
  ON daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins"
  ON daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins"
  ON daily_checkins FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for focus_sessions
CREATE POLICY "Users can view their own sessions"
  ON focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policies for daily_spins
CREATE POLICY "Users can view their own spins"
  ON daily_spins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spins"
  ON daily_spins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spins"
  ON daily_spins FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_daily_checkins_user_date ON daily_checkins(user_id, date);
CREATE INDEX idx_daily_spins_user_date ON daily_spins(user_id, date);
CREATE INDEX idx_focus_sessions_user_id ON focus_sessions(user_id);

