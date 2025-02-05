import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export function PopulationChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const populationData = {
      total: 702433,
      categories: {
        'IDPs': 85,
        'Asylum-seekers': 6,
        'Stateless': 4,
        'Refugees': 2,
        'Returned IDPs': 1,
        'Others': 2
      }
    };

    // Calculate actual numbers from percentages
    const data = Object.entries(populationData.categories).map(([category, percentage]) => ({
      category,
      count: Math.round((percentage / 100) * populationData.total)
    }));

    // Sort by count in descending order
    data.sort((a, b) => b.count - a.count);

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(item => item.category),
        datasets: [{
          data: data.map(item => item.count),
          backgroundColor: [
            '#2563eb', // Blue for IDPs
            '#16a34a', // Green for Asylum-seekers
            '#9333ea', // Purple for Stateless
            '#dc2626', // Red for Refugees
            '#f59e0b', // Orange for Returned IDPs
            '#64748b'  // Gray for Others
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              padding: 10,
              boxWidth: 6,
              font: {
                size: 11
              }
            }
          },
          title: {
            display: true,
            text: 'Population Distribution 2025',
            font: {
              size: 14,
              weight: 'bold'
            },
            padding: {
              top: 0,
              bottom: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 8,
            titleFont: {
              size: 12
            },
            bodyFont: {
              size: 11
            },
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = ((value / populationData.total) * 100).toFixed(1);
                return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          duration: 750,
          easing: 'easeOutQuart'
        },
        layout: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Total Population</h3>
          <span className="text-lg font-bold text-blue-600">
            {(702433).toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Source: <a 
            href="https://reporting.unhcr.org/operational/operations/malawi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            UNHCR Malawi Operations 2025
          </a>
        </p>
      </div>
      
      <div className="flex justify-center items-center">
        <div className="h-[350px] w-[500px]">
          <canvas ref={chartRef} />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Data as of {new Date().toLocaleDateString()}
      </div>
    </div>
  );
}