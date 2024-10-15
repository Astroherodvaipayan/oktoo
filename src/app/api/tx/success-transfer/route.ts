import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { Transaction } from '@prisma/client';

type Payload = Partial<Transaction> & { oktoUserId: string; type: string };

export async function POST(req: NextRequest) {
  try {
    const data: Payload = await req.json();
    // Validating required fields
    if (
      !data.oktoUserId ||
      !data.fromUserId ||
      !data.toUserId ||
      !data.amount ||
      !data.orderId ||
      !data.network_name ||
      !data.tokenSymbol ||
      !data.type
    ) {
      return NextResponse.json({ error: 'Invalid input: missing required fields', status: 400 });
    }

    // Ensure amount is a valid number
    if (isNaN(parseFloat(data.amount))) {
      return NextResponse.json({ error: 'Invalid amount', status: 400 });
    }

    // Check if the user exists
    const existingUser = await db.user.findFirst({
      where: { oktoUserId: data.oktoUserId, id: data.fromUserId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }

    // Create the transaction record
    const newTransaction = await db.transaction.create({
      data: {
        orderId: data.orderId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        amount: data.amount,
        network_name: data.network_name,
        tokenSymbol: data.tokenSymbol,
        totalInDollars: data.totalInDollars,
        tokenInDollar: data.tokenInDollar,
        type: data.type,
        withdrawDestinationAddress: data.withdrawDestinationAddress || '',
      },
    });

    return NextResponse.json({ status: 200, data: newTransaction });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
