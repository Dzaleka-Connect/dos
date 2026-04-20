import { useEffect, useState } from 'react';

interface FinanceData {
  budget: number;
  funded: number;
  gap: number;
  lastUpdated: string;
  source: string;
}

const fallbackData: FinanceData = {
  budget: 26300000,
  funded: 4679887,
  gap: 21620113,
  lastUpdated: '2025-07-31T00:00:00Z',
  source: 'https://reporting.unhcr.org/operational/operations/malawi',
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }

  return `$${(amount / 1000).toFixed(1)}K`;
};

export function FinanceWidget() {
  const [data, setData] = useState<FinanceData>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/finance');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload: FinanceData = await response.json();
        setData(payload);
        setError(null);
      } catch (err) {
        console.error('Error fetching finance data:', err);
        setData(fallbackData);
        setError('Showing the latest cached funding snapshot.');
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, []);

  const fundedPercentage = ((data.funded / data.budget) * 100).toFixed(1);
  const gapPercentage = ((data.gap / data.budget) * 100).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">UNHCR Funding 2025</h3>
        <a
          href={data.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          Source
        </a>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Requirements</span>
          <span className="font-medium text-gray-900">{formatCurrency(data.budget)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Funded</span>
          <span className="font-medium text-green-700">
            {formatCurrency(data.funded)} ({fundedPercentage}%)
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Gap</span>
          <span className="font-medium text-red-700">
            {formatCurrency(data.gap)} ({gapPercentage}%)
          </span>
        </div>

        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${fundedPercentage}%` }}></div>
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          As of {new Date(data.lastUpdated).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">2026 outlook</h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          UNHCR operational budget dropped from $8M to $1M — a 90% cut. WFP needs $11M more to maintain rations through December 2026.
        </p>
      </div>

      {error ? <div className="text-xs text-amber-700 bg-amber-50 rounded-lg p-2">{error}</div> : null}
    </div>
  );
}
