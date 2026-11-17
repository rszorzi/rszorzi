import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const userId = (session.user as any).id as string;

  const [boards, notifications] = await Promise.all([
    prisma.board.findMany({
      where: { userId },
      include: { columns: { include: { _count: { select: { tasks: true } } } } },
      orderBy: { updatedAt: 'desc' },
      take: 6,
    }),
    prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalTasks = boards.reduce((s, b) => s + b.columns.reduce((cs, c) => cs + c._count.tasks, 0), 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bem-vindo(a) de volta, {session.user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Aqui está o resumo de hoje</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Quadros', value: boards.length },
          { label: 'Tarefas Ativas', value: totalTasks },
          { label: 'Notificações', value: notifications.length },
          { label: 'Plano', value: (session.user as any).subscriptionPlan || 'FREE' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{s.label}</div>
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Boards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Meus Quadros</h2>
        <Link href="/boards" className="text-sm text-purple-600 hover:underline">Ver todos</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => {
          const taskCount = board.columns.reduce((s, c) => s + c._count.tasks, 0);
          return (
            <Link key={board.id} href={`/boards/${board.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
              <div className="w-8 h-8 rounded-lg mb-3" style={{ background: board.color }} />
              <div className="font-semibold mb-1">{board.name}</div>
              <div className="text-sm text-gray-500 mb-3 line-clamp-2">{board.description}</div>
              <div className="text-xs text-gray-400">📋 {taskCount} tarefas · {board.columns.length} colunas</div>
            </Link>
          );
        })}
        <Link href="/boards/new"
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-all min-h-[120px]">
          <span className="text-3xl mb-1">+</span>
          <span className="text-sm font-medium">Novo Quadro</span>
        </Link>
      </div>
    </div>
  );
}
