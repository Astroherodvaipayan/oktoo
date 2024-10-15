import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { useEffect, useState } from 'react';
import { useTokenValuesManagement } from '../store/token-values-management';
import { Portfolio } from 'okto-sdk-react';

export const getTokenPrice = (item: Portfolio, tokenValues: any) => {
  const tokenSymbol = item.token_name === 'SOL_DEVNET' ? 'SOL' : item.token_name;
  const tokenPrice = tokenValues[tokenSymbol.toLowerCase()] || 0; // Default to 0 if price is not found
  console.log({ calculation: true, tokenSymbol, tokenPrice });
  return parseFloat(item.quantity) * tokenPrice;
};

export const useTotalPortfolioValue = () => {
  const { portfolio } = useAuthenticationStore();
  const tokenValues = useTokenValuesManagement();
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

  const calculateTotalPortfolioValue = () => {
    const totalValue = portfolio.reduce((prev, item) => {
      const tokenPriceInUsd = getTokenPrice(item, tokenValues);
      return prev + tokenPriceInUsd;
    }, 0);

    setTotalPortfolioValue(totalValue);
  };

  useEffect(() => {
    calculateTotalPortfolioValue();
  }, [portfolio, tokenValues]);

  return totalPortfolioValue;
};
