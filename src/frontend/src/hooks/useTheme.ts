import { useEffect } from "react";
import { useEditorStore } from "../store/editorStore";

/**
 * Syncs the Zustand theme state with the DOM `.dark` class.
 * Call once at the app root level.
 */
export function useTheme() {
  const theme = useEditorStore((s) => s.theme);
  const setTheme = useEditorStore((s) => s.setTheme);
  const toggleTheme = useEditorStore((s) => s.toggleTheme);

  // Apply class on mount + whenever theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme };
}
