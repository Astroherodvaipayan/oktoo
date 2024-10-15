import { db } from '@/server/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const oktoUserId = req.nextUrl.searchParams.get('oktoUserId');

    if (!oktoUserId) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const userFound = await db.user.findFirst({
      where: {
        oktoUserId,
      },
      include: {
        receivedTransactions: {
          include: {
            from: true,
            to: true,
          },
        },
        sentTransactions: {
          include: {
            from: true,
            to: true,
          },
        },
      },
    });

    if (!userFound) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }

    let history = [...userFound.receivedTransactions, ...userFound.sentTransactions];
    const uniqueHistory = new Map();

    for (const transaction of history) {
      const fromToKey = `${transaction.from.id}-${transaction.to.id}-${transaction.id}`;
      if (!uniqueHistory.has(fromToKey)) {
        uniqueHistory.set(fromToKey, transaction);
      }
    }

    // Convert back to an array and sort by creationDate
    const sortedUniqueHistory = Array.from(uniqueHistory.values()).sort((a, b) =>
      a.creationDate > b.creationDate ? -1 : 1,
    );

    return NextResponse.json({ status: 200, history: sortedUniqueHistory });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
