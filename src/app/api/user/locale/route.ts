import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const { locale } = await req.json();
  if (!['pt', 'en'].includes(locale)) return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  await prisma.user.update({ where: { id: userId }, data: { locale } });
  return NextResponse.json({ ok: true });
}
