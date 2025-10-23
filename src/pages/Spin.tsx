import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types';
import { supabase, getTodayString } from '../lib/supabaseClient';

export const Spin = () => {
  const { user, tasks } = useApp();
  const [spinning, setSpinning] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [rerollCount, setRerollCount] = useState(0);
  const [spinId, setSpinId] = useState<string | null>(null);

  useEffect(() => {
    loadDailySpin();
  }, [user]);

  useEffect(() => {
    if (tasks.length > 0 && selectedTasks.length === 0) {
      performSpin();
    }
  }, [tasks]);

  const loadDailySpin = async () => {
    if (!user) return;

    const today = getTodayString();
    const { data } = await supabase
      .from('daily_spins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data) {
      setSpinId(data.id);
      setRerollCount(data.reroll_count);
    } else {
      const { data: newSpin } = await supabase
        .from('daily_spins')
        .insert([
          {
            user_id: user.id,
            date: today,
            reroll_count: 0,
          },
        ])
        .select()
        .single();
      
      if (newSpin) {
        setSpinId(newSpin.id);
      }
    }
  };

  const performSpin = () => {
    setSpinning(true);

    const incompleteTasks = tasks.filter((t) => !t.completed);
    const urgent = incompleteTasks.filter((t) => t.category === 'urgent');
    const important = incompleteTasks.filter((t) => t.category === 'important');
    const soon = incompleteTasks.filter((t) => t.category === 'soon');
    const someday = incompleteTasks.filter((t) => t.category === 'someday');

    const selected: Task[] = [];

    // Pick 1 from urgent
    if (urgent.length > 0) {
      selected.push(urgent[Math.floor(Math.random() * urgent.length)]);
    }

    // Pick 1 from important
    if (important.length > 0) {
      selected.push(important[Math.floor(Math.random() * important.length)]);
    }

    // Pick 1 from soon or someday
    const soonSomeday = [...soon, ...someday];
    if (soonSomeday.length > 0) {
      selected.push(soonSomeday[Math.floor(Math.random() * soonSomeday.length)]);
    }

    // If we don't have 3 tasks, fill with any remaining tasks
    while (selected.length < 3 && selected.length < incompleteTasks.length) {
      const remaining = incompleteTasks.filter((t) => !selected.includes(t));
      if (remaining.length === 0) break;
      selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
    }

    setTimeout(() => {
      setSelectedTasks(selected);
      setSpinning(false);
    }, 2000);
  };

  const handleReroll = async () => {
    if (rerollCount >= 3 || !spinId) return;

    const newCount = rerollCount + 1;
    setRerollCount(newCount);

    await supabase
      .from('daily_spins')
      .update({ reroll_count: newCount })
      .eq('id', spinId);

    performSpin();
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="max-w-[800px] w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-semibold mb-3">Ready to roll?</h1>
          <p className="text-lg text-text-secondary">
            Let's see what today's deck has for you.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {spinning ? (
            <motion.div
              key="spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-80"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-32 h-32 border-8 border-gray-600 border-t-gray-400 rounded-full"
              />
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center gap-6 mb-8 flex-wrap"
            >
              {selectedTasks.map((task, index) => (
                <div key={task.id} className="w-[220px] h-[160px]">
                  <TaskCard task={task} delay={index * 0.15} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!spinning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <button
              onClick={handleReroll}
              disabled={rerollCount >= 3}
              className={`px-12 py-4 rounded-lg font-semibold border-2 transition-all duration-150 ${
                rerollCount >= 3
                  ? 'border-gray-700 text-gray-600 opacity-50 cursor-not-allowed'
                  : 'border-gray-500 text-text-primary hover:border-gray-400'
              }`}
            >
              Spin again ({3 - rerollCount} left)
            </button>
            <button
              onClick={() => window.history.back()}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Skip for now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

