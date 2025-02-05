import React from 'react';
import { Radar } from 'react-chartjs-2';
import '../../../utils/chartConfig';

interface EconomicImpact {
  area: string;
  percentage: number;
  description: string;
  examples: string[];
}

const economicData: EconomicImpact[] = [
  {
    area: "Entrepreneurship",
    percentage: 85,
    description: "Refugee-run businesses and shops",
    examples: [
      "Retail shops with extended hours",
      "Small-scale manufacturing",
      "Service-based businesses"
    ]
  },
  {
    area: "Agriculture",
    percentage: 70,
    description: "Farming partnerships and production",
    examples: [
      "Tomato farming innovations",
      "Soya and groundnut production",
      "Local market integration"
    ]
  },
  {
    area: "Job Creation",
    percentage: 65,
    description: "Employment opportunities",
    examples: [
      "Direct employment in refugee businesses",
      "Indirect job creation in supply chains",
      "Skills training positions"
    ]
  },
  {
    area: "Skills Transfer",
    percentage: 55,
    description: "Knowledge and expertise sharing",
    examples: [
      "Teaching in local schools",
      "Technical skills training",
      "Business mentorship"
    ]
  },
  {
    area: "Local Trade",
    percentage: 80,
    description: "Market integration and commerce",
    examples: [
      "Cross-border trade networks",
      "Local market participation",
      "Supply chain development"
    ]
  }
];

const chartData = {
  labels: economicData.map(d => d.area),
  datasets: [{
    label: 'Impact Level (%)',
    data: economicData.map(d => d.percentage),
    backgroundColor: 'rgba(75, 192, 192, 0.2)',
    borderColor: 'rgb(75, 192, 192)',
    pointBackgroundColor: 'rgb(75, 192, 192)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(75, 192, 192)'
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        font: { size: 14 }
      }
    }
  }
};

export function EconomicSection() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="h-[400px] w-[600px]">
          <Radar options={chartOptions} data={chartData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {economicData.map((impact, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-primary-600 font-medium">{impact.area}</span>
              <span className="text-sm text-gray-500">({impact.percentage}%)</span>
            </div>
            <p className="text-sm text-gray-600">{impact.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
