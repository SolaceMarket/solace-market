import type { NewsItem } from "@/data/exchangeInfo";

interface NewsCardProps {
  news: NewsItem[];
  exchangeName: string;
}

export function NewsCard({ news, exchangeName }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market":
        return "bg-blue-100 text-blue-800";
      case "regulatory":
        return "bg-red-100 text-red-800";
      case "technology":
        return "bg-green-100 text-green-800";
      case "company":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Latest News</h3>
          <span className="text-sm text-gray-500">{exchangeName}</span>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {news.length > 0 ? (
          news.map((item) => (
            <div
              key={item.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}
                    >
                      {item.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{item.source}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <h4 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.summary}
                  </p>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="External link"
                  >
                    <title>External link</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <div className="text-4xl mb-2">📰</div>
            <p>No recent news available</p>
          </div>
        )}
      </div>
      {news.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all news →
          </button>
        </div>
      )}
    </div>
  );
}
