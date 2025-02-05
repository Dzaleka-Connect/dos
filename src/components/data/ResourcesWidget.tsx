import React from 'react';

interface Resource {
  id: number;
  title: string;
  description: string;
  link: string;
  type: 'report' | 'data' | 'news' | 'research';
  date?: string;
}

const resources: Resource[] = [
  {
    id: 1,
    title: 'WFP Malawi Country Brief',
    description: 'Latest statistics on refugee population, food assistance, and humanitarian needs in Dzaleka Camp.',
    link: 'https://reliefweb.int/report/malawi/wfp-malawi-country-brief-december-2024',
    type: 'report',
    date: 'December 2024'
  },
  {
    id: 2,
    title: 'UNHCR Malawi Data Portal',
    description: 'Comprehensive data on refugee demographics, countries of origin, and camp statistics.',
    link: 'https://data.unhcr.org/en/country/mwi',
    type: 'data',
    date: '2024'
  },
  {
    id: 3,
    title: 'ReliefWeb Malawi Updates',
    description: 'Latest news and situation reports about Dzaleka Refugee Camp.',
    link: 'https://reliefweb.int/country/mwi',
    type: 'news',
    date: '2024'
  },
  {
    id: 4,
    title: 'Inua Advocacy Research',
    description: 'Research and advocacy reports on refugee rights and community development in Dzaleka.',
    link: 'https://inuaadvocacy.org',
    type: 'research',
    date: '2024'
  }
];

export function ResourcesWidget() {
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <a
          key={resource.id}
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {resource.type === 'report' ? (
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              ) : resource.type === 'data' ? (
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : resource.type === 'news' ? (
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">
                  {resource.title}
                  <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h3>
                {resource.date && (
                  <span className="text-sm text-gray-500">{resource.date}</span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">{resource.description}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
