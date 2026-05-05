import { cn } from "@/lib/utils";
import { Music2, Plus } from "lucide-react";
import { useTimeline } from "../hooks/useTimeline";
import { useEditorStore } from "../store/editorStore";
import type { Clip } from "../types/editor";
import { ClipBlock } from "./ClipBlock";

interface AudioTrackProps {
  pixelsPerSecond: number;
  playheadPosition: number;
  onAddClip: () => void;
  onSeek: (position: number) => void;
}

// Animated waveform bars CSS rendered
function WaveformBars() {
  const bars = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div className="flex items-center gap-px h-6">
      {bars.map((i) => (
        <div
          key={i}
          className="w-0.5 bg-primary/50 rounded-full"
          style={{
            height: `${20 + Math.sin(i * 1.2) * 60}%`,
            animation: `pulse ${0.6 + i * 0.1}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

export function AudioTrack({
  pixelsPerSecond,
  playheadPosition,
  onAddClip,
  onSeek,
}: AudioTrackProps) {
  const clips = useEditorStore((s) => s.clips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);
  const { clipDurations } = useTimeline();

  const audioClips = clips.filter((c): c is Clip => c.clipType === "audio");

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
      data-ocid="timeline.audio_track"
    >
      {/* Track label */}
      <div className="flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1">
        <Music2 className="w-3 h-3 text-muted-foreground" />
        <span className="text-[9px] text-muted-foreground">AUDIO</span>
      </div>

      {/* Track body */}
      <div
        role="presentation"
        data-track="audio"
        className={cn(
          "track-container relative h-10 flex-1",
          audioClips.length > 0 && "track-active",
        )}
        onClick={handleTrackClick}
        onKeyDown={() => {}}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {audioClips.map((clip) => (
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

        {/* Waveform when clips exist */}
        {audioClips.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            <WaveformBars />
            <button
              type="button"
              className="h-7 w-7 rounded border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onAddClip();
              }}
              data-ocid="timeline.audio_track.add_button"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
