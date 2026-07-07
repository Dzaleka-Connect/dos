import { useEffect, useState } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  author?: string;
  resourceUrl?: string;
  downloadUrl?: string;
  date?: string;
  lastUpdated?: string;
  featured?: boolean;
}

interface ResourcesResponse {
  data?: {
    resources?: Resource[];
  };
}

const formatDate = (value?: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
      });
};

const getResourceHref = (resource: Resource) =>
  resource.downloadUrl || resource.resourceUrl || `/resources/${resource.id}`;

const getTypeStyle = (category: string) => {
  const normalized = category.toLowerCase();

  if (normalized.includes('guide')) {
    return {
      accent: 'bg-blue-100 text-blue-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    };
  }

  if (normalized.includes('data') || normalized.includes('report')) {
    return {
      accent: 'bg-green-100 text-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    };
  }

  return {
    accent: 'bg-primary-100 text-primary-700',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  };
};

export function ResourcesWidget() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/resources');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload: ResourcesResponse = await response.json();
        const items = [...(payload.data?.resources || [])]
          .sort((left, right) => {
            const featuredDelta = Number(Boolean(right.featured)) - Number(Boolean(left.featured));
            if (featuredDelta !== 0) {
              return featuredDelta;
            }

            const rightDate = new Date(right.lastUpdated || right.date || 0).getTime();
            const leftDate = new Date(left.lastUpdated || left.date || 0).getTime();
            return rightDate - leftDate;
          })
          .slice(0, 4);

        setResources(items);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No resources available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const typeStyle = getTypeStyle(resource.category);
        const label = formatDate(resource.lastUpdated || resource.date) || resource.author || 'Resource';

        return (
          <a
            key={resource.id}
            href={getResourceHref(resource)}
            target={resource.resourceUrl || resource.downloadUrl ? '_blank' : undefined}
            rel={resource.resourceUrl || resource.downloadUrl ? 'noopener noreferrer' : undefined}
            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeStyle.accent}`}>
                {typeStyle.icon}
              </div>

              <div className="ml-4 flex-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-base font-medium text-gray-900">
                    {resource.title}
                    <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{label}</span>
                </div>

                <p className="mt-1 text-sm text-gray-500 line-clamp-3">{resource.description}</p>

                <div className="mt-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 px-2 py-1 rounded-full">
                    {resource.category}
                  </span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
