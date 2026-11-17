'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Member { id: string; role: string; user: { id: string; name: string; email: string; image?: string }; }
interface Team { id: string; name: string; description?: string; members: Member[]; }

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetch('/api/teams').then((r) => r.json()).then(setTeams).finally(() => setLoading(false));
  }, []);

  const create = async () => {
    if (!form.name.trim()) return;
    const res = await fetch('/api/teams', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) {
      const newTeam = await res.json();
      setTeams((p) => [...p, newTeam]);
      setForm({ name: '', description: '' });
      setShowNew(false);
      toast.success('Equipe criada!');
    } else { toast.error('Erro ao criar equipe'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipes</h1>
        <button onClick={() => setShowNew(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-purple-700">+ Nova Equipe</button>
      </div>

      {showNew && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <h3 className="font-semibold mb-4">Nova Equipe</h3>
          <div className="space-y-3">
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nome da equipe *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Descrição (opcional)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={create} className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">Criar</button>
            <button onClick={() => setShowNew(false)} className="text-gray-500 px-4 py-2 text-sm">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="font-semibold mb-1">{team.name}</div>
            {team.description && <p className="text-sm text-gray-500 mb-3">{team.description}</p>}
            <div className="flex -space-x-2">
              {team.members.slice(0, 5).map((m) => (
                m.user.image
                  ? <img key={m.id} src={m.user.image} alt={m.user.name} className="w-7 h-7 rounded-full border-2 border-white" title={`${m.user.name} (${m.role})`} />
                  : <div key={m.id} className="w-7 h-7 rounded-full border-2 border-white bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700" title={`${m.user.name} (${m.role})`}>{m.user.name[0]}</div>
              ))}
              {team.members.length > 5 && <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500">+{team.members.length - 5}</div>}
            </div>
            <div className="mt-3 text-xs text-gray-400">{team.members.length} membro{team.members.length !== 1 ? 's' : ''}</div>
          </div>
        ))}
        {teams.length === 0 && <p className="text-gray-400 text-sm col-span-2">Nenhuma equipe ainda. Crie a primeira!</p>}
      </div>
    </div>
  );
}
