import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../types';

export const CompletedTasks = () => {
  const navigate = useNavigate();
  const { tasks } = useApp();

  const completedTasks = tasks.filter((t) => t.completed);
  const today = new Date().toISOString().split('T')[0];
  const completedToday = completedTasks.filter((t) => 
    t.completed_at?.startsWith(today)
  );

  const groupByDate = (tasks: typeof completedTasks) => {
    const groups: Record<string, typeof completedTasks> = {};
    tasks.forEach((task) => {
      const date = task.completed_at?.split('T')[0] || 'Unknown';
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
    });
    return groups;
  };

  const groupedTasks = groupByDate(completedTasks);
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateString: string) => {
    if (dateString === 'Unknown') return 'Unknown';
    if (dateString === today) return 'Today';
    
    const date = new Date(dateString + 'T00:00:00');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-20 bg-bg-secondary flex items-center px-20 justify-between"
        style={{
          background: 'linear-gradient(to bottom, #1E1E1E, #232323)',
          boxShadow: 'inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <span>←</span>
          <span>Back to Check-In</span>
        </button>
        <h1 className="text-2xl font-semibold">Completed Tasks</h1>
        <div className="w-32" /> {/* Spacer for centering */}
      </motion.header>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-20 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-6 mb-12"
        >
          <div className="card text-center">
            <div className="text-4xl font-bold text-text-primary mb-2">
              {completedToday.length}
            </div>
            <div className="text-text-secondary">Today</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-text-primary mb-2">
              {completedTasks.length}
            </div>
            <div className="text-text-secondary">Total</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-urgent mb-2">
              {completedTasks.filter((t) => t.category === 'urgent').length}
            </div>
            <div className="text-text-secondary">Urgent</div>
          </div>
          <div className="card text-center">
            <div className="text-4xl font-bold text-important mb-2">
              {completedTasks.filter((t) => t.category === 'important').length}
            </div>
            <div className="text-text-secondary">Important</div>
          </div>
        </motion.div>

        {/* Task List by Date */}
        {completedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold mb-2">No completed tasks yet</h2>
            <p className="text-text-secondary mb-6">
              Start completing tasks to see them here!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-medium transition-colors"
            >
              Go to Check-In
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {sortedDates.map((date, index) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-xl font-semibold mb-4 text-text-primary">
                  {formatDate(date)}
                </h2>
                <div className="space-y-3">
                  {groupedTasks[date].map((task) => {
                    const categoryConfig = CATEGORIES.find((c) => c.name === task.category);
                    return (
                      <div
                        key={task.id}
                        className="bg-bg-card rounded-lg p-4 flex items-center gap-4"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: categoryConfig?.color }}
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary">{task.title}</h3>
                          {task.notes && (
                            <p className="text-sm text-text-secondary mt-1">{task.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-text-secondary">
                          <span
                            className="px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: categoryConfig?.color + '22',
                              color: categoryConfig?.color,
                            }}
                          >
                            {categoryConfig?.label}
                          </span>
                          <span>
                            {task.completed_at
                              ? new Date(task.completed_at).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

