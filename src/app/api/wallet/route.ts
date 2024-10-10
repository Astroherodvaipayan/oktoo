import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export interface WalletInfo {
  network_name: string;
  address: string;
  success: boolean;
}

type Payload = { wallet: WalletInfo[]; oktoUserId: string };

export async function PATCH(req: NextRequest) {
  try {
    const data: Payload = await req.json();
    data.wallet = data.wallet || [];
    if (!data.wallet?.length || !data.oktoUserId) {
      return NextResponse.json({ error: 'Invalid input', status: 400 });
    }

    const existingUser = await db.user.findFirst({
      where: { oktoUserId: data.oktoUserId },
      include: {
        wallets: true,
      },
    });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found', status: 404 });
    }
    console.log(existingUser);
    console.log(existingUser);
    existingUser.wallets = existingUser.wallets || [];

    const walletsToInsert = data.wallet.filter((wallet) => {
      return !existingUser.wallets.some((existingWallet) => existingWallet.address === wallet.address);
    });

    if (walletsToInsert.length === 0) {
      return NextResponse.json({ message: 'No new wallets to insert', status: 200, data: existingUser.wallets });
    }

    const createdWallets = await Promise.all(
      walletsToInsert.map((wallet) =>
        db.wallet.create({
          data: {
            address: wallet.address,
            network_name: wallet.network_name,
            userId: existingUser.id,
          },
        }),
      ),
    );

    const allWallets = existingUser.wallets.concat(createdWallets);

    return NextResponse.json({ status: 200, data: allWallets });
  } catch (e) {
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
      include: {
        wallets: true,
      },
    });

    return NextResponse.json({ status: 200, data: userFound });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
