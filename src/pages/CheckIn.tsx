import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Slider } from '../components/Slider';
import { TaskList } from '../components/TaskList';
import { useApp } from '../context/AppContext';
import { supabase, getTodayString } from '../lib/supabaseClient';
import { CATEGORIES } from '../types';

export const CheckIn = () => {
  const navigate = useNavigate();
  const { user, tasks } = useApp();
  const [sleepQuality, setSleepQuality] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [notes, setNotes] = useState('');
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  useEffect(() => {
    checkTodayCheckIn();
  }, [user]);

  const checkTodayCheckIn = async () => {
    if (!user) return;

    const today = getTodayString();
    const { data } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    if (data) {
      setHasCheckedIn(true);
      setSleepQuality(data.sleep_quality);
      setEnergyLevel(data.energy_level);
      setNotes(data.notes || '');
    }
  };

  const saveCheckIn = async () => {
    if (!user) return;

    const today = getTodayString();
    
    if (hasCheckedIn) {
      await supabase
        .from('daily_checkins')
        .update({
          sleep_quality: sleepQuality,
          energy_level: energyLevel,
          notes: notes || null,
        })
        .eq('user_id', user.id)
        .eq('date', today);
    } else {
      await supabase
        .from('daily_checkins')
        .insert([
          {
            user_id: user.id,
            date: today,
            sleep_quality: sleepQuality,
            energy_level: energyLevel,
            notes: notes || null,
          },
        ]);
      setHasCheckedIn(true);
    }
  };

  const handleSpinTheDay = async () => {
    await saveCheckIn();
    navigate('/spin');
  };

  const userName = user?.user_metadata?.name || 'Friend';
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header Bar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-20 bg-bg-secondary flex items-center px-20 justify-between"
        style={{
          background: 'linear-gradient(to bottom, #1E1E1E, #232323)',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-semibold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-semibold">
          Good morning, {userName}
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-text-secondary">{currentDate}</div>
          <button
            onClick={() => navigate('/completed')}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Completed
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-20 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Pane - Mood Panel (35%) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-5"
          >
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Daily Check-In</h2>

              <div className="space-y-8">
                <Slider
                  label="How did you sleep?"
                  min={1}
                  max={5}
                  value={sleepQuality}
                  onChange={setSleepQuality}
                  minLabel="😴"
                  maxLabel="😌"
                />

                <Slider
                  label="Energy level?"
                  min={1}
                  max={5}
                  value={energyLevel}
                  onChange={setEnergyLevel}
                  minLabel="☕"
                  maxLabel="⚡"
                />

                <div>
                  <label htmlFor="intentions" className="block text-sm font-medium mb-2">
                    Notes / Intentions for Today
                  </label>
                  <textarea
                    id="intentions"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="What's on your mind today?"
                    className="input-field w-full h-32 resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Pane - Task Lists (65%) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-7"
          >
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {CATEGORIES.map((category) => (
                <TaskList
                  key={category.name}
                  category={category.name}
                  tasks={tasks}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Action Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={handleSpinTheDay}
            className="px-16 py-5 rounded-[20px] text-xl font-semibold btn-glow transition-all duration-150"
            style={{
              background: 'linear-gradient(135deg, #444 0%, #666 100%)',
            }}
          >
            SPIN THE DAY
          </button>
        </motion.div>
      </div>
    </div>
  );
};

