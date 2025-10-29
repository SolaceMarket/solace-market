import Image from "next/image";

interface SolaceLogoProps {
  size?: number;
  className?: string;
  alt?: string;
}

export function SolaceLogo({
  size = 32,
  className = "",
  alt = "Solace Market Logo",
}: SolaceLogoProps) {
  return (
    <Image
      src="/metadata/SolaceMarket-logo_256x256.webp"
      alt={alt}
      width={size}
      height={size}
      className={className}
      priority
      placeholder="blur"
      blurDataURL="data:image/webp;base64,UklGRnoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA"
    />
  );
}
