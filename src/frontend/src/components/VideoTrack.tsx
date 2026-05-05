import { cn } from "@/lib/utils";
import { Film, Plus } from "lucide-react";
import { useTimeline } from "../hooks/useTimeline";
import { useEditorStore } from "../store/editorStore";
import type { Clip } from "../types/editor";
import { ClipBlock } from "./ClipBlock";

interface VideoTrackProps {
  pixelsPerSecond: number;
  playheadPosition: number;
  onAddClip: () => void;
  onSeek: (position: number) => void;
}

export function VideoTrack({
  pixelsPerSecond,
  playheadPosition,
  onAddClip,
  onSeek,
}: VideoTrackProps) {
  const clips = useEditorStore((s) => s.clips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);
  const { clipDurations } = useTimeline();

  const videoClips = clips.filter(
    (c): c is Clip => c.clipType === "video" || c.clipType === "image",
  );

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
    selectClip(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipId = e.dataTransfer.getData("clipId");
    const offsetX = Number(e.dataTransfer.getData("dragOffsetX")) || 0;
    if (!clipId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - offsetX;
    const newPosition = Math.max(0, newX / pixelsPerSecond);
    updateClip(clipId, { position: newPosition });
  };

  return (
    <div
      className="flex items-stretch border-b border-border"
      data-ocid="timeline.video_track"
    >
      {/* Track label */}
      <div className="flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1">
        <Film className="w-3 h-3 text-muted-foreground" />
        <span className="text-[9px] text-muted-foreground">VIDEO</span>
      </div>

      {/* Track body */}
      <div
        role="presentation"
        data-track="video"
        className={cn(
          "track-container relative h-12 flex-1",
          videoClips.length > 0 && "track-active",
        )}
        onClick={handleTrackClick}
        onKeyDown={() => {}}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {videoClips.map((clip) => (
          <ClipBlock
            key={clip.id}
            clip={clip}
            pixelsPerSecond={pixelsPerSecond}
            effectiveDuration={clipDurations[clip.id] ?? 0}
            onPositionChange={(id, pos) => updateClip(id, { position: pos })}
          />
        ))}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none"
          style={{ left: playheadPosition * pixelsPerSecond }}
        />

        {/* Empty state add button */}
        {videoClips.length === 0 && (
          <button
            type="button"
            className="absolute top-1 left-1 h-10 w-10 rounded border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onAddClip();
            }}
            data-ocid="timeline.video_track.add_button"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
