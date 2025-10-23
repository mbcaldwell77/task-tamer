import { useState } from 'react';
import type { Task, TaskCategory } from '../types';
import { CATEGORIES } from '../types';
import { AddTaskModal } from './AddTaskModal';

interface TaskListProps {
  category: TaskCategory;
  tasks: Task[];
}

export const TaskList = ({ category, tasks }: TaskListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryConfig = CATEGORIES.find((c) => c.name === category);

  const categoryTasks = tasks.filter((t) => t.category === category && !t.completed);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-4 bg-bg-card rounded-lg p-4">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: categoryConfig?.color }}
        />
        <span className="font-semibold text-lg flex-shrink-0">{categoryConfig?.label}</span>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium transition-colors"
        >
          + Add
        </button>
        <div className="flex-1 flex gap-2 overflow-x-auto">
          {categoryTasks.map((task) => (
            <div
              key={task.id}
              className="px-3 py-1 rounded-full text-sm whitespace-nowrap"
              style={{
                backgroundColor: categoryConfig?.color + '22',
                color: categoryConfig?.color,
              }}
            >
              {task.title}
            </div>
          ))}
        </div>
      </div>
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={category}
      />
    </div>
  );
};

