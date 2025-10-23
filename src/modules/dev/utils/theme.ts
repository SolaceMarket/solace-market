interface ThemeSettings {
  terminalMode: boolean;
  fontSize: "xs" | "sm" | "base" | "lg";
  fontFamily: "mono" | "sans" | "serif";
}

export function getThemeClasses(theme: ThemeSettings): string {
  const baseClasses = theme.terminalMode
    ? "bg-gray-900 text-green-400"
    : "bg-white text-gray-900";

  const fontSizeClass = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
  }[theme.fontSize];

  const fontFamilyClass = {
    mono: "font-mono",
    sans: "font-sans",
    serif: "font-serif",
  }[theme.fontFamily];

  return `${baseClasses} ${fontFamilyClass} ${fontSizeClass}`;
}