# Task Tamer

A minimalist task management app designed for desktop that helps you start your day mindfully and stay focused on what matters.

## Features

### Frame 1: Morning Check-In
- Daily mood tracking (sleep quality and energy level)
- Four-category task organization (Urgent, Important, Soon, Someday)
- Quick task entry with optional notes
- Clean, distraction-free interface

### Frame 2: Spin Screen
- Algorithmic task selection from your categories
- Slot machine-style reveal animation
- Limited daily rerolls (max 3) to encourage commitment
- Visual task cards with category indicators

### Frame 3: Focus Screen
- Pomodoro timer with customizable durations (15/25/45 minutes)
- Circular progress visualization
- Session tracking and reflection notes
- Daily progress counter

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth)
- **State**: React Context API

## Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/task-tamer.git
cd task-tamer
npm install
```

### 2. Configure Supabase

1. Create a free account at [Supabase](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key from Settings → API
4. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Schema

Run the following SQL in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

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
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Design System

### Colors
- **Background**: `#1B1B1B` → `#1E1E1E`
- **Text Primary**: `#EDEDED`
- **Text Secondary**: `#999999`
- **Category Colors**:
  - Urgent: `#E57373` (red)
  - Important: `#64B5F6` (blue)
  - Soon: `#81C784` (green)
  - Someday: `#BA68C8` (purple)

### Typography
- **Font**: Manrope (primary), Inter (fallback)
- **Line Height**: 1.4
- **Sizes**: Dynamic scaling from 12px to 48px

### Layout
- **Desktop Optimized**: 1440×1024 viewport
- **Grid**: 12-column with 80px margins
- **Max Width**: 1280px content area

## Project Structure

```
src/
├── components/
│   ├── AddTaskModal.tsx
│   ├── PomodoroTimer.tsx
│   ├── Slider.tsx
│   ├── TaskCard.tsx
│   └── TaskList.tsx
├── context/
│   └── AppContext.tsx
├── hooks/
│   └── useTasks.ts
├── lib/
│   └── supabaseClient.ts
├── pages/
│   ├── CheckIn.tsx
│   ├── Focus.tsx
│   └── Spin.tsx
├── types/
│   └── index.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Authentication

The app uses Supabase Auth with email/password authentication.

### Setup Steps:
1. Go to your Supabase dashboard → Authentication → Providers
2. Enable Email provider
3. For development: Disable "Confirm email" under Authentication → Settings
4. Create your first account through the app's signup page

### Features:
- Sign up with email and password
- Secure authentication with Supabase
- Automatic session management
- Logout functionality

## License

MIT
