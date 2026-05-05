import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Plus, Redo2, Scissors, Trash2, Type, Undo2 } from "lucide-react";
import { useRef } from "react";
import { useTimeline } from "../hooks/useTimeline";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useEditorStore } from "../store/editorStore";
import { type Clip, defaultTextClipProps } from "../types/editor";
import { AudioTrack } from "./AudioTrack";
import { ClipBlock } from "./ClipBlock";
import { MusicTrackRow } from "./MusicTrackRow";
import { TimelineRuler } from "./TimelineRuler";
import { VideoTrack } from "./VideoTrack";

const SNAP_THRESHOLD = 10; // pixels

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  const f = Math.round((secs % 1) * 30)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}:${f}`;
}

interface TimelineProps {
  pixelsPerSecond: number;
  onAddVideoClip: () => void;
  onAddAudioClip: () => void;
}

// Text Track Row component
function TextTrack({
  pixelsPerSecond,
  playheadPosition,
  onSeek,
}: {
  pixelsPerSecond: number;
  playheadPosition: number;
  onSeek: (pos: number) => void;
}) {
  const clips = useEditorStore((s) => s.clips);
  const addClip = useEditorStore((s) => s.addClip);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);
  const { clipDurations } = useTimeline();

  const textClips = clips.filter((c): c is Clip => c.clipType === "text");

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
    selectClip(null);
  };

  function addTextClip() {
    const lastPos = clips.reduce((max, c) => {
      const end = c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
      return end > max ? end : max;
    }, playheadPosition);
    const newClip: Clip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      trackId: "text-1",
      objectUrl: "",
      name: "Text",
      clipType: "text",
      duration: 5,
      trimIn: 0,
      trimOut: 0,
      speed: 1,
      volume: 0,
      colorFilter: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hueRotation: 0,
        opacity: 100,
      },
      transition: null,
      position: lastPos,
      keyframeTracks: [],
      effects: [],
      textProps: defaultTextClipProps(),
    };
    addClip(newClip);
    selectClip(newClip.id);
  }

  return (
    <div
      className="flex items-stretch border-b border-border"
      data-ocid="timeline.text_track"
    >
      <div className="flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1">
        <Type className="w-3 h-3 text-purple-400" />
        <span className="text-[9px] text-muted-foreground">TEXT</span>
      </div>
      <div
        role="presentation"
        data-track="text"
        className={cn(
          "track-container relative h-10 flex-1",
          textClips.length > 0 && "track-active",
        )}
        onClick={handleTrackClick}
        onKeyDown={() => {}}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const clipId = e.dataTransfer.getData("clipId");
          if (!clipId) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const newX = e.clientX - rect.left;
          const rawPos = Math.max(0, newX / pixelsPerSecond);
          // Snap
          const snap = clips.reduce<number | null>((best, c) => {
            if (c.id === clipId) return best;
            const end =
              c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
            const candidates = [c.position, end];
            for (const candidate of candidates) {
              const diff = Math.abs(candidate * pixelsPerSecond - newX);
              if (
                diff < SNAP_THRESHOLD &&
                (best === null ||
                  diff < Math.abs(best * pixelsPerSecond - newX))
              ) {
                return candidate;
              }
            }
            return best;
          }, null);
          updateClip(clipId, { position: snap !== null ? snap : rawPos });
        }}
      >
        {textClips.map((clip) => (
          <ClipBlock
            key={clip.id}
            clip={clip}
            pixelsPerSecond={pixelsPerSecond}
            effectiveDuration={clipDurations[clip.id] ?? 0}
            onPositionChange={(id, pos) => updateClip(id, { position: pos })}
          />
        ))}
        <div
          className="absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none"
          style={{ left: playheadPosition * pixelsPerSecond }}
        />
        {textClips.length === 0 && (
          <button
            type="button"
            className="absolute top-1 left-1 h-8 w-8 rounded border-2 border-dashed border-purple-400/30 hover:border-purple-400/60 flex items-center justify-center text-purple-400/50 hover:text-purple-400 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              addTextClip();
            }}
            data-ocid="timeline.text_track.add_button"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Timeline({
  pixelsPerSecond,
  onAddVideoClip,
  onAddAudioClip,
}: TimelineProps) {
  const { totalDuration } = useTimeline();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const removeClip = useEditorStore((s) => s.removeClip);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const splitClip = useEditorStore((s) => s.splitClip);
  const scrollRef = useRef<HTMLDivElement>(null);

  const minWidth = (totalDuration + 10) * pixelsPerSecond + 64;

  return (
    <div className="flex flex-col h-full">
      {/* Timeline toolbar */}
      <div className="flex items-center gap-1.5 px-2 py-1 border-b border-border bg-muted/20 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={!selectedClipId}
          onClick={() => selectedClipId && removeClip(selectedClipId)}
          data-ocid="timeline.delete_button"
          title="Delete selected clip"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={!selectedClipId}
          onClick={() =>
            selectedClipId && splitClip(selectedClipId, playheadPosition)
          }
          data-ocid="timeline.split_button"
          title="Split at playhead (S)"
        >
          <Scissors className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={undo}
          disabled={!canUndo}
          data-ocid="timeline.undo_button"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={redo}
          disabled={!canRedo}
          data-ocid="timeline.redo_button"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-3 h-3" />
        </Button>
        <Separator orientation="vertical" className="h-4" />
        <span className="text-[10px] text-muted-foreground ml-1 font-mono tabular-nums">
          {formatTime(playheadPosition)}
          <span className="opacity-40 mx-1">/</span>
          {formatTime(totalDuration)}
        </span>
        <span className="text-[10px] text-muted-foreground ml-2">
          {clips.length} clip{clips.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Scrollable tracks area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin"
        data-ocid="timeline.track_area"
      >
        {clips.length === 0 ? (
          <div
            className="h-full flex items-center justify-center text-muted-foreground gap-2"
            data-ocid="timeline.empty_state"
          >
            <Type className="w-4 h-4 opacity-40" />
            <span className="text-xs">
              Import media or add text to build your timeline
            </span>
          </div>
        ) : (
          <div style={{ minWidth }}>
            {/* Ruler */}
            <div className="flex">
              <div className="flex-none w-14" />
              <div className="flex-1">
                <TimelineRuler
                  totalDuration={totalDuration}
                  pixelsPerSecond={pixelsPerSecond}
                  playheadPosition={playheadPosition}
                  onSeek={setPlayheadPosition}
                />
              </div>
            </div>

            {/* Video track */}
            <VideoTrack
              pixelsPerSecond={pixelsPerSecond}
              playheadPosition={playheadPosition}
              onAddClip={onAddVideoClip}
              onSeek={setPlayheadPosition}
            />

            {/* Audio track */}
            <AudioTrack
              pixelsPerSecond={pixelsPerSecond}
              playheadPosition={playheadPosition}
              onAddClip={onAddAudioClip}
              onSeek={setPlayheadPosition}
            />

            {/* Text track */}
            <TextTrack
              pixelsPerSecond={pixelsPerSecond}
              playheadPosition={playheadPosition}
              onSeek={setPlayheadPosition}
            />

            {/* Music track */}
            <MusicTrackRow
              pixelsPerSecond={pixelsPerSecond}
              playheadPosition={playheadPosition}
              totalDuration={totalDuration}
            />
          </div>
        )}
      </div>
    </div>
  );
}
