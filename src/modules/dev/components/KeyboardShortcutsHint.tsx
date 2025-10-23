"use client";

interface KeyboardShortcutsHintProps {
  toggleKey: string;
  directCommandPalette: boolean;
}

export function KeyboardShortcutsHint({
  toggleKey,
  directCommandPalette,
}: KeyboardShortcutsHintProps) {
  return (
    <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded backdrop-blur-sm">
      Press{" "}
      <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">ESC</kbd> to
      close •{" "}
      <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
        {toggleKey}
      </kbd>{" "}
      {directCommandPalette ? "command palette" : "to toggle"}
      {!directCommandPalette && (
        <>
          {" • "}
          <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">
            Ctrl+K
          </kbd>{" "}
          command palette
        </>
      )}
    </div>
  );
}