import { useEffect } from "react";
import { queryHistory } from "../queryHistory";

interface KeyboardShortcutsConfig {
  isVisible: boolean;
  isCommandPaletteOpen: boolean;
  directCommandPalette: boolean;
  toggleKey: string;
  closeKey: string;
  onToggle: () => void;
  onClose: () => void;
  onOpenCommandPalette: () => void;
}

export function useKeyboardShortcuts({
  isVisible,
  isCommandPaletteOpen,
  directCommandPalette,
  toggleKey,
  closeKey,
  onToggle,
  onClose,
  onOpenCommandPalette,
}: KeyboardShortcutsConfig) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Parse keyboard shortcut (simple implementation for Ctrl+M, Escape)
      const isToggleKey =
        toggleKey === "Ctrl+M" && event.key === "m" && event.ctrlKey;
      const isCloseKey = closeKey === "Escape" && event.key === "Escape";
      const isCommandPaletteKey = event.key === "k" && event.ctrlKey;

      if (isToggleKey) {
        event.preventDefault();
        
        if (directCommandPalette) {
          // Direct command palette mode: toggle command palette directly
          if (isVisible && isCommandPaletteOpen) {
            // Close everything
            onClose();
          } else {
            // Open console + command palette
            onToggle();
            onOpenCommandPalette();
            
            // Track user action
            queryHistory.addUserAction({
              type: "command_used",
              timestamp: Date.now(),
              data: { command: "open_command_palette", context: "direct_mode" }
            });
          }
        } else {
          // Default mode: toggle console UI
          onToggle();
        }
      }
      
      if (isCloseKey && isVisible && !isCommandPaletteOpen) {
        event.preventDefault();
        onClose();
      }
      
      if (isCommandPaletteKey && isVisible) {
        event.preventDefault();
        onOpenCommandPalette();
        
        // Track user action
        queryHistory.addUserAction({
          type: "command_used",
          timestamp: Date.now(),
          data: { command: "open_command_palette", context: "keyboard_shortcut" }
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isVisible,
    isCommandPaletteOpen,
    directCommandPalette,
    toggleKey,
    closeKey,
    onToggle,
    onClose,
    onOpenCommandPalette,
  ]);
}