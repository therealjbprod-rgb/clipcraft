import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Download,
  Film,
  Pause,
  Play,
  Redo2,
  SkipBack,
  SkipForward,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTimeline } from "../hooks/useTimeline";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useEditorStore } from "../store/editorStore";

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toFixed(2).padStart(5, "0");
  return `${m}:${s}`;
}

interface TransportBarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onExportClick: () => void;
}

export function TransportBar({
  zoom,
  onZoomChange,
  onExportClick,
}: TransportBarProps) {
  const { totalDuration, sortedClips } = useTimeline();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const projectName = useEditorStore((s) => s.projectName);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const setProjectName = useEditorStore((s) => s.setProjectName);

  const goToPrevClip = () => {
    const before = sortedClips
      .filter((c) => c.position < playheadPosition - 0.05)
      .sort((a, b) => b.position - a.position);
    if (before.length > 0) setPlayheadPosition(before[0].position);
    else setPlayheadPosition(0);
  };

  const goToNextClip = () => {
    const after = sortedClips
      .filter((c) => c.position > playheadPosition + 0.05)
      .sort((a, b) => a.position - b.position);
    if (after.length > 0) setPlayheadPosition(after[0].position);
    else setPlayheadPosition(totalDuration);
  };

  return (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
          <Film className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="font-display font-semibold text-sm text-foreground">
          ClipCraft
        </span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={undo}
        disabled={!canUndo}
        data-ocid="header.undo_button"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={redo}
        disabled={!canRedo}
        data-ocid="header.redo_button"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Transport */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={goToPrevClip}
        data-ocid="header.prev_clip_button"
        title="Previous clip"
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setPlayheadPosition(Math.max(0, playheadPosition - 5))}
        data-ocid="header.rewind_5s_button"
        title="Rewind 5s"
      >
        <SkipBack className="w-3.5 h-3.5" />
      </Button>
      <Button
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full",
          isPlaying
            ? "bg-primary/20 text-primary"
            : "bg-primary text-primary-foreground",
        )}
        onClick={() => setIsPlaying(!isPlaying)}
        data-ocid="header.play_pause_button"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() =>
          setPlayheadPosition(Math.min(totalDuration, playheadPosition + 5))
        }
        data-ocid="header.forward_5s_button"
        title="Forward 5s"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={goToNextClip}
        data-ocid="header.next_clip_button"
        title="Next clip"
      >
        <SkipForward className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Timecode */}
      <span
        className="font-mono text-xs text-muted-foreground tabular-nums"
        data-ocid="header.timecode"
      >
        {formatTime(playheadPosition)}
        <span className="text-muted-foreground/40 mx-0.5">/</span>
        {formatTime(totalDuration)}
      </span>

      <div className="flex-1" />

      {/* Project name */}
      <input
        className="bg-transparent text-sm font-display text-center text-foreground/70 hover:text-foreground focus:outline-none focus:text-foreground w-44 truncate"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        data-ocid="header.project_name_input"
      />

      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onZoomChange(Math.max(20, zoom - 20))}
          data-ocid="header.zoom_out_button"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="text-xs text-muted-foreground w-10 text-center">
          {zoom}px
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onZoomChange(Math.min(300, zoom + 20))}
          data-ocid="header.zoom_in_button"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Export */}
      <Button
        size="sm"
        className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={onExportClick}
        data-ocid="header.export_button"
      >
        <Download className="w-3.5 h-3.5 mr-1.5" /> Export
      </Button>
    </>
  );
}
