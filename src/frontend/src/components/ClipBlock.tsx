import { cn } from "@/lib/utils";
import { Film, ImageIcon, Music2, Type } from "lucide-react";
import { useRef } from "react";
import { useEditorStore } from "../store/editorStore";
import type { Clip } from "../types/editor";

interface ClipBlockProps {
  clip: Clip;
  pixelsPerSecond: number;
  effectiveDuration: number;
  onPositionChange?: (id: string, newPosition: number) => void;
}

export function ClipBlock({
  clip,
  pixelsPerSecond,
  effectiveDuration,
  onPositionChange,
}: ClipBlockProps) {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const selectClip = useEditorStore((s) => s.selectClip);
  const isSelected = selectedClipId === clip.id;

  const width = Math.max(32, effectiveDuration * pixelsPerSecond);
  const left = clip.position * pixelsPerSecond;

  const typeClass =
    clip.clipType === "video"
      ? "clip-block-video"
      : clip.clipType === "audio"
        ? "clip-block-audio"
        : clip.clipType === "text"
          ? "clip-block-text"
          : "clip-block-image";

  const dragOffsetXRef = useRef<number>(0);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData("clipId", clip.id);
    dragOffsetXRef.current = e.nativeEvent.offsetX;
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    if (!onPositionChange) return;
    const target = e.currentTarget.closest(
      "[data-track]",
    ) as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetX = dragOffsetXRef.current;
    const newX = e.clientX - rect.left - offsetX;
    const newPosition = Math.max(0, newX / pixelsPerSecond);
    onPositionChange(clip.id, newPosition);
  };

  // Keyframe diamonds — aggregate all unique times across all tracks
  const allKfTimes = Array.from(
    new Set(clip.keyframeTracks.flatMap((t) => t.keyframes.map((k) => k.time))),
  ).sort((a, b) => a - b);

  // Which keyframe IDs are at each time position
  const kfIdsByTime = new Map<number, string[]>();
  for (const track of clip.keyframeTracks) {
    for (const kf of track.keyframes) {
      const arr = kfIdsByTime.get(kf.time) ?? [];
      arr.push(kf.id);
      kfIdsByTime.set(kf.time, arr);
    }
  }

  return (
    <button
      type="button"
      draggable
      className={cn(
        "clip-block absolute top-1 flex flex-col items-stretch px-0 text-xs overflow-visible",
        typeClass,
        isSelected && "selected",
      )}
      style={{ left, width, bottom: "4px" }}
      onClick={(e) => {
        e.stopPropagation();
        selectClip(clip.id);
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-ocid={`timeline.clip.${clip.id}`}
      title={clip.name}
    >
      {/* Clip label row */}
      <div className="flex items-center px-2 flex-1 min-h-0">
        {clip.clipType === "video" && (
          <Film className="w-3 h-3 mr-1 shrink-0 text-primary" />
        )}
        {clip.clipType === "audio" && (
          <Music2 className="w-3 h-3 mr-1 shrink-0 text-primary" />
        )}
        {clip.clipType === "image" && (
          <ImageIcon className="w-3 h-3 mr-1 shrink-0 text-primary" />
        )}
        {clip.clipType === "text" && (
          <Type className="w-3 h-3 mr-1 shrink-0 text-purple-400" />
        )}
        <span className="truncate text-foreground/80">{clip.name}</span>
        <span className="ml-auto text-[9px] text-muted-foreground shrink-0">
          {effectiveDuration.toFixed(1)}s
        </span>
      </div>

      {/* Keyframe diamond row */}
      {allKfTimes.length > 0 && (
        <div className="relative h-3 shrink-0" aria-hidden="true">
          {allKfTimes.map((t) => {
            const xPct = width > 0 ? (t / effectiveDuration) * 100 : 0;
            const ids = kfIdsByTime.get(t) ?? [];
            const isKfSelected = ids.some((id) => id === selectedKeyframeId);
            return (
              <svg
                key={t}
                className="absolute top-0.5 -translate-x-1/2 pointer-events-none"
                style={{ left: `${xPct}%` }}
                width={8}
                height={8}
                viewBox="0 0 8 8"
                aria-hidden="true"
              >
                <polygon
                  points="4,0 8,4 4,8 0,4"
                  fill={isKfSelected ? "white" : "oklch(0.7 0.15 200)"}
                  stroke="none"
                />
              </svg>
            );
          })}
        </div>
      )}
    </button>
  );
}
