import { useEffect, useState } from 'react';

interface FinanceData {
  budget: number;
  funded: number;
  gap: number;
  lastUpdated: string;
  source: string;
}

export function FinanceWidget() {
  const [data, setData] = useState<FinanceData>({
    budget: 27900000, // $27.9M USD (2024 budget)
    funded: 2790000,  // 10% funded
    gap: 25110000,    // Remaining gap
    lastUpdated: new Date().toISOString(),
    source: 'https://reporting.unhcr.org/operational/operations/malawi'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(1)}K`;
  };

  const calculatePercentage = (amount: number) => {
    return ((amount / data.budget) * 100).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">UNHCR Funding 2024</h3>
        <a 
          href={data.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View Report
        </a>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Total Budget</span>
          <span className="font-medium">{formatCurrency(data.budget)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Funded</span>
          <span className="font-medium text-green-600">{formatCurrency(data.funded)} ({calculatePercentage(data.funded)}%)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Funding Gap</span>
          <span className="font-medium text-red-600">{formatCurrency(data.gap)} ({calculatePercentage(data.gap)}%)</span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${calculatePercentage(data.funded)}%` }}
            ></div>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
