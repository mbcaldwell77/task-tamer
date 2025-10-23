import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCategory, CATEGORIES } from '../types';
import { useTasks } from '../hooks/useTasks';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: TaskCategory;
}

export const AddTaskModal = ({ isOpen, onClose, category }: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const { addTask, loading } = useTasks();

  const categoryConfig = CATEGORIES.find((c) => c.name === category);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask(title, category, notes || undefined);
    setTitle('');
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-bg-card rounded-2xl p-8 w-[500px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6">
              Add {categoryConfig?.label} Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="task-title" className="block text-sm font-medium mb-2">
                  Task Title
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="input-field w-full"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="task-notes" className="block text-sm font-medium mb-2">
                  Notes (optional)
                </label>
                <textarea
                  id="task-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional context..."
                  className="input-field w-full h-32 resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 rounded-lg font-semibold text-text-secondary hover:text-text-primary transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg font-semibold transition-all duration-150"
                  style={{
                    backgroundColor: categoryConfig?.color,
                    color: '#fff',
                  }}
                  disabled={loading || !title.trim()}
                >
                  {loading ? 'Adding...' : 'Save Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

