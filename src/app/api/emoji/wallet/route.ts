import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(req: NextRequest) {
  try {
    const emojis = req.nextUrl.searchParams.get('emojis');
    const targetNetwork = req.nextUrl.searchParams.get('target');

    if (!emojis) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const userFound = await db.user.findFirst({
      where: {
        emojis,
      },
      include: {
        wallets: true,
      },
    });

    const wallet = userFound.wallets.find((w) => w.network_name === targetNetwork);

    if (!wallet?.id) {
      return NextResponse.json({ error: 'Invalid input', status: 404 });
    }

    return NextResponse.json({ status: 200, data: wallet });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
