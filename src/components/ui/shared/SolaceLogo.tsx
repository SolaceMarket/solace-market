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
      src="/metadata/SolaceMarket-logo_256x256.ico"
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
