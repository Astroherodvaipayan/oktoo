import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { User } from '@prisma/client';

type Payload = Partial<User>;

export async function POST(req: NextRequest) {
  try {
    const data: Payload = await req.json();
    if (!data.email || !data.googleClientID || !data.oktoUserId) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email: data.email }, { oktoUserId: data.oktoUserId }, { emojis: data.emojis }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists', status: 409 });
    }

    const createdUser = await db.user.create({
      data: {
        email: data.email,
        googleClientID: data.googleClientID,
        oktoUserId: data.oktoUserId,
        oktoAccountCreatedAt: new Date((data as any).oktoAccountCreatedAt * 1000),
        oktoAccountFreezed: !!data.oktoAccountFreezed,
        oktoFreezeReason: data.oktoFreezeReason,
        emojis: data.emojis,
      },
    });

    return NextResponse.json({ status: 200, data: createdUser });
  } catch (e) {
    console.log({ e });
    console.log({ e });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const oktoUserId = req.nextUrl.searchParams.get('oktoUserId');

    if (!oktoUserId) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const userFound = await db.user.findFirst({
      where: {
        oktoUserId: oktoUserId,
      },
    });

    return NextResponse.json({ status: 200, data: userFound });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
