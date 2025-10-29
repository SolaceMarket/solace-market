"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  showSearchButton?: boolean;
  onSearchClick?: () => void;
  searchTitle?: string;
}

export function PageHeader({
  title,
  showBackButton = false,
  backUrl = "/assets-list",
  showSearchButton = false,
  onSearchClick,
  searchTitle = "Search",
}: PageHeaderProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="h-full bg-slate-900/90 backdrop-blur border-b border-slate-700 px-6 py-4 flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <button
              type="button"
              onClick={handleBackClick}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
        </div>

        {showSearchButton && (
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onSearchClick}
              className="text-gray-400 hover:text-white transition-colors"
              title={searchTitle}
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
