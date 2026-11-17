'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [locale, setLocaleState] = useState<'pt' | 'en'>((session?.user as any)?.locale || 'pt');

  const saveLocale = async (l: 'pt' | 'en') => {
    setLocaleState(l);
    await fetch('/api/user/locale', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: l }) });
    toast.success(l === 'pt' ? 'Idioma alterado para Português!' : 'Language changed to English!');
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-4">
        <h2 className="font-semibold mb-4">Perfil</h2>
        <div className="flex items-center gap-4">
          {session?.user?.image && <img src={session.user.image} alt="" className="w-16 h-16 rounded-full" />}
          <div>
            <div className="font-medium">{session?.user?.name}</div>
            <div className="text-sm text-gray-500">{session?.user?.email}</div>
            <div className="text-xs text-purple-600 font-medium mt-1">Plano: {(session?.user as any)?.subscriptionPlan || 'FREE'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold mb-4">Idioma</h2>
        <div className="flex gap-3">
          {(['pt', 'en'] as const).map((l) => (
            <button key={l} onClick={() => saveLocale(l)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm border transition-colors ${
                locale === l ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 text-gray-600 hover:border-purple-400'
              }`}>
              {l === 'pt' ? '🇧🇷 Português' : '🇺🇸 English'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
