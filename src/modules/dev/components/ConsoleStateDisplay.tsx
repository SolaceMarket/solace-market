"use client";

interface ConsoleStateProps {
  isLoaded: boolean;
  isVisible: boolean;
  isCommandPaletteOpen: boolean;
  directCommandPalette: boolean;
  toggleKey: string;
}

export function ConsoleStateDisplay({
  isLoaded,
  isVisible,
  isCommandPaletteOpen,
  directCommandPalette,
  toggleKey,
}: ConsoleStateProps) {
  if (!isLoaded) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs opacity-50 z-40">
        Loading Database Console...
      </div>
    );
  }

  if (!isVisible) {
    // In direct command palette mode, don't show the prompt when command palette is open
    if (directCommandPalette && isCommandPaletteOpen) {
      return null;
    }
    
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-xs opacity-50 hover:opacity-100 transition-opacity z-40">
        Press {toggleKey} to open{" "}
        {directCommandPalette ? "Command Palette" : "Database Console"}
      </div>
    );
  }

  return null;
}