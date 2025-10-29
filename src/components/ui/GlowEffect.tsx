"use client";

import type { ReactNode } from "react";

interface GlowEffectProps {
  children: ReactNode;
  /** Type of glow effect */
  variant?: "logo" | "button" | "modal" | "text";
  /** Glow color theme */
  glowColor?: "emerald" | "blue" | "purple" | "white";
  /** Intensity of the glow effect */
  intensity?: "subtle" | "normal" | "strong";
  /** Additional CSS classes */
  className?: string;
}

export function GlowEffect({
  children,
  variant = "logo",
  glowColor = "emerald",
  intensity = "normal",
  className = "",
}: GlowEffectProps) {
  const getGlowClasses = () => {
    const baseGlow = {
      emerald: "bg-emerald-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      white: "bg-white",
    };

    const intensityMap = {
      subtle: { opacity: "10", blur: "blur-lg", scale: "scale-105" },
      normal: { opacity: "20", blur: "blur-xl", scale: "scale-110" },
      strong: { opacity: "30", blur: "blur-2xl", scale: "scale-125" },
    };

    const selectedIntensity = intensityMap[intensity];
    const selectedColor = baseGlow[glowColor];

    switch (variant) {
      case "logo":
        return {
          wrapper: "relative",
          glow: `absolute inset-0 ${selectedColor}/${selectedIntensity.opacity} rounded-full ${selectedIntensity.blur} ${selectedIntensity.scale} md:w-20 md:h-20 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2`,
          content: "relative z-10 drop-shadow-2xl",
        };

      case "button":
        return {
          wrapper: "relative group",
          glow: `absolute -inset-1 bg-gradient-to-r from-${glowColor}-600 to-${glowColor}-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300`,
          content: "relative",
        };

      case "modal":
        return {
          wrapper: "relative",
          glow: `absolute -inset-2 bg-gradient-to-r from-${glowColor}-500/20 to-blue-500/20 rounded-xl blur-sm`,
          content: "relative",
        };

      case "text":
        return {
          wrapper: "",
          glow: "",
          content: `drop-shadow-lg`,
          textShadow: `0 0 20px rgba(16, 185, 129, 0.3)`,
        };

      default:
        return {
          wrapper: "relative",
          glow: `absolute inset-0 ${selectedColor}/${selectedIntensity.opacity} ${selectedIntensity.blur}`,
          content: "relative z-10",
        };
    }
  };

  const glowClasses = getGlowClasses();

  if (variant === "text") {
    return (
      <div
        className={`${glowClasses.content} ${className}`}
        style={{ textShadow: glowClasses.textShadow }}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={`${glowClasses.wrapper} ${className}`}>
      {glowClasses.glow && <div className={glowClasses.glow} />}
      <div className={glowClasses.content}>{children}</div>
    </div>
  );
}
