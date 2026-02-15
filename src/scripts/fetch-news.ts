// Fetch local news from RSS feeds

interface NewsArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

interface NewsData {
  timestamp: string;
  articles: NewsArticle[];
}

const NEWS_SOURCES = [
  {
    name: 'Chronicle-Telegram',
    url: 'https://www.chroniclet.com/rss.xml',
  },
  {
    name: 'Cleveland.com - Lorain',
    url: 'https://www.cleveland.com/lorain/index.ssf/rss.xml',
  }
];

const CACHE_FILE = 'data/news/latest.json';

async function fetchRSS(url: string): Promise<any> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const xml = await response.text();
    return xml;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

function parseRSS(xml: string, sourceName: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  
  // Simple regex parsing (good enough for RSS)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const items = xml.match(itemRegex) || [];
  
  for (const item of items.slice(0, 5)) { // Max 5 per source
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
    const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
    
    if (titleMatch && linkMatch) {
      articles.push({
        title: (titleMatch[1] || titleMatch[2] || '').trim(),
        link: linkMatch[1].trim(),
        description: (descMatch?.[1] || descMatch?.[2] || '').trim().substring(0, 200),
        pubDate: dateMatch?.[1] || new Date().toISOString(),
        source: sourceName
      });
    }
  }
  
  return articles;
}

async function fetchNews(): Promise<NewsData> {
  const allArticles: NewsArticle[] = [];
  
  for (const source of NEWS_SOURCES) {
    console.log(`Fetching ${source.name}...`);
    const xml = await fetchRSS(source.url);
    if (xml) {
      const articles = parseRSS(xml, source.name);
      allArticles.push(...articles);
    }
  }
  
  // Sort by date, newest first
  allArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });
  
  // Take top 10
  const newsData: NewsData = {
    timestamp: new Date().toISOString(),
    articles: allArticles.slice(0, 10)
  };
  
  // Try to load cached data if fetch failed
  if (allArticles.length === 0) {
    try {
      const fs = await import('fs/promises');
      const cached = await fs.readFile(CACHE_FILE, 'utf-8');
      return JSON.parse(cached);
    } catch (e) {
      return {
        timestamp: new Date().toISOString(),
        articles: []
      };
    }
  }
  
  return newsData;
}

// Export for use in Astro pages
export { fetchNews };
export type { NewsData, NewsArticle };

// CLI usage (for cron jobs)
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchNews().then(async (data) => {
    const fs = await import('fs/promises');
    await fs.mkdir('data/news', { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log(`Fetched ${data.articles.length} articles`);
  }).catch(console.error);
}
