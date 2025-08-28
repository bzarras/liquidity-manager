'use client';

import { useState } from 'react';
import YieldCurveChart from '@/components/YieldCurveChart';
import OrderForm from '@/components/OrderForm';
import OrderHistoryTable from '@/components/OrderHistoryTable';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOrderSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-black">      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">
              Liquidity Manager
            </h1>
            <p className="text-gray-400 mt-2">
              Treasury yield curve analysis and order management
            </p>
          </div>

          {/* Top row: Yield curve chart (2/3 width) + Order form (1/3 width) */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <YieldCurveChart />
            </div>
            <div className="col-span-1">
              <OrderForm onOrderSubmitted={handleOrderSubmitted} />
            </div>
          </div>

          {/* Bottom row: Order history table (2/3 width) */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <OrderHistoryTable refreshTrigger={refreshTrigger} />
            </div>
            <div className="col-span-1">
              {/* Empty space to maintain layout */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
