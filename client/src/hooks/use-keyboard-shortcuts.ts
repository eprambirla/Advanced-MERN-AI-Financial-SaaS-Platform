import { useEffect, useRef } from "react";

type KeyCombination = {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
};

type ShortcutHandler = () => void;

interface ShortcutDefinition {
  combination: KeyCombination;
  handler: ShortcutHandler;
  preventDefault?: boolean;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutDefinition[]) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcutsRef.current) {
        const { combination, handler, preventDefault = true } = shortcut;

        const matchesKey = event.key.toLowerCase() === combination.key.toLowerCase();
        const matchesCtrl = (combination.ctrlKey || false) === event.ctrlKey;
        const matchesAlt = (combination.altKey || false) === event.altKey;
        const matchesShift = (combination.shiftKey || false) === event.shiftKey;
        const matchesMeta = (combination.metaKey || false) === event.metaKey;

        if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
          if (preventDefault) {
            event.preventDefault();
          }
          handler();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

export const COMMON_SHORTCUTS = {
  NEW_TRANSACTION: {
    combination: { key: "n", ctrlKey: true },
    description: "New transaction",
  },
  SEARCH: {
    combination: { key: "k", ctrlKey: true },
    description: "Search",
  },
  SAVE: {
    combination: { key: "s", ctrlKey: true },
    description: "Save",
  },
  EXPORT: {
    combination: { key: "e", ctrlKey: true, shiftKey: true },
    description: "Export",
  },
} as const;
