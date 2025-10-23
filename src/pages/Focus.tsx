import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { useApp } from '../context/AppContext';
import { useTasks } from '../hooks/useTasks';
import { CATEGORIES } from '../types';
import { supabase } from '../lib/supabaseClient';

const MOTIVATIONAL_QUOTES = [
  'One task at a time.',
  'Progress, not perfection.',
  'You got this.',
  'Focus brings clarity.',
  'Small steps, big results.',
];

export const Focus = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { tasks, user, tasksCompletedToday } = useApp();
  const { completeTask } = useTasks();
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [howItWent, setHowItWent] = useState('');
  const [sessionStartTime] = useState(new Date().toISOString());
  const [quote] = useState(
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  );

  const task = tasks.find((t) => t.id === taskId);
  const categoryConfig = task ? CATEGORIES.find((c) => c.name === task.category) : null;

  useEffect(() => {
    if (!task) {
      navigate('/');
    }
  }, [task, navigate]);

  if (!task || !categoryConfig) {
    return null;
  }

  const handleTimerComplete = () => {
    setShowCompletionModal(true);
  };

  const handleSaveAndContinue = async () => {
    if (!user || !taskId) return;

    // Save focus session
    await supabase.from('focus_sessions').insert([
      {
        user_id: user.id,
        task_id: taskId,
        duration_minutes: 25,
        how_it_went: howItWent || null,
        started_at: sessionStartTime,
        completed_at: new Date().toISOString(),
      },
    ]);

    // Mark task as completed
    await completeTask(taskId);

    // Navigate back to spin screen
    navigate('/spin');
  };

  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center px-4">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
      >
        <span>←</span>
        <span>All tasks</span>
      </motion.button>

      <div className="max-w-[600px] w-full">
        {/* Task Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-semibold mb-4">{task.title}</h1>
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: categoryConfig.color + '33',
              color: categoryConfig.color,
            }}
          >
            {categoryConfig.label}
          </div>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PomodoroTimer
            onComplete={handleTimerComplete}
            categoryColor={categoryConfig.color}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center space-y-2"
        >
          <p className="text-text-secondary">
            Tasks done today: <span className="font-semibold">{tasksCompletedToday}</span>
          </p>
          <p className="text-sm text-gray-600 italic">{quote}</p>
        </motion.div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-bg-card rounded-2xl p-8 w-[500px] max-w-[90vw]"
            >
              {/* Checkmark Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: categoryConfig.color }}
              >
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <motion.path d="M5 13l4 4L19 7" />
                </motion.svg>
              </motion.div>

              <h2 className="text-2xl font-semibold mb-6 text-center">Great work!</h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="how-it-went" className="block text-sm font-medium mb-2">
                    How'd it go?
                  </label>
                  <textarea
                    id="how-it-went"
                    value={howItWent}
                    onChange={(e) => setHowItWent(e.target.value)}
                    placeholder="Any thoughts or reflections?"
                    className="input-field w-full h-24 resize-none"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleSaveAndContinue}
                  className="w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-150"
                  style={{
                    backgroundColor: categoryConfig.color,
                    color: '#fff',
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

