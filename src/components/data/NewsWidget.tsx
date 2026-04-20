import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category?: string;
}

interface NewsResponse {
  data?: {
    news?: NewsItem[];
  };
}

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Recently updated'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const payload: NewsResponse = await response.json();
        const items = [...(payload.data?.news || [])]
          .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
          .slice(0, 5);

        setNews(items);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
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

  if (news.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <article
          key={item.id}
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            {item.category ? (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 px-2 py-1 rounded-full">
                {item.category.replace(/-/g, ' ')}
              </span>
            ) : (
              <span />
            )}
            <time className="text-xs text-gray-500">{formatDate(item.date)}</time>
          </div>

          <h3 className="font-medium text-gray-900 mb-2">
            <a href={`/news/${item.id}`} className="hover:text-primary-600">
              {item.title}
            </a>
          </h3>

          <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
