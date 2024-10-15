import { NextResponse } from 'next/server';

export const getTokensDataFromBackend = async () => {
  try {
    const isProduction = false;
    const defaultData = {
      sol: { usd: 157.33 },
      usdt: { usd: 1.0 },
      usdc: { usd: 1.0 },
    };

    const data = !isProduction
      ? defaultData
      : await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,tether,usd-coin&vs_currencies=usd')
          .then((response) => response.json())
          .catch(() => defaultData);

    return {
      data: {
        sol: data.solana?.usd ?? defaultData.sol.usd,
        usdt: data.tether?.usd ?? defaultData.usdt.usd,
        usdc: data['usd-coin']?.usd ?? defaultData.usdc.usd,
      },
    };
  } catch (error) {
    console.error('Error fetching token data:', error);
    return { error: 'Failed to fetch token data' };
  }
};

export async function GET() {
  try {
    const { data: responseData, error } = await getTokensDataFromBackend();
    if (error) {
      return NextResponse.json({ error: 'Error retrieving prices', status: 500 });
    }
    return NextResponse.json(responseData);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: 'Internal server error', status: 500 });
  }
}
