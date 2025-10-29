"use client";

interface IlluminationBackgroundProps {
  /** Background color for the dotted pattern */
  backgroundColor?: string;
  /** Size of the dotted pattern */
  dotSize?: string;
  /** Spacing between dots */
  dotSpacing?: string;
  /** Primary glow color theme */
  glowTheme?: "emerald" | "blue" | "purple" | "mixed";
  /** Number of floating particles */
  particleCount?: "minimal" | "normal" | "abundant";
}

export function IlluminationBackground({
  backgroundColor = "#1a1b23",
  dotSize = "1px",
  dotSpacing = "24px",
  glowTheme = "mixed",
  particleCount = "normal",
}: IlluminationBackgroundProps) {
  const getGlowColors = () => {
    switch (glowTheme) {
      case "emerald":
        return {
          primary: "bg-emerald-500/10",
          secondary: "bg-emerald-400/8",
          tertiary: "bg-emerald-600/6",
        };
      case "blue":
        return {
          primary: "bg-blue-500/10",
          secondary: "bg-blue-400/8",
          tertiary: "bg-blue-600/6",
        };
      case "purple":
        return {
          primary: "bg-purple-500/10",
          secondary: "bg-purple-400/8",
          tertiary: "bg-purple-600/6",
        };
      default: // mixed
        return {
          primary: "bg-emerald-500/10",
          secondary: "bg-blue-500/8",
          tertiary: "bg-purple-500/6",
        };
    }
  };

  const getParticles = () => {
    const baseParticles = [
      {
        position: "top-1/5 left-1/5",
        size: "w-2 h-2",
        color: "bg-emerald-400/40",
        duration: "6s",
      },
      {
        position: "top-3/4 left-1/3",
        size: "w-1 h-1",
        color: "bg-blue-400/50",
        duration: "4s",
      },
    ];

    const normalParticles = [
      ...baseParticles,
      {
        position: "top-2/5 right-1/5",
        size: "w-1.5 h-1.5",
        color: "bg-purple-400/40",
        duration: "5s",
      },
      {
        position: "bottom-1/5 left-1/2",
        size: "w-1 h-1",
        color: "bg-emerald-300/30",
        duration: "7s",
      },
    ];

    const abundantParticles = [
      ...normalParticles,
      {
        position: "top-1/3 right-1/3",
        size: "w-1 h-1",
        color: "bg-blue-300/35",
        duration: "5.5s",
      },
      {
        position: "bottom-1/3 left-1/4",
        size: "w-1.5 h-1.5",
        color: "bg-purple-300/25",
        duration: "6.5s",
      },
    ];

    switch (particleCount) {
      case "minimal":
        return baseParticles;
      case "abundant":
        return abundantParticles;
      default:
        return normalParticles;
    }
  };

  const glowColors = getGlowColors();
  const particles = getParticles();

  return (
    <>
      {/* Enhanced Background with dotted pattern */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `
            radial-gradient(circle, rgba(255,255,255,0.1) ${dotSize}, transparent ${dotSize})
          `,
          backgroundSize: `${dotSpacing} ${dotSpacing}`,
          backgroundColor,
        }}
      />

      {/* Animated glowing orbs for illumination */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large background glows */}
        <div
          className={`absolute top-1/4 left-1/4 w-96 h-96 ${glowColors.primary} rounded-full blur-3xl animate-pulse`}
          style={{
            animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 ${glowColors.secondary} rounded-full blur-3xl animate-pulse`}
          style={{
            animation: "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite reverse",
          }}
        />
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 ${glowColors.tertiary} rounded-full blur-3xl animate-pulse`}
          style={{
            animation: "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />

        {/* Floating particles */}
        {particles.map((particle, index) => (
          <div
            key={`particle-${particle.position}-${particle.color}`}
            className={`absolute ${particle.position} ${particle.size} ${particle.color} rounded-full animate-pulse`}
            style={{
              animation: `pulse ${particle.duration} ease-in-out infinite ${index % 2 === 0 ? "" : "reverse"}`,
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(15, 23, 42, 0.3) 70%, rgba(15, 23, 42, 0.6) 100%)",
        }}
      />
    </>
  );
}
