'use client';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import toast from 'react-hot-toast';

interface Task {
  id: string; title: string; description?: string; priority: string;
  storyPoints: number; tags: string[]; dueDate?: string; order: number;
  assignee?: { id: string; name: string; image?: string };
}
interface Col { id: string; name: string; color: string; order: number; tasks: Task[]; }

export default function Column({ column, boardId, onTaskAdded }: { column: Col; boardId: string; onTaskAdded: (task: Task) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column.id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, columnId: column.id, priority: 'medium', storyPoints: 1 }),
      });
      if (res.ok) {
        const task = await res.json();
        onTaskAdded(task);
        setNewTitle('');
        setShowAdd(false);
        toast.success('Tarefa criada!');
      }
    } catch { toast.error('Erro ao criar tarefa'); }
  };

  return (
    <div ref={setNodeRef} style={style} className="w-72 shrink-0 bg-gray-50 border border-gray-200 rounded-xl flex flex-col">
      <div className="flex items-center gap-2 p-3 border-b border-gray-200">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-300 hover:text-gray-500 transition-colors p-1">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor">
            <circle cx="2" cy="3" r="1.5"/><circle cx="8" cy="3" r="1.5"/>
            <circle cx="2" cy="9" r="1.5"/><circle cx="8" cy="9" r="1.5"/>
            <circle cx="2" cy="15" r="1.5"/><circle cx="8" cy="15" r="1.5"/>
          </svg>
        </div>
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: column.color }} />
        <span className="font-semibold text-sm flex-1">{column.name}</span>
        <span className="text-xs text-gray-400 bg-gray-200 rounded-full px-2 py-0.5">{column.tasks.length}</span>
      </div>
      <SortableContext items={column.tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-2 flex-1 min-h-[80px]">
          {column.tasks.map((task) => <TaskCard key={task.id} task={task} />)}
        </div>
      </SortableContext>
      {showAdd ? (
        <div className="p-2 border-t border-gray-200">
          <input autoFocus className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Título da tarefa" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setShowAdd(false); }}
          />
          <div className="flex gap-2">
            <button onClick={addTask} className="flex-1 bg-purple-600 text-white rounded-lg py-1.5 text-xs font-medium hover:bg-purple-700">+ Adicionar</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 text-xs px-2">✕</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="m-2 text-sm text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg py-2 transition-colors">+ Adicionar tarefa</button>
      )}
    </div>
  );
}
