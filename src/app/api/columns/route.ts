import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, boardId, color, order } = await req.json();
  if (!name || !boardId) return NextResponse.json({ error: 'name and boardId required' }, { status: 400 });
  const col = await prisma.column.create({
    data: { name, boardId, color: color || '#6B7280', order: order ?? 0 },
  });
  return NextResponse.json(col, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, name, color, order } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const col = await prisma.column.update({ where: { id }, data: { name, color, order } });
  return NextResponse.json(col);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  await prisma.column.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
