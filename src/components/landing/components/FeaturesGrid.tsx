import { FEATURES } from "../data/features";
import { FeatureCard } from "./FeatureCard";

interface FeaturesGridProps {
  shouldShowDesktopOnly: boolean;
}

export function FeaturesGrid({ shouldShowDesktopOnly }: FeaturesGridProps) {
  return (
    <div className="mb-8">
      {/* Mobile: Vertical stack - hidden on server for SEO */}
      {!shouldShowDesktopOnly && (
        <div className="md:hidden max-w-md mx-auto">
          {FEATURES.map((feature, index) => {
            const borderTop = index <= FEATURES.length - 1;
            const borderBottom = index === FEATURES.length - 1;

            const borderTopLeftRadius = index === 0;
            const borderTopRightRadius = index === 0;
            const borderBottomLeftRadius = index === FEATURES.length - 1;
            const borderBottomRightRadius = index === FEATURES.length - 1;

            return (
              <FeatureCard
                key={feature.id}
                feature={feature}
                variant="mobile"
                borderTop={borderTop}
                borderBottom={borderBottom}
                borderTopLeftRadius={borderTopLeftRadius}
                borderTopRightRadius={borderTopRightRadius}
                borderBottomLeftRadius={borderBottomLeftRadius}
                borderBottomRightRadius={borderBottomRightRadius}
              />
            );
          })}
        </div>
      )}

      {/* Desktop: Horizontal grid - always shown on server for SEO */}
      <div
        className={
          shouldShowDesktopOnly
            ? "grid grid-cols-3 gap-6 max-w-5xl mx-auto"
            : "hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        }
      >
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} variant="desktop" />
        ))}
      </div>
    </div>
  );
}
