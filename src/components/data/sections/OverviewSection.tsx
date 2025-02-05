import React from 'react';
import { Bar } from 'react-chartjs-2';
import '../../../utils/chartConfig';

interface OverviewData {
  title: string;
  content: string[];
  source: string;
}

const overviewData: OverviewData = {
  title: "Dzaleka Refugee Camp Overview",
  content: [
    "Established in 1994 in response to the Rwandan genocide and conflicts in Burundi and DRC",
    "Located in Dowa District, about 45km north of Lilongwe, Malawi's capital",
    "Originally designed for 10,000-12,000 refugees, now hosts over 60,000 people",
    "Faces significant challenges with overcrowding and limited resources",
    "Home to diverse entrepreneurial activities and small businesses",
    "Supported by UNHCR, WFP, and various NGOs providing essential services"
  ],
  source: "Dzaleka Refugee Information Hub, 2024"
};

const chartData = {
  labels: ['Original Capacity', 'Current Population', 'Overcapacity'],
  datasets: [{
    label: 'Number of People',
    data: [12000, 60000, 48000],
    backgroundColor: [
      'rgba(75, 192, 192, 0.5)',
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 159, 64, 0.5)'
    ],
    borderColor: [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)'
    ],
    borderWidth: 1
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Camp Capacity vs Reality (2024)',
      padding: 20
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value: any) {
          return value.toLocaleString();
        }
      }
    }
  }
};

export function OverviewSection() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{overviewData.title}</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px]">
          <Bar options={chartOptions} data={chartData} />
        </div>
        
        <div className="space-y-4">
          {overviewData.content.map((text, index) => (
            <p key={index} className="text-gray-600 leading-relaxed">
              {text}
            </p>
          ))}
          <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100 italic">
            Source: {overviewData.source}
          </p>
        </div>
      </div>
    </div>
  );
}
