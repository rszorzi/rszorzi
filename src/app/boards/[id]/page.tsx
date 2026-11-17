import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import KanbanBoard from '@/components/board/KanbanBoard';

export default async function BoardPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  const userId = (session.user as any).id as string;
  const board = await prisma.board.findFirst({
    where: { id: params.id, userId },
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: { tasks: { orderBy: { order: 'asc' }, include: { assignee: { select: { id: true, name: true, image: true } } } } },
      },
    },
  });
  if (!board) redirect('/boards');
  return (
    <div>
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
        <div className="w-5 h-5 rounded" style={{ background: board.color }} />
        <h1 className="font-bold text-lg">{board.name}</h1>
        {board.description && <span className="text-sm text-gray-400">{board.description}</span>}
      </div>
      <KanbanBoard board={board as any} />
    </div>
  );
}
