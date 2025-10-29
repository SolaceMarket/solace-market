"use client";

import { ArrowLeft, Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  showSearchButton?: boolean;
  onSearchClick?: () => void;
  searchTitle?: string;
  showBackText?: boolean;
  centerTitle?: boolean;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  filterTitle?: string;
  rightAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  };
}

export function PageHeader({
  title,
  showBackButton = false,
  backUrl = "/assets-list",
  showSearchButton = false,
  onSearchClick,
  searchTitle = "Search",
  showBackText = true,
  centerTitle = true,
  showFilterButton = false,
  onFilterClick,
  filterTitle = "Filter",
  rightAction,
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
      <div className="flex items-center justify-between w-full relative">
        {/* Left Side - Back Button, Filter Button, or Spacer */}
        <div className="flex items-center space-x-3">
          {showBackButton ? (
            <button
              type="button"
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors z-10"
            >
              <ArrowLeft className="w-6 h-6" />
              {showBackText && (
                <span className="text-sm font-medium">Back</span>
              )}
            </button>
          ) : showFilterButton ? (
            <button
              type="button"
              onClick={onFilterClick}
              className="text-gray-400 hover:text-white transition-colors z-10"
              title={filterTitle}
            >
              <Filter className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-6" /> // Spacer for alignment
          )}
        </div>

        {/* Centered Title */}
        {centerTitle ? (
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
        ) : (
          <div className={`flex items-center ${showBackButton ? "ml-4" : ""}`}>
            <h1 className="text-xl font-semibold text-white">{title}</h1>
          </div>
        )}

        {/* Right Side - Search Button, Right Action, or Spacer */}
        <div className="flex items-center">
          {showSearchButton ? (
            <button
              type="button"
              onClick={onSearchClick}
              className="text-gray-400 hover:text-white transition-colors z-10"
              title={searchTitle}
            >
              <Search className="w-6 h-6" />
            </button>
          ) : rightAction ? (
            <button
              type="button"
              onClick={rightAction.onClick}
              className={`z-10 transition-colors ${
                rightAction.variant === "primary"
                  ? "text-blue-400 hover:text-blue-300"
                  : rightAction.variant === "danger"
                    ? "text-red-400 hover:text-red-300"
                    : "text-gray-400 hover:text-white"
              }`}
            >
              {rightAction.label}
            </button>
          ) : (
            <div className="w-6" /> // Spacer for alignment
          )}
        </div>
      </div>
    </div>
  );
}
