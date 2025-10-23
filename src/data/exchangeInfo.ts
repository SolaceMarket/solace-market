export interface ExchangeInfo {
  code: string;
  fullName: string;
  description: string;
  logo: string;
  website: string;
  founded: number;
  headquarters: string;
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
  marketCap?: string;
  tradingHours: {
    open: string;
    close: string;
    timezone: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  publishedAt: string;
  source: string;
  url: string;
  category: "market" | "regulatory" | "technology" | "company";
}

// Exchange information database
export const exchangeData: Record<string, ExchangeInfo> = {
  NYSE: {
    code: "NYSE",
    fullName: "New York Stock Exchange",
    description:
      "The New York Stock Exchange (NYSE) is the world's largest stock exchange by market capitalization of its listed companies. Located on Wall Street in New York City, it has been the center of American financial markets since 1792.",
    logo: "/logos/nyse.png",
    website: "https://www.nyse.com",
    founded: 1792,
    headquarters: "New York City, NY, USA",
    socialMedia: {
      twitter: "https://twitter.com/NYSE",
      linkedin: "https://linkedin.com/company/nyse",
      facebook: "https://facebook.com/NYSE",
      youtube: "https://youtube.com/NYSE",
    },
    marketCap: "$30+ trillion",
    tradingHours: {
      open: "09:30",
      close: "16:00",
      timezone: "ET",
    },
  },
  NASDAQ: {
    code: "NASDAQ",
    fullName: "NASDAQ Stock Market",
    description:
      "NASDAQ is a global electronic marketplace for buying and selling securities. Known for its technology focus, it's home to many of the world's leading technology companies including Apple, Microsoft, and Amazon.",
    logo: "/logos/nasdaq.png",
    website: "https://www.nasdaq.com",
    founded: 1971,
    headquarters: "New York City, NY, USA",
    socialMedia: {
      twitter: "https://twitter.com/NASDAQ",
      linkedin: "https://linkedin.com/company/nasdaq",
      facebook: "https://facebook.com/NASDAQ",
      youtube: "https://youtube.com/NASDAQ",
    },
    marketCap: "$20+ trillion",
    tradingHours: {
      open: "09:30",
      close: "16:00",
      timezone: "ET",
    },
  },
  ARCA: {
    code: "ARCA",
    fullName: "NYSE Arca",
    description:
      "NYSE Arca is a fully electronic stock exchange in the United States. It was formed in 2006 through the merger of Archipelago Exchange and the Pacific Exchange. Known for ETF trading and high-frequency trading capabilities.",
    logo: "/logos/arca.png",
    website: "https://www.nyse.com/markets/nyse-arca",
    founded: 2006,
    headquarters: "New York City, NY, USA",
    socialMedia: {
      twitter: "https://twitter.com/NYSE",
      linkedin: "https://linkedin.com/company/nyse",
    },
    marketCap: "$5+ trillion",
    tradingHours: {
      open: "04:00",
      close: "20:00",
      timezone: "ET",
    },
  },
  OTC: {
    code: "OTC",
    fullName: "Over-the-Counter Markets",
    description:
      "Over-the-counter (OTC) markets are decentralized markets where securities not listed on major exchanges are traded directly between parties. OTC markets provide access to emerging companies and international securities.",
    logo: "/logos/otc.png",
    website: "https://www.otcmarkets.com",
    founded: 1913,
    headquarters: "New York City, NY, USA",
    socialMedia: {
      twitter: "https://twitter.com/OTCMarkets",
      linkedin: "https://linkedin.com/company/otc-markets-group",
    },
    marketCap: "$1+ trillion",
    tradingHours: {
      open: "09:30",
      close: "16:00",
      timezone: "ET",
    },
  },
};

// Mock news data (in a real app, this would come from an API)
export const getExchangeNews = async (
  exchangeCode: string,
): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const mockNews: Record<string, NewsItem[]> = {
    NYSE: [
      {
        id: "1",
        title: "NYSE Announces New Trading Technology Upgrade",
        summary:
          "The New York Stock Exchange announced a major technology upgrade that will reduce latency and improve trading efficiency for all market participants.",
        publishedAt: "2024-10-15T10:30:00Z",
        source: "Financial Times",
        url: "https://example.com/news/1",
        category: "technology",
      },
      {
        id: "2",
        title: "Record Trading Volume on NYSE This Quarter",
        summary:
          "NYSE reports record-breaking trading volumes as market volatility increases amid global economic uncertainty.",
        publishedAt: "2024-10-14T14:20:00Z",
        source: "Reuters",
        url: "https://example.com/news/2",
        category: "market",
      },
      {
        id: "3",
        title: "New ESG Listing Requirements Take Effect",
        summary:
          "NYSE implements new environmental, social, and governance reporting requirements for all listed companies.",
        publishedAt: "2024-10-13T09:15:00Z",
        source: "Bloomberg",
        url: "https://example.com/news/3",
        category: "regulatory",
      },
    ],
    NASDAQ: [
      {
        id: "4",
        title: "NASDAQ Leads in Tech IPO Listings This Year",
        summary:
          "NASDAQ continues to dominate technology company listings with over 70% of tech IPOs choosing the exchange.",
        publishedAt: "2024-10-15T11:45:00Z",
        source: "TechCrunch",
        url: "https://example.com/news/4",
        category: "market",
      },
      {
        id: "5",
        title: "AI-Powered Market Surveillance System Launched",
        summary:
          "NASDAQ deploys new artificial intelligence system to monitor trading patterns and detect market manipulation.",
        publishedAt: "2024-10-14T16:30:00Z",
        source: "Wall Street Journal",
        url: "https://example.com/news/5",
        category: "technology",
      },
    ],
  };

  return mockNews[exchangeCode] || [];
};
