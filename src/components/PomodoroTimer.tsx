import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PomodoroTimerProps {
  onComplete: () => void;
  categoryColor: string;
}

export const PomodoroTimer = ({ onComplete, categoryColor }: PomodoroTimerProps) => {
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleDone = () => {
    setIsRunning(false);
    onComplete();
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="relative w-60 h-60">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="120"
            cy="120"
            r="110"
            stroke="#333"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="120"
            cy="120"
            r="110"
            stroke={categoryColor}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '691.15', strokeDashoffset: '691.15' }}
            animate={{
              strokeDashoffset: 691.15 - (691.15 * progress) / 100,
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {!isRunning && timeLeft === duration * 60 && (
        <div className="flex gap-4">
          <button
            onClick={() => setDuration(15)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              duration === 15 ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            15 min
          </button>
          <button
            onClick={() => setDuration(25)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              duration === 25 ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            25 min
          </button>
          <button
            onClick={() => setDuration(45)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              duration === 45 ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            45 min
          </button>
        </div>
      )}

      <div className="flex gap-6">
        <button
          onClick={toggleTimer}
          className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-150"
          style={{
            backgroundColor: categoryColor,
            color: '#fff',
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleDone}
          className="px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-150"
          style={{
            borderColor: categoryColor,
            color: categoryColor,
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

