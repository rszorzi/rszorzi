'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Board { id: string; name: string; description?: string; color: string; columns: { _count?: { tasks: number }; tasks?: unknown[] }[]; updatedAt: string; }

export default function BoardsPage() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', color: '#7C3AED' });

  useEffect(() => {
    fetch('/api/boards').then((r) => r.json()).then(setBoards).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    const res = await fetch('/api/boards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const board = await res.json();
      setBoards((p) => [board, ...p]);
      setForm({ name: '', description: '', color: '#7C3AED' });
      setShowNew(false);
      toast.success('Quadro criado!');
    } else { toast.error('Erro ao criar quadro'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Quadros</h1>
          <p className="text-gray-500 text-sm mt-1">{boards.length} quadro{boards.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-colors">+ Novo Quadro</button>
      </div>

      {showNew && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold mb-4">Novo Quadro</h3>
          <div className="space-y-3">
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nome do quadro *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Descrição (opcional)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Cor:</label>
              <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={create} className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">Criar</button>
            <button onClick={() => setShowNew(false)} className="text-gray-500 px-4 py-2 text-sm hover:text-gray-700">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => {
          const tasks = board.columns.reduce((s, c) => s + (c._count?.tasks ?? c.tasks?.length ?? 0), 0);
          return (
            <Link key={board.id} href={`/boards/${board.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
              <div className="w-10 h-10 rounded-xl mb-4" style={{ background: board.color }} />
              <div className="font-semibold mb-1">{board.name}</div>
              {board.description && <p className="text-sm text-gray-500 mb-3 line-clamp-2">{board.description}</p>}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>📋 {tasks} tarefas · {board.columns.length} colunas</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
