import { db } from '@/server/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const destEmojis = req.nextUrl.searchParams.get('destEmojis');
    const destNetwork = req.nextUrl.searchParams.get('destNetwork');

    if (!destEmojis) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const userFound = await db.user.findFirst({
      where: {
        emojis: destEmojis,
      },
      include: {
        wallets: true,
      },
    });

    if (!userFound) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }

    const foundWallet = userFound?.wallets?.find((w) => w.network_name === destNetwork);
    if (!foundWallet) {
      return NextResponse.json({ error: 'Wallet not found...', status: 409 });
    }
    return NextResponse.json({ status: 200, user: userFound, foundWallet });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
