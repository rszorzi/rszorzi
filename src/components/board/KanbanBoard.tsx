'use client';
import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Column from './Column';
import TaskCard from './TaskCard';
import toast from 'react-hot-toast';

interface Task {
  id: string; title: string; description?: string; priority: string;
  storyPoints: number; tags: string[]; dueDate?: string; order: number;
  assignee?: { id: string; name: string; image?: string };
}
interface Col { id: string; name: string; color: string; order: number; tasks: Task[]; }
interface Board { id: string; name: string; color: string; columns: Col[]; }

export default function KanbanBoard({ board: initialBoard }: { board: Board }) {
  const [board, setBoard] = useState(initialBoard);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showAddCol, setShowAddCol] = useState(false);
  const [newColName, setNewColName] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const findTaskAndCol = useCallback((taskId: string) => {
    for (const col of board.columns) {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) return { task, col };
    }
    return null;
  }, [board]);

  const handleDragStart = (event: DragStartEvent) => {
    const found = findTaskAndCol(event.active.id as string);
    if (found) setActiveTask(found.task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeFound = findTaskAndCol(activeId);
    if (!activeFound) return;
    const overCol = board.columns.find((c) => c.id === overId) ||
      board.columns.find((c) => c.tasks.some((t) => t.id === overId));
    if (!overCol || overCol.id === activeFound.col.id) return;
    setBoard((prev) => {
      const cols = prev.columns.map((c) => {
        if (c.id === activeFound.col.id) return { ...c, tasks: c.tasks.filter((t) => t.id !== activeId) };
        if (c.id === overCol.id) return { ...c, tasks: [...c.tasks, activeFound.task] };
        return c;
      });
      return { ...prev, columns: cols };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const found = findTaskAndCol(activeId);
    if (!found) return;
    const overCol = board.columns.find((c) => c.id === overId) ||
      board.columns.find((c) => c.tasks.some((t) => t.id === overId));
    if (!overCol) return;
    let newOrder = found.task.order;
    let newTasks = overCol.tasks;
    if (found.col.id === overCol.id) {
      const oldIdx = overCol.tasks.findIndex((t) => t.id === activeId);
      const newIdx = overCol.tasks.findIndex((t) => t.id === overId);
      if (oldIdx !== newIdx && newIdx !== -1) newTasks = arrayMove(overCol.tasks, oldIdx, newIdx);
      newOrder = newTasks.findIndex((t) => t.id === activeId);
    } else {
      newOrder = newTasks.length - 1;
    }
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeId, columnId: overCol.id, order: newOrder }),
      });
    } catch { toast.error('Erro ao mover tarefa'); }
  };

  const addColumn = async () => {
    if (!newColName.trim()) return;
    try {
      const res = await fetch('/api/columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newColName, boardId: board.id, color: '#6B7280', order: board.columns.length }),
      });
      if (res.ok) {
        const col = await res.json();
        setBoard((prev) => ({ ...prev, columns: [...prev.columns, { ...col, tasks: [] }] }));
        setNewColName('');
        setShowAddCol(false);
        toast.success('Coluna criada!');
      }
    } catch { toast.error('Erro ao criar coluna'); }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 overflow-x-auto min-h-screen">
        <SortableContext items={board.columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
          {board.columns.map((col) => (
            <Column key={col.id} column={col} boardId={board.id}
              onTaskAdded={(task) => setBoard((prev) => ({ ...prev, columns: prev.columns.map((c) => c.id === col.id ? { ...c, tasks: [...c.tasks, task] } : c) }))}
            />
          ))}
        </SortableContext>
        {showAddCol ? (
          <div className="w-72 shrink-0 bg-white border border-gray-200 rounded-xl p-3 shadow-sm h-fit">
            <input autoFocus className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nome da coluna" value={newColName} onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addColumn(); if (e.key === 'Escape') setShowAddCol(false); }}
            />
            <div className="flex gap-2">
              <button onClick={addColumn} className="flex-1 bg-purple-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-purple-700">Adicionar</button>
              <button onClick={() => setShowAddCol(false)} className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm">✕</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddCol(true)}
            className="w-72 shrink-0 border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-all h-fit flex items-center justify-center gap-2">
            <span className="text-xl">+</span> Nova Coluna
          </button>
        )}
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
    </DndContext>
  );
}
