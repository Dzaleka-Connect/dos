import React from 'react';
import { Pie } from 'react-chartjs-2';
import '../../../utils/chartConfig';

interface NationalityGroup {
  nationality: string;
  percentage: number;
  population: number;
  background: string;
  challenges: string[];
  support: string[];
}

const demographics: NationalityGroup[] = [
  {
    nationality: "Congolese",
    percentage: 62,
    population: 37200,
    background: "Majority fled conflicts in Eastern DRC",
    challenges: [
      "Ongoing conflict in home region",
      "Family separation",
      "Documentation issues"
    ],
    support: [
      "Community leadership programs",
      "Family reunification support",
      "Skills development initiatives"
    ]
  },
  {
    nationality: "Burundians",
    percentage: 19,
    population: 11400,
    background: "Displaced by political instability",
    challenges: [
      "Political uncertainty",
      "Integration challenges",
      "Language barriers"
    ],
    support: [
      "Language training programs",
      "Cultural integration support",
      "Education access"
    ]
  },
  {
    nationality: "Rwandans",
    percentage: 7,
    population: 4200,
    background: "Long-term residents since 1994",
    challenges: [
      "Protracted displacement",
      "Second generation issues",
      "Return concerns"
    ],
    support: [
      "Youth programs",
      "Education support",
      "Livelihood projects"
    ]
  },
  {
    nationality: "Somalis",
    percentage: 5,
    population: 3000,
    background: "Fled ongoing civil conflict",
    challenges: [
      "Cultural adaptation",
      "Limited community size",
      "Specific dietary needs"
    ],
    support: [
      "Cultural support groups",
      "Religious facilities",
      "Community integration"
    ]
  },
  {
    nationality: "Ethiopians",
    percentage: 4,
    population: 2400,
    background: "Recent arrivals from regional conflicts",
    challenges: [
      "New arrival integration",
      "Language barriers",
      "Community establishment"
    ],
    support: [
      "New arrival support",
      "Language classes",
      "Community building"
    ]
  },
  {
    nationality: "Others",
    percentage: 3,
    population: 1800,
    background: "Various African nations",
    challenges: [
      "Diverse needs",
      "Small community sizes",
      "Integration support"
    ],
    support: [
      "Targeted assistance",
      "Integration programs",
      "Cultural preservation"
    ]
  }
];

const chartData = {
  labels: demographics.map(d => d.nationality),
  datasets: [{
    data: demographics.map(d => d.percentage),
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
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
      position: 'bottom',
      labels: {
        padding: 20,
        font: { size: 14 }
      }
    },
    title: {
      display: true,
      text: 'Nationality Distribution',
      padding: 20
    }
  }
};

export function DemographicsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Camp Demographics</h2>
      
      <div className="flex justify-center">
        <div className="h-[500px] w-[700px]">
          <Pie options={chartOptions} data={chartData} />
        </div>
      </div>
      
      <div className="space-y-4">
        {demographics.map((group, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">{group.nationality}</h3>
              <div className="text-right">
                <span className="text-sm font-medium text-primary-600">{group.percentage}%</span>
                <span className="text-sm text-gray-500 ml-2">({group.population.toLocaleString()})</span>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{group.background}</p>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Challenges:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {group.challenges.map((challenge, i) => (
                    <li key={i}>• {challenge}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Support:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {group.support.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100 italic">
          Source: UNHCR Registration Data 2024
        </p>
      </div>
    </div>
  );
}
