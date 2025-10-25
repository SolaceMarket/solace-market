interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Loader({ size = "lg", className = "" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-32 w-32",
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${className}`}
    >
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-blue-600`}
      ></div>
    </div>
  );
}
