import { useEffect, useState } from 'react';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info' | 'severe';
  title: string;
  message?: string;
  description?: string;
  date: string;
}

const alertStyles = {
  critical: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    body: 'text-red-700',
    meta: 'text-red-500',
  },
  severe: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-800',
    body: 'text-red-700',
    meta: 'text-red-500',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200',
    icon: 'text-amber-600',
    title: 'text-amber-800',
    body: 'text-amber-700',
    meta: 'text-amber-500',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-800',
    body: 'text-blue-700',
    meta: 'text-blue-500',
  },
} as const;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

export function EmergencyAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/alerts');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload: Alert[] = await response.json();
        setAlerts(payload.slice(0, 4));
        setError(null);
      } catch (err) {
        console.error('Error fetching emergency alerts:', err);
        setError('Failed to load alerts. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000);
    return () => clearInterval(interval);
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

  if (alerts.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No active alerts at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const variant = alertStyles[alert.type] || alertStyles.info;
        const body = alert.message || alert.description || '';

        return (
          <div key={alert.id} className={`p-4 rounded-lg border ${variant.container}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {alert.type === 'critical' || alert.type === 'severe' ? (
                  <svg className={`w-5 h-5 ${variant.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : alert.type === 'warning' ? (
                  <svg className={`w-5 h-5 ${variant.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className={`w-5 h-5 ${variant.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>

              <div className="ml-3 flex-1">
                <h3 className={`text-sm font-medium ${variant.title}`}>{alert.title}</h3>
                <div className={`mt-2 text-sm ${variant.body}`}>{body}</div>
                <div className={`mt-2 text-xs ${variant.meta}`}>{formatDate(alert.date)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
