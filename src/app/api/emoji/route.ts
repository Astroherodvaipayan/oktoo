import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

type Payload = { emojis: string; oktoUserId: string };

export async function PATCH(req: NextRequest) {
  try {
    const data: Payload = await req.json();
    if (!data.emojis || !data.oktoUserId) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const userToModifyExists = await db.user.findFirst({
      where: {
        oktoUserId: data.oktoUserId,
        emojis: '',
      },
    });

    const userWithEmojis = await db.user.findFirst({
      where: {
        emojis: data.emojis,
      },
    });

    if (!userToModifyExists || userWithEmojis) {
      return NextResponse.json({ status: 409, updated: false, message: 'User already exists' });
    }

    await db.user.updateMany({ where: { oktoUserId: data.oktoUserId }, data: { emojis: data.emojis } });

    return NextResponse.json({ status: 200, updated: true });
  } catch (e) {
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const emojis = req.nextUrl.searchParams.get('emojis');

    if (!emojis) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const userFound = await db.user.findFirst({
      where: {
        emojis,
      },
    });

    return NextResponse.json({ status: 200, data: userFound });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
