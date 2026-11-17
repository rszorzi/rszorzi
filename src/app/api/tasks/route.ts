import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { title, description, priority, storyPoints, dueDate, tags, columnId, assigneeId } = await req.json();
  if (!title || !columnId) return NextResponse.json({ error: 'title and columnId required' }, { status: 400 });
  const count = await prisma.task.count({ where: { columnId } });
  const task = await prisma.task.create({
    data: {
      title, description, priority: priority || 'medium',
      storyPoints: storyPoints || 1, dueDate: dueDate ? new Date(dueDate) : null,
      tags: tags || [], columnId, assigneeId: assigneeId || null,
      creatorId: userId, order: count,
    },
    include: { assignee: { select: { id: true, name: true, image: true } } },
  });
  return NextResponse.json(task, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, columnId, order, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const task = await prisma.task.update({
    where: { id },
    data: { ...data, columnId, order, dueDate: data.dueDate ? new Date(data.dueDate) : undefined },
    include: { assignee: { select: { id: true, name: true, image: true } } },
  });
  return NextResponse.json(task);
}
