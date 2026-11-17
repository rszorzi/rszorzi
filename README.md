# KanFlow

Sistema de gerenciamento ágil estilo Jira, construido com Next.js 14, Prisma e NextAuth.

## Funcionalidades

- **Quadros Kanban** com colunas e tarefas arrastaveis (drag-and-drop)
- **Colunas personalizáveis** — crie, renomeie, recolora e reordene
- **Story points, prioridades, tags e prazos** em cada tarefa
- **Equipes** com papéis (Admin / Member / Viewer)
- **Notificações** em tempo real com polling de 30s
- **Integrações via Webhook** com assinatura HMAC-SHA256
- **Login com Google e GitHub** via NextAuth
- **Bilinguismo PT/EN** com troca persistida por usuário
- **Planos de assinatura** (FREE / PRO / ENTERPRISE) via feature flag

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Prisma ORM** + PostgreSQL
- **NextAuth v4** (Google + GitHub OAuth)
- **@dnd-kit** (drag-and-drop)
- **Zustand** + react-hot-toast

## Deploy Rápido

### 1. Supabase (banco de dados)
1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. Em **Settings > Database**, copie a **Connection string (URI)**
3. Substitua `[YOUR-PASSWORD]` pela senha do projeto

### 2. Vercel (hospedagem)
1. Acesse [vercel.com](https://vercel.com) e importe o repositório `rszorzi/rszorzi`
2. Configure as variáveis de ambiente (veja `.env.example`)
3. O deploy é automático a cada push

### 3. Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
NEXTAUTH_URL=https://seu-dominio.vercel.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
```

### 4. Inicializar o banco

```bash
npx prisma db push
```

## Desenvolvimento Local

```bash
npm install
npx prisma db push
npm run dev
```

Acesse: http://localhost:3000
