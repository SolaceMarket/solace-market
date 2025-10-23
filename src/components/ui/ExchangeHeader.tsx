import type { ExchangeInfo } from "@/data/exchangeInfo";

interface ExchangeHeaderProps {
  exchangeInfo: ExchangeInfo;
  currentRank: number;
  totalExchanges: number;
}

export function ExchangeHeader({
  exchangeInfo,
  currentRank,
  totalExchanges,
}: ExchangeHeaderProps) {
  const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
    const icons = {
      twitter: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-label="Twitter"
        >
          <title>Twitter</title>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      linkedin: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-label="LinkedIn"
        >
          <title>LinkedIn</title>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      facebook: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-label="Facebook"
        >
          <title>Facebook</title>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      youtube: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-label="YouTube"
        >
          <title>YouTube</title>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    };

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        {icons[platform as keyof typeof icons]}
      </a>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="p-8">
        <div className="flex items-start space-x-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {exchangeInfo.code}
              </span>
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {exchangeInfo.fullName}
                </h1>
                <p className="mt-1 text-lg text-gray-600">
                  Ranked #{currentRank} of {totalExchanges} exchanges
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Exchange Code</div>
                <div className="text-2xl font-bold text-gray-900">
                  {exchangeInfo.code}
                </div>
              </div>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed">
              {exchangeInfo.description}
            </p>

            {/* Key Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Founded</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {exchangeInfo.founded}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Headquarters
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {exchangeInfo.headquarters}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Market Cap
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {exchangeInfo.marketCap}
                </dd>
              </div>
            </div>

            {/* Trading Hours */}
            <div className="mt-6">
              <dt className="text-sm font-medium text-gray-500">
                Trading Hours
              </dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900">
                {exchangeInfo.tradingHours.open} -{" "}
                {exchangeInfo.tradingHours.close}{" "}
                {exchangeInfo.tradingHours.timezone}
              </dd>
            </div>

            {/* Social Media & Website */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-500">
                  Follow us:
                </span>
                <div className="flex space-x-3">
                  {Object.entries(exchangeInfo.socialMedia).map(
                    ([platform, url]) =>
                      url ? (
                        <SocialIcon
                          key={platform}
                          platform={platform}
                          url={url}
                        />
                      ) : null,
                  )}
                </div>
              </div>
              <a
                href={exchangeInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                Visit Website
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
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
        </div>
      </div>
    </div>
  );
}
