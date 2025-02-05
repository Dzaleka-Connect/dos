import React from 'react';
import { Line } from 'react-chartjs-2';
import '../../../utils/chartConfig';

interface Event {
  date: string;
  title: string;
  description: string;
  type: string;
  location: string;
  link?: string;
}

const events: Event[] = [
  {
    date: "November 22, 2022",
    title: "Aid Distribution Unrest",
    description: "Unrest at Dzaleka Camp over distribution of aid materials",
    type: "Health",
    location: "Dzaleka Camp"
  },
  {
    date: "December 14, 2022",
    title: "Security Incident",
    description: "Grenade attack on Burundian community leader Butoyi Fideli",
    type: "Cultural",
    location: "Dzaleka Camp"
  },
  {
    date: "May 17, 2023",
    title: "Forced Relocation",
    description: "Forced relocation of urban refugees back to Dzaleka Camp",
    type: "Educational",
    location: "Dzaleka Camp"
  },
  {
    date: "July 17, 2024",
    title: "Security Operation",
    description: "Malawi Defence Force raid targeting suspected human traffickers",
    type: "Health",
    location: "Dzaleka Camp"
  },
  {
    date: "October 12, 2024",
    title: "Security Operation",
    description: "Second widespread raid resulting in arrests and injuries",
    type: "Cultural",
    location: "Dzaleka Camp",
    link: "https://www.dzaleka.com/"
  }
];

const recentEvents = events.slice(0, 3);

const chartData = {
  labels: events.map(e => e.date),
  datasets: [{
    label: 'Major Incidents',
    data: events.map(() => 1),
    borderColor: 'rgb(255, 99, 132)',
    backgroundColor: 'rgba(255, 99, 132, 0.5)',
    pointRadius: 8,
    pointHoverRadius: 12
  }]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Timeline of Major Events (2022-2024)',
      padding: 20
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          const event = events[context.dataIndex];
          return `${event.title}: ${event.description}`;
        }
      }
    }
  },
  scales: {
    y: {
      display: false
    }
  }
};

export function EventsSection() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center mb-8">
        <div className="h-[300px] w-[700px]">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
        <div className="space-y-6">
          {recentEvents.map((event, index) => (
            <div key={index} className="relative pl-12">
              <div className="absolute left-0 top-4 w-4 h-4 rounded-full border-4 border-white bg-primary-500 shadow-sm" />
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.type === 'Cultural' ? 'bg-blue-100 text-blue-700' :
                    event.type === 'Educational' ? 'bg-green-100 text-green-700' :
                    event.type === 'Health' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {event.type}
                  </div>
                  <time className="text-sm text-gray-500">{event.date}</time>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-500">{event.location}</span>
                  </div>
                  {event.link && (
                    <a 
                      href={event.link}
                      className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center pt-4">
        <a 
          href="https://www.dzaleka.com/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          View All Events
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
