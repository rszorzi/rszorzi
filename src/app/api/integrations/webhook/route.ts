import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const signature = req.headers.get('x-kanflow-signature');
  const body = await req.text();

  const integration = await prisma.integration.findFirst({
    where: { type: 'webhook', enabled: true },
  });

  if (integration && signature) {
    const secret = (integration.config as any)?.secret || '';
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (`sha256=${expected}` !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let payload: any;
  try { payload = JSON.parse(body); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

  if (integration) {
    await prisma.notification.create({
      data: {
        title: `Webhook: ${payload.event || 'event'}`,
        message: payload.message || JSON.stringify(payload).slice(0, 200),
        type: 'webhook',
        userId: integration.userId,
      },
    });
  }

  return NextResponse.json({ ok: true, received: true });
}
