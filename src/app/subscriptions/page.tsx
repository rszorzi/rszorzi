'use client';
import { useSession } from 'next-auth/react';
import { FEATURES, SUBSCRIPTION_PLANS } from '@/lib/features';

const FEATURE_SUBSCRIPTIONS = process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS === 'true';

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const currentPlan = (session?.user as any)?.subscriptionPlan || 'FREE';

  if (!FEATURE_SUBSCRIPTIONS) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 text-center">
        <div className="text-4xl mb-3">💳</div>
        <h2 className="font-semibold text-lg mb-2">Planos em breve</h2>
        <p className="text-gray-500 text-sm">O sistema de assinaturas será habilitado em breve.</p>
      </div>
    );
  }

  const plans = Object.entries(SUBSCRIPTION_PLANS);

  return (
    <div className="p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Planos KanFlow</h1>
        <p className="text-gray-500">Escolha o plano ideal para sua equipe</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {plans.map(([key, plan]) => {
          const isCurrent = currentPlan === key;
          return (
            <div key={key} className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${
              key === 'PRO' ? 'border-purple-400 shadow-purple-100 shadow-lg' : 'border-gray-200'
            }`}>
              {key === 'PRO' && <div className="text-center text-xs font-bold text-purple-600 bg-purple-50 rounded-full px-3 py-1 mb-4 w-fit mx-auto">🔥 Mais popular</div>}
              <div className="font-bold text-xl mb-1">{plan.name}</div>
              <div className="text-3xl font-bold mb-1">{plan.prices.BRL}<span className="text-sm font-normal text-gray-500">/mês</span></div>
              <ul className="mt-4 space-y-2 mb-6">
                {plan.features.pt.map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>{f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="w-full text-center py-2.5 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium">Plano atual</div>
              ) : (
                <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  key === 'PRO' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border border-gray-300 text-gray-700 hover:border-purple-400'
                }`}>Escolher {plan.name}</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
