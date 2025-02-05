import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import '../../../utils/chartConfig';

interface Stakeholder {
  name: string;
  role: string;
  percentage: number;
  description: string;
  type: string;
  areas: string[];
}

const stakeholders: Stakeholder[] = [
  {
    name: "Government of Malawi",
    role: "Policy Development",
    percentage: 20,
    description: "Responsible for policy development and enforcement of refugee laws",
    type: 'Government',
    areas: ['Policy Development', 'Refugee Law Enforcement']
  },
  {
    name: "UNHCR",
    role: "Protection & Coordination",
    percentage: 25,
    description: "Provides protection, assistance, and coordinates humanitarian efforts",
    type: 'UN',
    areas: ['Protection', 'Assistance', 'Coordination']
  },
  {
    name: "Implementing Partners",
    role: "Service Delivery",
    percentage: 20,
    description: "Contracted organizations delivering direct services",
    type: 'NGO',
    areas: ['Service Delivery', 'Contracted Organizations']
  },
  {
    name: "Cooperating Partners",
    role: "Specialized Services",
    percentage: 15,
    description: "Organizations focusing on specific aspects, approved by Ministry",
    type: 'NGO',
    areas: ['Specialized Services', 'Approved by Ministry']
  },
  {
    name: "CBOs",
    role: "Community Services",
    percentage: 10,
    description: "Refugee-led initiatives providing essential services",
    type: 'NGO',
    areas: ['Community Services', 'Refugee-led Initiatives']
  },
  {
    name: "Donors",
    role: "Funding",
    percentage: 10,
    description: "Governments and organizations providing funding support",
    type: 'NGO',
    areas: ['Funding Support', 'Governments and Organizations']
  }
];

const chartData = {
  labels: stakeholders.map(s => s.name),
  datasets: [{
    data: stakeholders.map(s => s.percentage),
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
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Stakeholder Involvement Distribution',
      padding: 20
    }
  }
};

export function StakeholdersSection() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-8">
        <div className="h-[300px] w-[700px]">
          <Doughnut options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stakeholders.map((stakeholder, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-5">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                stakeholder.type === 'NGO' ? 'bg-blue-100 text-blue-600' :
                stakeholder.type === 'Government' ? 'bg-green-100 text-green-600' :
                stakeholder.type === 'UN' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                {stakeholder.type === 'NGO' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )}
                {stakeholder.type === 'Government' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {stakeholder.type === 'UN' && (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{stakeholder.name}</h3>
                    <p className="text-sm font-medium text-primary-600">{stakeholder.role}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    stakeholder.type === 'NGO' ? 'bg-blue-50 text-blue-700' :
                    stakeholder.type === 'Government' ? 'bg-green-50 text-green-700' :
                    stakeholder.type === 'UN' ? 'bg-purple-50 text-purple-700' :
                    'bg-orange-50 text-orange-700'
                  }`}>
                    {stakeholder.percentage}%
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stakeholder.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {stakeholder.areas.map((area, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <a 
          href="https://reporting.unhcr.org/operational/operations/malawi"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View All Stakeholders
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
