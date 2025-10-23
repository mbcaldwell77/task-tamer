export type TaskCategory = 'urgent' | 'important' | 'soon' | 'someday';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  notes?: string;
  category: TaskCategory;
  completed: boolean;
  created_at: string;
  completed_at?: string;
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  date: string;
  sleep_quality: number;
  energy_level: number;
  notes?: string;
  created_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  task_id: string;
  duration_minutes: number;
  how_it_went?: string;
  started_at: string;
  completed_at: string;
}

export interface DailySpin {
  id: string;
  user_id: string;
  date: string;
  reroll_count: number;
}

export interface CategoryConfig {
  name: TaskCategory;
  label: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { name: 'urgent', label: 'Urgent', color: '#E57373', bgColor: 'bg-urgent' },
  { name: 'important', label: 'Important', color: '#64B5F6', bgColor: 'bg-important' },
  { name: 'soon', label: 'Soon', color: '#81C784', bgColor: 'bg-soon' },
  { name: 'someday', label: 'Someday', color: '#BA68C8', bgColor: 'bg-someday' },
];

