import React from 'react';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
}

const alerts: Alert[] = [
  {
    id: 1,
    type: 'critical',
    title: 'Refugee Population Surge',
    description: 'Significant increase in refugee numbers at Dzaleka Camp, creating escalating challenges for resource allocation.',
    date: 'December 2024'
  },
  {
    id: 2,
    type: 'critical',
    title: 'Food Ration Reduction Risk',
    description: 'Current funding only maintains 75% food rations until February 2025. Urgent additional resources needed.',
    date: 'December 2024'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Malnutrition Cases Rising',
    description: 'SAM admissions increased by 21% and MAM admissions surged by 185% in November 2024.',
    date: 'November 2024'
  },
  {
    id: 4,
    type: 'info',
    title: 'Emergency Food Distribution',
    description: 'WFP providing assistance to 56,760 refugees (60% women) in Dzaleka Camp.',
    date: 'December 2024'
  }
];

export function EmergencyAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border ${
            alert.type === 'critical' ? 'bg-red-50 border-red-200' :
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
            'bg-blue-50 border-blue-200'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {alert.type === 'critical' ? (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : alert.type === 'warning' ? (
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${
                alert.type === 'critical' ? 'text-red-800' :
                alert.type === 'warning' ? 'text-yellow-800' :
                'text-blue-800'
              }`}>
                {alert.title}
              </h3>
              
              <div className={`mt-2 text-sm ${
                alert.type === 'critical' ? 'text-red-700' :
                alert.type === 'warning' ? 'text-yellow-700' :
                'text-blue-700'
              }`}>
                {alert.description}
              </div>
              
              <div className={`mt-2 text-xs ${
                alert.type === 'critical' ? 'text-red-500' :
                alert.type === 'warning' ? 'text-yellow-500' :
                'text-blue-500'
              }`}>
                {alert.date}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
