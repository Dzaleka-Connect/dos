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
    percentage: 39.3,
    population: 37245,
    background: "Majority fled conflicts in Eastern DRC",
    challenges: [
      "Overcrowding in Dzaleka Camp",
      "Limited access to healthcare services",
      "Insufficient educational facilities",
      "Restricted movement outside camp"
    ],
    support: [
      "UNHCR Core Protection Services",
      "WFP Food Assistance (Monthly)",
      "UNHCR Shelter Support",
      "UNHCR Education Grants"
    ]
  },
  {
    nationality: "Burundians",
    percentage: 13.3,
    population: 12604,
    background: "Displaced by political instability",
    challenges: [
      "Limited livelihood opportunities in camp",
      "Language barriers with local community",
      "Access to secondary education",
      "Integration with host community"
    ],
    support: [
      "UNHCR Core Protection Services",
      "WFP Food Assistance (Monthly)",
      "UNHCR Livelihood Programs",
      "UNHCR Education Support"
    ]
  },
  {
    nationality: "Rwandans",
    percentage: 7.5,
    population: 7135,
    background: "Long-term residents since 1994",
    challenges: [
      "Limited employment opportunities",
      "Housing maintenance in camp",
      "Access to higher education",
      "Social services capacity"
    ],
    support: [
      "UNHCR Core Protection Services",
      "WFP Food Assistance (Monthly)",
      "UNHCR Self-Reliance Programs",
      "UNHCR Community Support"
    ]
  },
  {
    nationality: "Mozambique",
    percentage: 0.0,
    population: 35,
    background: "Fled ongoing civil conflict",
    challenges: [
      "Small community representation",
      "Access to specialized services",
      "Cultural preservation",
      "Integration with larger communities"
    ],
    support: [
      "UNHCR Core Protection Services",
      "WFP Food Assistance (Monthly)",
      "UNHCR Community-Based Protection",
      "UNHCR Integration Support"
    ]
  },
  {
    nationality: "Others",
    percentage: 39.8,
    population: 37664,
    background: "Various African nations",
    challenges: [
      "Diverse cultural needs in camp",
      "Access to specialized services",
      "Community representation",
      "Integration challenges"
    ],
    support: [
      "UNHCR Core Protection Services",
      "WFP Food Assistance (Monthly)",
      "UNHCR Community Support",
      "UNHCR Integration Programs"
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
          Source: Government, UNHCR 
        </p>
      </div>
    </div>
  );
}
