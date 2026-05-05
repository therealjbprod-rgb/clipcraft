import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Film,
  Maximize2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTimeline } from "../hooks/useTimeline";
import { useEditorStore } from "../store/editorStore";

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

interface PreviewPlayerProps {
  onImportClick: () => void;
}

export function PreviewPlayer({ onImportClick }: PreviewPlayerProps) {
  const clips = useEditorStore((s) => s.clips);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const getInterpolatedValue = useEditorStore((s) => s.getInterpolatedValue);
  const { totalDuration } = useTimeline();

  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Find clips active at playhead
  const activeClips = useMemo(
    () =>
      clips.filter((c) => {
        const end = c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
        return playheadPosition >= c.position && playheadPosition < end;
      }),
    [clips, playheadPosition],
  );

  const currentVideoClip =
    activeClips.find((c) => c.clipType === "video" || c.clipType === "image") ??
    null;
  const currentTextClips = activeClips.filter((c) => c.clipType === "text");

  // Compute keyframe-animated transform for a clip
  function getClipTransform(
    clipId: string,
    position: number,
  ): React.CSSProperties {
    const localTime = playheadPosition - position;
    const px = getInterpolatedValue(clipId, "position_x", localTime) ?? 0;
    const py = getInterpolatedValue(clipId, "position_y", localTime) ?? 0;
    const sx = getInterpolatedValue(clipId, "scale_x", localTime) ?? 100;
    const sy = getInterpolatedValue(clipId, "scale_y", localTime) ?? 100;
    const rot = getInterpolatedValue(clipId, "rotation", localTime) ?? 0;
    const op = getInterpolatedValue(clipId, "opacity", localTime) ?? 100;
    return {
      transform: `translate(${px}px, ${py}px) scale(${sx / 100}, ${sy / 100}) rotate(${rot}deg)`,
      opacity: op / 100,
    };
  }

  // Compute effect CSS for a clip
  const getClipEffectFilter = useCallback(
    (clipId: string): string => {
      const clip = clips.find((c) => c.id === clipId);
      if (!clip) return "";
      const localTime = playheadPosition - clip.position;
      const filters: string[] = [];
      for (const effect of clip.effects) {
        if (effect.effectType === "blur") {
          const blurRadius =
            getInterpolatedValue(clipId, "blur_radius", localTime) ??
            effect.params.blurRadius ??
            4;
          filters.push(`blur(${blurRadius}px)`);
        } else if (effect.effectType === "colorShift") {
          const hue =
            getInterpolatedValue(clipId, "hue_shift", localTime) ??
            effect.params.hueShift ??
            0;
          const sat =
            getInterpolatedValue(clipId, "saturation", localTime) ??
            effect.params.saturation ??
            100;
          filters.push(`hue-rotate(${hue}deg) saturate(${sat}%)`);
        } else if (effect.effectType === "shake") {
          const intensity =
            getInterpolatedValue(clipId, "shake_intensity", localTime) ??
            effect.params.intensity ??
            5;
          const speed =
            getInterpolatedValue(clipId, "shake_speed", localTime) ??
            effect.params.speed ??
            10;
          const t = performance.now() / 1000;
          const xOff = Math.sin(t * speed * 2 * Math.PI) * intensity;
          const yOff = Math.cos(t * speed * 1.7 * Math.PI) * intensity;
          filters.push(`translate(${xOff}px, ${yOff}px)`);
        }
      }
      return filters.join(" ");
    },
    [clips, playheadPosition, getInterpolatedValue],
  );

  // Build CSS filter from color filter + effects
  const videoFilter = useMemo(() => {
    if (!currentVideoClip) return undefined;
    const cf = currentVideoClip.colorFilter;
    const base = [
      `brightness(${cf.brightness}%)`,
      `contrast(${cf.contrast}%)`,
      `saturate(${cf.saturation}%)`,
      `hue-rotate(${cf.hueRotation}deg)`,
      `opacity(${cf.opacity}%)`,
    ].join(" ");
    const fx = getClipEffectFilter(currentVideoClip.id);
    return fx ? `${base} ${fx}` : base;
  }, [currentVideoClip, getClipEffectFilter]);

  // Sync video to playhead when not playing
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideoClip || isPlaying) return;
    const localTime =
      currentVideoClip.trimIn +
      (playheadPosition - currentVideoClip.position) * currentVideoClip.speed;
    if (Math.abs(video.currentTime - localTime) > 0.05) {
      video.currentTime = localTime;
    }
  }, [playheadPosition, currentVideoClip, isPlaying]);

  const positionRef = useRef(playheadPosition);
  positionRef.current = playheadPosition;

  const tick = useCallback(
    (timestamp: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;
      const next = positionRef.current + delta;
      if (next >= totalDuration) {
        setIsPlaying(false);
        setPlayheadPosition(totalDuration);
      } else {
        setPlayheadPosition(next);
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [totalDuration, setPlayheadPosition, setIsPlaying],
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, tick]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {});
    else video.pause();
  }, [isPlaying]);

  const videoTransform = currentVideoClip
    ? getClipTransform(currentVideoClip.id, currentVideoClip.position)
    : {};

  return (
    <div className="playback-viewport w-full h-full flex flex-col">
      {/* Video area */}
      <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden">
        {currentVideoClip ? (
          <video
            ref={videoRef}
            src={currentVideoClip.objectUrl}
            className="max-w-full max-h-full object-contain"
            style={{ filter: videoFilter, ...videoTransform }}
            data-ocid="playback.video"
            muted={currentVideoClip.volume === 0}
          >
            <track kind="captions" />
          </video>
        ) : clips.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 text-muted-foreground"
            data-ocid="playback.empty_state"
          >
            <Film className="w-12 h-12 opacity-20" />
            <p className="text-sm">Import media to start editing</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onImportClick}
              data-ocid="playback.import_button"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Import Media
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Skeleton className="w-64 h-36 rounded" />
            <span className="text-xs">No video at this position</span>
          </div>
        )}

        {/* Text clip overlays */}
        {currentTextClips.map((tc) => {
          const tp = tc.textProps;
          if (!tp) return null;
          const transform = getClipTransform(tc.id, tc.position);
          return (
            <div
              key={tc.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={transform}
            >
              <span
                style={{
                  fontFamily: tp.fontFamily,
                  fontSize: tp.fontSize,
                  color: tp.fontColor,
                  fontWeight: tp.bold ? "bold" : "normal",
                  fontStyle: tp.italic ? "italic" : "normal",
                  textAlign: tp.alignment,
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {tp.content}
              </span>
            </div>
          );
        })}
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-2 py-1.5 border-t border-border/50 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setPlayheadPosition(0)}
          data-ocid="playback.skip_back_button"
        >
          <SkipBack className="w-3 h-3" />
        </Button>
        <Button
          size="icon"
          className={cn(
            "h-7 w-7 rounded-full",
            isPlaying
              ? "bg-primary/20 text-primary"
              : "bg-primary text-primary-foreground",
          )}
          onClick={() => setIsPlaying(!isPlaying)}
          data-ocid="playback.play_pause_button"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5" />
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setPlayheadPosition(totalDuration)}
          data-ocid="playback.skip_forward_button"
        >
          <SkipForward className="w-3 h-3" />
        </Button>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {formatTime(playheadPosition)}
          <span className="text-muted-foreground/40 mx-0.5">/</span>
          {formatTime(totalDuration)}
        </span>
        <button
          type="button"
          className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
          title="Fullscreen"
          onClick={() => videoRef.current?.requestFullscreen?.()}
          data-ocid="playback.fullscreen_button"
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
