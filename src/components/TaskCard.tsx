import { motion } from 'framer-motion';
import { Task, CATEGORIES } from '../types';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
  delay?: number;
}

export const TaskCard = ({ task, delay = 0 }: TaskCardProps) => {
  const navigate = useNavigate();
  const categoryConfig = CATEGORIES.find((c) => c.name === task.category);

  const handleClick = () => {
    navigate(`/focus/${task.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className="relative rounded-xl p-6 cursor-pointer transition-shadow duration-200"
      style={{
        backgroundColor: '#252525',
        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 0, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div
        className="absolute top-3 right-3 text-[10px] uppercase font-semibold px-2 py-1 rounded"
        style={{
          backgroundColor: categoryConfig?.color + '33',
          color: categoryConfig?.color,
        }}
      >
        {categoryConfig?.label}
      </div>
      <div className="pr-16">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{task.title}</h3>
        {task.notes && (
          <p className="text-sm text-text-secondary line-clamp-2">{task.notes}</p>
        )}
      </div>
      <div
        className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
        style={{ backgroundColor: categoryConfig?.color }}
      />
    </motion.div>
  );
};

