'use client';

import HeaderContent from '@/modules/layout/components/header-content';
import TokenSummaryCard from '@/modules/token/components/token-summary-card';
import TransactionListContent from './transaction-list-content';
import FooterLinkContent from './footer-links-content';
import PortfolioList from '@/app/dash/_components/portfolio-list';
import { useTotalPortfolioValue } from '@/modules/token/hooks/get-total-porfolio-value';

const DashboardContent = () => {
  const totalPortfolioValue = useTotalPortfolioValue();
  return (
    <div className="flex flex-col w-full min-h-[100vh] font-sans overflow-hidden justify-between">
      <div>
        <div className="mx-auto w-full" style={{ maxWidth: 800 }}>
          <HeaderContent />
          <div></div>
        </div>
        <div className="pt-4 mx-auto" style={{ width: '100%', maxWidth: 800 }}>
          <TokenSummaryCard balance={`$${totalPortfolioValue.toFixed(2)}`} />
          <div className="mt-2 w-full">
            <h1 className="px-4 text-xl text-zinc-400">Portfolio</h1>
            <PortfolioList />
          </div>
          <TransactionListContent />
        </div>
      </div>
      <div className="mx-auto" style={{ width: '100%', maxWidth: 800 }}>
        <FooterLinkContent />
      </div>
    </div>
  );
};
export default DashboardContent;
