"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  backHref?: string;
  showBack?: boolean;
  className?: string;
  rightContent?: React.ReactNode;
}

export function MobileHeader({
  title,
  onBack,
  backHref,
  showBack = true,
  className = "",
  rightContent,
}: MobileHeaderProps) {
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
    <div className={`bg-slate-900 text-white relative ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back Button */}
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}

        {/* Centered Title */}
        <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        {/* Right Content */}
        <div className="z-10">{rightContent}</div>

        {/* Spacer when no back button */}
        {!showBack && <div />}
      </div>
    </div>
  );
}
