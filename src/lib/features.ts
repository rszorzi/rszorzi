export const FEATURES = {
  SUBSCRIPTIONS: process.env.NEXT_PUBLIC_FEATURE_SUBSCRIPTIONS === 'true',
  INTEGRATIONS: process.env.NEXT_PUBLIC_FEATURE_INTEGRATIONS !== 'false',
};

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: { pt: 'R$ 0', en: '$0' },
    maxBoards: 3,
    maxMembers: 5,
    features: {
      pt: ['Até 3 quadros', 'Até 5 membros', 'Colunas personalizadas', 'Notificações básicas'],
      en: ['Up to 3 boards', 'Up to 5 members', 'Custom columns', 'Basic notifications'],
    },
  },
  PRO: {
    name: 'Professional',
    price: { pt: 'R$ 49', en: '$19' },
    maxBoards: -1,
    maxMembers: -1,
    features: {
      pt: ['Quadros ilimitados', 'Membros ilimitados', 'Sprints e story points', 'Integrações avançadas', 'Relatórios'],
      en: ['Unlimited boards', 'Unlimited members', 'Sprints & story points', 'Advanced integrations', 'Reports'],
    },
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: { pt: 'R$ 199', en: '$79' },
    maxBoards: -1,
    maxMembers: -1,
    features: {
      pt: ['Tudo do Pro', 'SSO / SAML', 'Auditoria completa', 'SLA garantido', 'On-premise'],
      en: ['Everything in Pro', 'SSO / SAML', 'Full audit log', 'Guaranteed SLA', 'On-premise'],
    },
  },
};
