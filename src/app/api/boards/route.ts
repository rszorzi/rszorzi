import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const boards = await prisma.board.findMany({
    where: { userId },
    include: { columns: { orderBy: { order: 'asc' }, include: { tasks: { orderBy: { order: 'asc' } } } } },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(boards);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { name, description, color } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const board = await prisma.board.create({
    data: {
      name, description, color: color || '#7C3AED', userId,
      columns: {
        create: [
          { name: 'Backlog', color: '#6B7280', order: 0 },
          { name: 'Em Progresso', color: '#7C3AED', order: 1 },
          { name: 'Em Revisão', color: '#F59E0B', order: 2 },
          { name: 'Concluído', color: '#10B981', order: 3 },
        ],
      },
    },
    include: { columns: true },
  });
  return NextResponse.json(board, { status: 201 });
}
