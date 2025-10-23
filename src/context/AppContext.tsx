import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Task } from '../types';

interface AppContextType {
  user: User | null;
  tasks: Task[];
  loading: boolean;
  refreshTasks: () => Promise<void>;
  tasksCompletedToday: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      refreshTasks();
    }
  }, [user]);

  const refreshTasks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data);
      
      // Calculate tasks completed today
      const today = new Date().toISOString().split('T')[0];
      const completedToday = data.filter(task => 
        task.completed && task.completed_at?.startsWith(today)
      ).length;
      setTasksCompletedToday(completedToday);
    }
  };

  return (
    <AppContext.Provider value={{ user, tasks, loading, refreshTasks, tasksCompletedToday }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

