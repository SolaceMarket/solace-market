"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { TabBar } from "@/components/ui/layout/TabBar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  showSearch?: boolean;
  onSearchClick?: () => void;
  searchTitle?: string;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  filterTitle?: string;
  rightAction?: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  };
  customHeader?: ReactNode;
  showTabBar?: boolean;
}

export function AppLayout({
  children,
  title,
  showBackButton = false,
  backUrl,
  showSearch = false,
  onSearchClick,
  searchTitle,
  showFilterButton = false,
  onFilterClick,
  filterTitle,
  rightAction,
  customHeader,
  showTabBar = true,
}: AppLayoutProps) {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <div className="h-20 flex-shrink-0 w-full">
        {customHeader || (
          <PageHeader
            title={title}
            showBackButton={showBackButton}
            backUrl={backUrl}
            showSearchButton={showSearch}
            onSearchClick={onSearchClick}
            searchTitle={searchTitle}
            showFilterButton={showFilterButton}
            onFilterClick={onFilterClick}
            filterTitle={filterTitle}
            rightAction={rightAction}
          />
        )}
      </div>

      {/* Content - Fills remaining space and is scrollable */}
      <div className="flex-1 w-full overflow-x-hidden overflow-y-auto scrollbar-thin">
        {children}
      </div>

      {/* Tab Bar - Fixed height */}
      {showTabBar && (
        <div className="h-20 flex-shrink-0 w-full">
          <TabBar />
        </div>
      )}
    </div>
  );
}
