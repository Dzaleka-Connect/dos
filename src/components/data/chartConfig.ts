import { ChartOptions } from 'chart.js';

export const chartConfig: ChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      cornerRadius: 4
    }
  },
  animation: {
    duration: 750,
    easing: 'easeOutQuart'
  },
  layout: {
    padding: {
      top: 20,
      bottom: 20
    }
  }
};
