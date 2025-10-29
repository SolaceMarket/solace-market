"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderNavigationProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backHref?: string;
  backLabel?: string;
  showBack?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function HeaderNavigation({
  title,
  subtitle,
  onBack,
  backHref,
  backLabel = "Back",
  showBack = true,
  className = "",
  children,
}: HeaderNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className={`bg-slate-900 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4 flex-1">
            {showBack && (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">{backLabel}</span>
              </button>
            )}

            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>

            {/* Spacer to keep title centered when back button is present */}
            {showBack && <div className="w-16" />}
          </div>

          {children && <div className="ml-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}
