export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  categories?: string[];
}

export async function fetchRssFeed(url: string): Promise<RssItem[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    return Array.from(items).map(item => ({
      title: item.querySelector("title")?.textContent || "",
      link: item.querySelector("link")?.textContent || "",
      description: item.querySelector("description")?.textContent || "",
      pubDate: item.querySelector("pubDate")?.textContent || "",
      author: item.querySelector("author")?.textContent,
      categories: Array.from(item.querySelectorAll("category")).map(cat => cat.textContent || "")
    }));
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
}
