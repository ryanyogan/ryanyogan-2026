import { useEffect, useCallback } from "react";

type KeyCombo = {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
};

type ShortcutHandler = (event: KeyboardEvent) => void;

/**
 * Hook for handling keyboard shortcuts
 * @param combo - Key combination to listen for
 * @param handler - Callback when shortcut is pressed
 * @param enabled - Whether the shortcut is active (default: true)
 */
export function useKeyboardShortcut(
  combo: KeyCombo | KeyCombo[],
  handler: ShortcutHandler,
  enabled: boolean = true
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const combos = Array.isArray(combo) ? combo : [combo];

      for (const c of combos) {
        const metaMatch = c.meta ? event.metaKey : !event.metaKey;
        const ctrlMatch = c.ctrl ? event.ctrlKey : !event.ctrlKey;
        const shiftMatch = c.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = c.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === c.key.toLowerCase();

        // Special handling for Cmd+K / Ctrl+K
        if (c.meta && c.ctrl === undefined) {
          // If meta is specified, also accept ctrl (for cross-platform)
          const modifierMatch = event.metaKey || event.ctrlKey;
          if (modifierMatch && shiftMatch && altMatch && keyMatch) {
            event.preventDefault();
            handler(event);
            return;
          }
        }

        if (metaMatch && ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          handler(event);
          return;
        }
      }
    },
    [combo, handler]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
}

/**
 * Hook for CMD+K / Ctrl+K shortcut (commonly used for command palettes)
 */
export function useCommandK(handler: ShortcutHandler, enabled: boolean = true) {
  useKeyboardShortcut({ key: "k", meta: true }, handler, enabled);
}

/**
 * Hook for Escape key
 */
export function useEscape(handler: ShortcutHandler, enabled: boolean = true) {
  useKeyboardShortcut({ key: "Escape" }, handler, enabled);
}
