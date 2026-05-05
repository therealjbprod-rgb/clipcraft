import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";
import { useEditorStore } from "../store/editorStore";

interface LayoutProps {
  header: ReactNode;
  leftPanel: ReactNode;
  mainArea: ReactNode;
  rightPanel: ReactNode;
  timeline: ReactNode;
  className?: string;
}

function SaveStatusBadge() {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);

  if (saveStatus === "idle") return null;
  if (saveStatus === "saving") {
    return (
      <span
        className="text-xs text-muted-foreground animate-pulse"
        data-ocid="header.save_status"
      >
        Auto-saving…
      </span>
    );
  }
  if (saveStatus === "error") {
    return (
      <span className="text-xs text-destructive" data-ocid="header.save_status">
        Save failed
      </span>
    );
  }
  if (saveStatus === "saved" && lastSavedAt) {
    return (
      <span
        className="text-xs text-muted-foreground"
        data-ocid="header.save_status"
      >
        Saved
      </span>
    );
  }
  return null;
}

export function Layout({
  header,
  leftPanel,
  mainArea,
  rightPanel,
  timeline,
  className,
}: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground select-none",
        className,
      )}
    >
      {/* Header transport bar */}
      <header className="flex-none h-12 bg-card border-b border-border flex items-center px-3 gap-2 z-20">
        {header}
        <SaveStatusBadge />
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth ml-1"
          aria-label="Toggle theme"
          data-ocid="header.theme_toggle"
        >
          {theme === "dark" ? (
            <Sun className="w-3.5 h-3.5" />
          ) : (
            <Moon className="w-3.5 h-3.5" />
          )}
        </button>
      </header>

      {/* Three-column middle zone */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left panel – media library */}
        <aside
          className="flex-none w-56 bg-sidebar border-r border-border flex flex-col overflow-hidden"
          data-ocid="media_library.panel"
        >
          {leftPanel}
        </aside>

        {/* Center – preview + timeline */}
        <main className="flex flex-col flex-1 overflow-hidden min-w-0">
          {/* Playback viewport */}
          <section
            className="flex-1 min-h-0 bg-background flex items-center justify-center p-3"
            data-ocid="playback.section"
          >
            {mainArea}
          </section>

          {/* Timeline */}
          <section
            className="flex-none h-56 border-t border-border bg-card overflow-hidden flex flex-col"
            data-ocid="timeline.section"
          >
            {timeline}
          </section>
        </main>

        {/* Right panel – clip properties */}
        <aside
          className="flex-none w-60 bg-sidebar border-l border-border flex flex-col overflow-hidden"
          data-ocid="properties.panel"
        >
          {rightPanel}
        </aside>
      </div>

      {/* Branding footer */}
      <footer className="flex-none h-6 bg-card border-t border-border flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground/50">
          Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
