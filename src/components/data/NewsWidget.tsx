import React, { useEffect, useState } from 'react';

interface NewsItem {
  title: string;
  description: string;
  pubDate: string;
  link: string;
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cleanDescription = (html: string): string => {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove images
    const images = temp.getElementsByTagName('img');
    while (images.length > 0) {
      images[0].parentNode?.removeChild(images[0]);
    }
    
    // Get text content and trim it
    let text = temp.textContent || '';
    text = text.trim();
    
    // Limit to ~150 characters and add ellipsis if needed
    return text.length > 150 ? text.substring(0, 147) + '...' : text;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rss');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        const newsItems = Array.from(items).map(item => ({
          title: item.querySelector("title")?.textContent || "",
          description: cleanDescription(item.querySelector("description")?.textContent || ""),
          pubDate: item.querySelector("pubDate")?.textContent || "",
          link: item.querySelector("link")?.textContent || ""
        }));

        setNews(newsItems);
        setError(null);
      } catch (err) {
        setError('Failed to load news. Please try again later.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh news every 5 minutes
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
      {news.map((item, index) => (
        <article 
          key={index} 
          className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-medium text-gray-900 mb-2">
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600"
            >
              {item.title}
            </a>
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {item.description}
          </p>
          <time 
            dateTime={new Date(item.pubDate).toISOString()}
            className="text-xs text-gray-500"
          >
            {new Date(item.pubDate).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
        </article>
      ))}
    </div>
  );
}
