import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Task, TaskCategory } from '../types';
import { useApp } from '../context/AppContext';

export const useTasks = () => {
  const { user, refreshTasks } = useApp();
  const [loading, setLoading] = useState(false);

  const addTask = async (title: string, category: TaskCategory, notes?: string) => {
    if (!user) return null;

    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: user.id,
          title,
          category,
          notes: notes || null,
          completed: false,
        },
      ])
      .select()
      .single();

    setLoading(false);
    if (!error) {
      await refreshTasks();
      return data;
    }
    return null;
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .eq('id', taskId);

    setLoading(false);
    if (!error) {
      await refreshTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    setLoading(false);
    if (!error) {
      await refreshTasks();
    }
  };

  return { addTask, completeTask, deleteTask, loading };
};

