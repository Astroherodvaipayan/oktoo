import { useAuthenticationStore } from '@/modules/authenticated/auth-store';
import { useTokenValuesManagement } from '@/modules/token/store/token-values-management';
import { redirect } from 'next/navigation';
import { useOkto } from 'okto-sdk-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const InitialLoaderComponent = ({ onDataCorrectlyFetched }: { onDataCorrectlyFetched: () => void }) => {
  const { getPortfolio, createWallet } = useOkto();
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { user, savePortfolio, saveWalletsInformation } = useAuthenticationStore();
  const { updateAllTokensValue } = useTokenValuesManagement();
  const [errorOnWalletsRetrieval, setErrorOnWalletsRetrieval] = useState<string>();
  const [errorOnTokenPricesRetrieval, setErrorOnTokenPricesRetrieval] = useState<string>();
  const [errorOnPortfolioRetrieval, setErrorOnPortfolioRetrieval] = useState<string>();

  const fetchTokensPrices = async () => {
    try {
      const response = await fetch('/api/token/syncAllValues');
      if (!response.ok) {
        throw new Error('Failed to fetch token prices');
      }
      const data = await response.json();
      updateAllTokensValue(data);
    } catch (error) {
      console.error('Error fetching tokens prices:', error);
      setErrorOnTokenPricesRetrieval('Error fetching token prices.');
    }
  };

  const tryCreateUserWallet = async () => {
    try {
      const walletsData = await createWallet();
      const walletResponse = await fetch('/api/wallet', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet: walletsData.wallets,
          oktoUserId: user.oktoUserId,
        }),
      });
      const data = await walletResponse.json();
      if (!walletResponse.ok) {
        throw new Error(data.message || 'Error saving wallets');
      }
      return { wallets: data.data };
    } catch (error) {
      toast.error('Error creating wallets', {
        duration: 5000,
        description: `Failed to create or save wallets: ${error.message}`,
      });
      return { error: `Couldn't create Wallets` };
    }
  };

  const fetchUserWallets = async () => {
    try {
      const response = await fetch(`/api/wallet?oktoUserId=${user.oktoUserId}`);
      const data = await response.json();
      if (!data.wallets?.length) {
        const { wallets, error } = await tryCreateUserWallet();
        if (error) {
          setErrorOnWalletsRetrieval('Error retrieving wallets.');
          return;
        }
        saveWalletsInformation(wallets);
        return;
      }
      saveWalletsInformation(data.wallets);
    } catch (error) {
      setErrorOnWalletsRetrieval('Error retrieving wallets. ');
    }
  };

  const fetchPortfolio = async () => {
    try {
      const portfolio = await getPortfolio();
      savePortfolio(portfolio.tokens || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setErrorOnPortfolioRetrieval('Error fetching portfolio.');
    }
  };

  const getInitialDataFetching = async () => {
    if (!user?.emojis) {
      window.location.href = '/create';
      return;
    }
    await Promise.allSettled([fetchUserWallets(), fetchTokensPrices(), fetchPortfolio()]);
    setIsDataLoading(false);
    onDataCorrectlyFetched();
  };

  useEffect(() => {
    getInitialDataFetching();
  }, []);

  if (errorOnWalletsRetrieval || errorOnTokenPricesRetrieval || errorOnPortfolioRetrieval) {
    return (
      <div className="text-center text-red-500">
        <span>There was an error signing you in:</span>
        {!!errorOnWalletsRetrieval && <li>{errorOnWalletsRetrieval}</li>}
        {!!errorOnTokenPricesRetrieval && <li>{errorOnTokenPricesRetrieval}</li>}
        {!!errorOnPortfolioRetrieval && <li>{errorOnPortfolioRetrieval}</li>}
        <div className="w-full pt-4">
          <span>Please try again later or contact support if this issue persist.</span>
        </div>
      </div>
    );
  }

  return null;
};
export default InitialLoaderComponent;
