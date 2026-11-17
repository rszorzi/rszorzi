'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FEATURE_INTEGRATIONS = process.env.NEXT_PUBLIC_FEATURE_INTEGRATIONS === 'true';

interface Integration { id: string; type: string; enabled: boolean; config: Record<string, string>; }

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!FEATURE_INTEGRATIONS) { setLoading(false); return; }
    fetch('/api/integrations').then((r) => r.ok ? r.json() : []).then(setIntegrations).finally(() => setLoading(false));
  }, []);

  if (!FEATURE_INTEGRATIONS) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="font-semibold text-lg mb-2">Integrações em breve</h2>
        <p className="text-gray-500 text-sm">Esta funcionalidade está sendo preparada e estará disponível em breve.</p>
      </div>
    );
  }

  const webhookIntegration = integrations.find((i) => i.type === 'webhook');

  const saveWebhook = async () => {
    const res = await fetch('/api/integrations', {
      method: webhookIntegration ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'webhook', config: { url: webhookUrl }, enabled: true }),
    });
    if (res.ok) toast.success('Integração salva!');
    else toast.error('Erro ao salvar');
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Integrações</h1>
      <p className="text-gray-500 text-sm mb-6">Conecte o KanFlow com outros sistemas via webhooks.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">🔗</div>
          <div>
            <div className="font-semibold">Webhook</div>
            <div className="text-xs text-gray-500">Receba eventos do KanFlow em qualquer sistema</div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">URL do Webhook</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="https://seu-sistema.com/webhook" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-mono text-gray-600">POST /api/integrations/webhook</div>
            <div className="text-xs text-gray-400 mt-1">Headers: x-kanflow-signature: sha256=HMAC</div>
          </div>
        </div>
        <button onClick={saveWebhook} className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-purple-700">Salvar</button>
      </div>
    </div>
  );
}
