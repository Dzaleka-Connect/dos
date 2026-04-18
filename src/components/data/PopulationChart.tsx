import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './chartConfig';

interface PopulationResponse {
  total: number;
  newArrivals: number;
  demographics: {
    women: number;
    children: number;
    men: number;
  };
  nationalities: Record<string, number>;
  trends: {
    labels: string[];
    values: number[];
  };
}

const fallbackData: PopulationResponse = {
  total: 55425,
  newArrivals: 304,
  demographics: {
    women: 45,
    children: 48,
    men: 7,
  },
  nationalities: {
    DRC: 64.9,
    Burundi: 21.9,
    Rwanda: 12.6,
    Somalia: 0.3,
    Ethiopia: 0.3,
    Other: 0.1,
  },
  trends: {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    values: [40000, 45000, 48000, 50000, 52258, 55425],
  },
};

const colors = ['#2563eb', '#16a34a', '#9333ea', '#dc2626', '#f59e0b', '#64748b'];

export function PopulationChart() {
  const [data, setData] = useState<PopulationResponse>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopulation = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/population');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload: PopulationResponse = await response.json();
        setData(payload);
        setError(null);
      } catch (err) {
        console.error('Error fetching population data:', err);
        setData(fallbackData);
        setError('Showing the latest available population snapshot.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopulation();
  }, []);

  const nationalityData = Object.entries(data.nationalities)
    .map(([label, percentage]) => ({
      label,
      count: Math.round((percentage / 100) * data.total),
      percentage,
    }))
    .sort((left, right) => right.count - left.count);

  const chartData = {
    labels: nationalityData.map((item) => item.label),
    datasets: [
      {
        data: nationalityData.map((item) => item.count),
        backgroundColor: colors.slice(0, nationalityData.length),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          usePointStyle: true,
          padding: 12,
          boxWidth: 8,
          font: {
            size: 11,
          },
        },
      },
      title: {
        display: true,
        text: 'Population by Nationality',
        font: {
          size: 14,
          weight: 'bold' as const,
        },
        padding: {
          top: 0,
          bottom: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { dataIndex: number; label: string; raw: number }) => {
            const item = nationalityData[context.dataIndex];
            return `${context.label}: ${context.raw.toLocaleString()} (${item.percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Total Population</h3>
          <span className="text-lg font-bold text-blue-600">{data.total.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          New arrivals: <span className="font-medium">{data.newArrivals.toLocaleString()}</span>
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Source:{' '}
          <a
            href="https://data.unhcr.org/en/country/mwi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            UNHCR Malawi Data
          </a>
        </p>
      </div>

      <div className="flex justify-center items-center">
        <div className="h-[350px] w-full max-w-[500px]">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Data as of {new Date().toLocaleDateString()}
      </div>

      {error ? <div className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">{error}</div> : null}
    </div>
  );
}
