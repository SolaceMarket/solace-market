import { Filter, X } from "lucide-react";

interface FilterModalHeaderProps {
  onClose: () => void;
}

export function FilterModalHeader({ onClose }: FilterModalHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-slate-700">
      <div className="flex items-center space-x-3">
        <Filter className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-semibold text-white">
          Filter & Sort Assets
        </h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
