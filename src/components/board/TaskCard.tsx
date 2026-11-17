'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string; title: string; description?: string; priority: string;
  storyPoints: number; tags: string[]; dueDate?: string; order: number;
  assignee?: { id: string; name: string; image?: string };
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
};

export default function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`bg-white border border-gray-200 rounded-lg p-3 cursor-grab shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50 shadow-lg rotate-2' : ''
      }`}>
      <div className="flex items-start gap-2 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
          {task.priority}
        </span>
        {task.storyPoints > 0 && (
          <span className="text-xs text-gray-400 ml-auto shrink-0">{task.storyPoints}sp</span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{task.title}</p>
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map((tag) => (
            <span key={tag} className="text-xs bg-purple-50 text-purple-600 rounded px-1.5 py-0.5">{tag}</span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        {task.dueDate && (
          <span className="text-xs text-gray-400">📅 {new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        )}
        {task.assignee && (
          <div className="ml-auto flex items-center gap-1">
            {task.assignee.image ? (
              <img src={task.assignee.image} alt={task.assignee.name} className="w-5 h-5 rounded-full" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">
                {task.assignee.name[0]}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
