import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Feature, FeatureColor } from "../data/features";

export const Marquee = ({
  children,
  heightClass = "h-8",
}: {
  children: React.ReactNode;
  heightClass?: string;
}) => {
  const MARQUEE_SPEED = 60; // px per second

  const rowRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(18); // fallback duration

  useEffect(() => {
    const recalc = () => {
      if (rowRef.current) {
        const rowWidth = rowRef.current.offsetWidth;
        const calculated = (rowWidth * 2) / MARQUEE_SPEED;
        setDuration(calculated);
      }
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  return (
    <div className={`overflow-hidden w-full relative ${heightClass}`}>
      <div
        ref={rowRef}
        className="flex gap-2 animate-marquee"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          whiteSpace: "nowrap",
          animationDuration: `${duration}s`,
          willChange: "transform",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};

interface FeatureCardProps {
  feature: Feature;
  variant: "mobile" | "desktop";
  borderTop?: boolean;
  borderBottom?: boolean;
  borderTopLeftRadius?: boolean;
  borderTopRightRadius?: boolean;
  borderBottomLeftRadius?: boolean;
  borderBottomRightRadius?: boolean;
}

export function FeatureCard({
  feature,
  variant,
  borderTop,
  borderBottom,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
}: FeatureCardProps) {
  const { icon: Icon, color } = feature;
  const displayTitle =
    "title" in feature
      ? ((feature as { title?: string }).title ??
        ("shortTitle" in feature
          ? ((feature as { shortTitle?: string }).shortTitle ?? "")
          : ""))
      : "shortTitle" in feature
        ? ((feature as { shortTitle?: string }).shortTitle ?? "")
        : "";

  const subtitle =
    "subtitle" in feature
      ? ((feature as { subtitle?: string }).subtitle ??
        ("shortTitle" in feature
          ? ((feature as { shortTitle?: string }).shortTitle ?? "")
          : ""))
      : "shortTitle" in feature
        ? ((feature as { shortTitle?: string }).shortTitle ?? "")
        : "";

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
        style={{
          borderTopWidth: borderTop ? 1 : 0,
          ...(!borderTopLeftRadius && { borderTopLeftRadius: 0 }),
          ...(!borderTopRightRadius && { borderTopRightRadius: 0 }),
          ...(!borderBottomLeftRadius && { borderBottomLeftRadius: 0 }),
          ...(!borderBottomRightRadius && { borderBottomRightRadius: 0 }),
          borderBottomWidth: borderBottom ? 1 : 0,
        }}
      >
        <div className="flex items-start gap-4">
          {feature.showIcon && (
            <Icon
              className={`w-7 h-7 ${colorClasses[color].split(" ")[2]} flex-shrink-0 mt-0.5`}
            />
          )}
          <div className="text-left flex-1">
            <h3 className="text-base text-white font-bold leading-tight mb-1">
              {displayTitle}
            </h3>
            <div className="text-sm text-gray-300 mb-2">{subtitle}</div>
            {/* Display logos for trading feature */}
            {"logos" in feature && feature.logos && (
              <Marquee heightClass="h-8">
                {feature.logos.map((logo) => (
                  <div
                    key={logo.name}
                    className="w-7 h-7 bg-white/10 border border-indigo-500 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={16}
                      height={16}
                      className="opacity-90"
                    />
                  </div>
                ))}
              </Marquee>
            )}
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
        className={`w-8 h-8 ${colorClasses[color].split(" ")[2]} mx-auto mb-3`}
      />
      <h3 className="text-lg text-white font-bold mb-1">{displayTitle}</h3>
      <div className="text-sm text-gray-300 mb-2">
        {feature.description ?? subtitle}
      </div>
      {/* Display logos for trading feature */}
      {"logos" in feature && feature.logos && (
        <Marquee heightClass="h-10">
          {feature.logos.map((logo) => (
            <div
              key={logo.name}
              className="w-8 h-8 bg-white/10 border border-indigo-500 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0 mx-2"
              title={logo.name}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={20}
                height={20}
                className="opacity-90"
              />
            </div>
          ))}
        </Marquee>
      )}
    </div>
  );
}
