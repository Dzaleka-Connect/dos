import React from 'react';
import { Bar } from 'react-chartjs-2';
import '../../../utils/chartConfig';

interface HealthService {
  name: string;
  capacity: number;
  status: string;
  challenges: string[];
  improvements: string[];
}

const healthServices: HealthService[] = [
  {
    name: "Medical Staff",
    capacity: 30,
    status: "Severe Shortage",
    challenges: [
      "Limited number of qualified personnel",
      "High patient-to-doctor ratio",
      "Staff burnout"
    ],
    improvements: [
      "Training programs for refugee medical professionals",
      "Partnerships with medical schools",
      "Volunteer medical staff programs"
    ]
  },
  {
    name: "Basic Care",
    capacity: 45,
    status: "Strained",
    challenges: [
      "Overcrowded facilities",
      "Long waiting times",
      "Limited equipment"
    ],
    improvements: [
      "Mobile clinic services",
      "Community health workers",
      "Preventive care programs"
    ]
  },
  {
    name: "Specialized Care",
    capacity: 20,
    status: "Limited",
    challenges: [
      "Few specialists available",
      "Limited diagnostic equipment",
      "Referral system challenges"
    ],
    improvements: [
      "Telemedicine programs",
      "Specialist visit schedules",
      "Equipment donation programs"
    ]
  },
  {
    name: "Medicine Access",
    capacity: 35,
    status: "Inadequate",
    challenges: [
      "Frequent stockouts",
      "Storage limitations",
      "Supply chain issues"
    ],
    improvements: [
      "Improved inventory management",
      "Local pharmacy partnerships",
      "Essential medicine programs"
    ]
  },
  {
    name: "Emergency Services",
    capacity: 25,
    status: "Critical",
    challenges: [
      "Limited ambulance services",
      "Night-time access issues",
      "Emergency equipment shortage"
    ],
    improvements: [
      "24/7 emergency response team",
      "Emergency transport system",
      "First responder training"
    ]
  }
];

const chartData = {
  labels: healthServices.map(s => s.name),
  datasets: [{
    label: 'Current Capacity (%)',
    data: healthServices.map(s => s.capacity),
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    borderColor: 'rgb(255, 99, 132)',
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
      text: 'Healthcare Services Capacity',
      padding: 20
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'Capacity (%)'
      }
    }
  }
};

const healthcareData = healthServices.map(service => ({
  name: service.name,
  availability: service.capacity,
  description: `${service.status} - ${service.challenges.join(', ')}`,
}));

export function HealthcareSection() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="h-[400px] w-[600px]">
          <Bar options={chartOptions} data={chartData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthcareData.map((service, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-primary-600 font-medium">{service.name}</span>
              <span className="text-sm text-gray-500">({service.availability}%)</span>
            </div>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
