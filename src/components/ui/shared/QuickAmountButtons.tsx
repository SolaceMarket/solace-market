"use client";

interface QuickAmountButtonsProps {
  amounts?: string[];
  onAmountSelect: (amount: string) => void;
  label?: string;
  className?: string;
}

export function QuickAmountButtons({
  amounts = ["0.1", "0.5", "1", "5"],
  onAmountSelect,
  label = "Quick amounts:",
  className = "",
}: QuickAmountButtonsProps) {
  return (
    <div className={className}>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <div className="flex space-x-2">
        {amounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onAmountSelect(amount)}
            className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            {amount}
          </button>
        ))}
      </div>
    </div>
  );
}
