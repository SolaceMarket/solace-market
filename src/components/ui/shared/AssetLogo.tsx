import Image from "next/image";

interface AssetLogoProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function AssetLogo({
  src,
  alt,
  width = 24,
  height = 24,
  className = "w-6 h-6",
}: AssetLogoProps) {
  if (!src) {
    // Fallback for assets without logos
    return (
      <div
        className={`bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold ${className}`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  // Handle logo identifiers by converting them to proper paths
  let logoSrc = src;
  let useFallback = false;

  if (!src.startsWith("/") && !src.startsWith("http")) {
    // Convert logo identifiers to proper paths
    switch (src) {
      case "apple":
        logoSrc = "/logos/apple.svg";
        break;
      case "bitcoin":
        logoSrc = "/logos/bitcoin.svg";
        break;
      case "microsoft":
        logoSrc = "/logos/microsoft.svg";
        break;
      case "tesla":
        logoSrc = "/logos/tesla_motors.svg";
        break;
      case "google":
        logoSrc = "/logos/google.svg";
        break;
      case "solana":
        logoSrc = "/logos/solana.svg";
        break;
      case "ethereum":
        // Ethereum doesn't have SVG, use fallback
        useFallback = true;
        break;
      default:
        // If it's an unknown identifier, show fallback
        useFallback = true;
        break;
    }
  }

  // Use fallback for assets without logo files
  if (useFallback) {
    const fallbackColors: { [key: string]: string } = {
      tesla: "bg-red-600",
      ethereum: "bg-blue-600",
    };

    const bgColor = fallbackColors[src] || "bg-gray-500";

    return (
      <div
        className={`${bgColor} rounded-full flex items-center justify-center text-white text-xs font-bold ${className}`}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
