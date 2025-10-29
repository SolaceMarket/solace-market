import type { Feature, FeatureColor } from "../data/features";

interface FeatureCardProps {
  feature: Feature;
  variant: "mobile" | "desktop";
}

export function FeatureCard({ feature, variant }: FeatureCardProps) {
  const { icon: Icon, title, shortTitle, description, color } = feature;

  const baseClasses = "backdrop-blur-sm rounded-lg transition-all duration-300";
  const colorClasses: Record<FeatureColor, string> = {
    teal: `border-teal-500/20 hover:border-teal-400/40 text-teal-400`,
    blue: `border-blue-500/20 hover:border-blue-400/40 text-blue-400`,
    emerald: `border-emerald-500/20 hover:border-emerald-400/40 text-emerald-400`,
  };

  if (variant === "mobile") {
    return (
      <div
        className={`bg-slate-800/20 border ${baseClasses} ${colorClasses[color].split(" ").slice(0, 2).join(" ")} p-5`}
      >
        <div className="flex items-center gap-4">
          <Icon
            className={`w-7 h-7 ${colorClasses[color].split(" ")[2]} flex-shrink-0`}
          />
          <div className="text-left">
            <h3 className="text-base text-white leading-tight">{shortTitle}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-800/40 border ${baseClasses} ${colorClasses[color].split(" ").slice(0, 2).join(" ")} p-6 text-center`}
    >
      <Icon
        className={`w-8 h-8 ${colorClasses[color].split(" ")[2]} mx-auto mb-4`}
      />
      <h3 className="text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
