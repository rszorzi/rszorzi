import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const teams = await prisma.team.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } } },
  });
  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { name, description } = await req.json();
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  const team = await prisma.team.create({
    data: { name, description, members: { create: { userId, role: 'Admin' } } },
    include: { members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } } },
  });
  return NextResponse.json(team, { status: 201 });
}
