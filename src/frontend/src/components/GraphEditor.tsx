import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/editorStore";
import type { AnimatableProperty, EasingType, Keyframe } from "../types/editor";

const TRACK_COLORS = [
  "oklch(0.7 0.15 200)",
  "oklch(0.7 0.18 30)",
  "oklch(0.65 0.16 120)",
  "oklch(0.65 0.18 280)",
  "oklch(0.7 0.2 40)",
  "oklch(0.68 0.14 160)",
];

const EASING_PRESETS: { label: string; value: EasingType }[] = [
  { label: "Linear", value: "linear" },
  { label: "Ease In", value: "easeIn" },
  { label: "Ease Out", value: "easeOut" },
  { label: "Ease In-Out", value: "easeInOut" },
  { label: "Bounce", value: "bounce" },
];

function evalEasing(t: number, easing: EasingType): number {
  const p = Math.max(0, Math.min(1, t));
  switch (easing) {
    case "easeIn":
      return p * p;
    case "easeOut":
      return p * (2 - p);
    case "easeInOut":
      return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let q = p;
      if (q < 1 / d1) return n1 * q * q;
      if (q < 2 / d1) {
        q -= 1.5 / d1;
        return n1 * q * q + 0.75;
      }
      if (q < 2.5 / d1) {
        q -= 2.25 / d1;
        return n1 * q * q + 0.9375;
      }
      q -= 2.625 / d1;
      return n1 * q * q + 0.984375;
    }
    default:
      return p;
  }
}

function interpolateVal(time: number, kfs: Keyframe[]): number | null {
  if (kfs.length === 0) return null;
  const sorted = [...kfs].sort((a, b) => a.time - b.time);
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time)
    return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (time >= sorted[i].time && time <= sorted[i + 1].time) {
      const t0 = sorted[i].time;
      const t1 = sorted[i + 1].time;
      const v0 = sorted[i].value;
      const v1 = sorted[i + 1].value;
      const raw = t1 === t0 ? 1 : (time - t0) / (t1 - t0);
      const e = evalEasing(raw, sorted[i].easing);
      return v0 + (v1 - v0) * e;
    }
  }
  return null;
}

export function GraphEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const updateKeyframe = useEditorStore((s) => s.updateKeyframe);
  const setSelectedKeyframeId = useEditorStore((s) => s.setSelectedKeyframeId);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);

  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;
  const tracks = selectedClip?.keyframeTracks ?? [];

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Resolve theme-conditional colors at draw time
    const isDark = document.documentElement.classList.contains("dark");
    const colors = {
      bg: isDark ? "#1a1d24" : "#f8f9fb",
      grid: isDark ? "#2e3240" : "#d4d8e0",
      label: isDark ? "#6b7280" : "#9ca3af",
      emptyText: isDark ? "#6b7280" : "#9ca3af",
      playhead: isDark ? "oklch(0.7 0.15 200)" : "oklch(0.45 0.18 200)",
      kfSelected: isDark ? "#ffffff" : "#111827",
    };

    // Background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);

    if (tracks.length === 0) {
      ctx.fillStyle = colors.emptyText;
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "No keyframe tracks for selected clip",
        width / 2,
        height / 2,
      );
      return;
    }

    const PAD = { top: 16, right: 16, bottom: 24, left: 40 };
    const gW = width - PAD.left - PAD.right;
    const gH = height - PAD.top - PAD.bottom;

    // Compute time range
    let tMin = Number.POSITIVE_INFINITY;
    let tMax = Number.NEGATIVE_INFINITY;
    let vMin = Number.POSITIVE_INFINITY;
    let vMax = Number.NEGATIVE_INFINITY;
    for (const track of tracks) {
      for (const kf of track.keyframes) {
        tMin = Math.min(tMin, kf.time);
        tMax = Math.max(tMax, kf.time);
        vMin = Math.min(vMin, kf.value);
        vMax = Math.max(vMax, kf.value);
      }
    }
    if (!Number.isFinite(tMin)) {
      tMin = 0;
      tMax = 10;
    }
    if (tMin === tMax) {
      tMin -= 0.5;
      tMax += 0.5;
    }
    if (!Number.isFinite(vMin)) {
      vMin = 0;
      vMax = 1;
    }
    if (vMin === vMax) {
      vMin -= 10;
      vMax += 10;
    }
    const tRange = tMax - tMin;
    const vRange = vMax - vMin;

    const toX = (t: number) => PAD.left + ((t - tMin) / tRange) * gW;
    const toY = (v: number) => PAD.top + (1 - (v - vMin) / vRange) * gH;

    // Grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + (i / 4) * gH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + gW, y);
      ctx.stroke();
      const vLabel = (vMax - (i / 4) * vRange).toFixed(0);
      ctx.fillStyle = colors.label;
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(vLabel, PAD.left - 4, y + 3);
    }

    // Curves
    tracks.forEach((track, ti) => {
      const color = TRACK_COLORS[ti % TRACK_COLORS.length];
      const kfs = [...track.keyframes].sort((a, b) => a.time - b.time);
      if (kfs.length < 2) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const steps = 120;
      for (let s = 0; s <= steps; s++) {
        const t = tMin + (s / steps) * tRange;
        const v = interpolateVal(t, kfs);
        if (v === null) continue;
        const x = toX(t);
        const y = toY(v);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    // Keyframe points
    tracks.forEach((track, ti) => {
      const color = TRACK_COLORS[ti % TRACK_COLORS.length];
      for (const kf of track.keyframes) {
        const x = toX(kf.time);
        const y = toY(kf.value);
        ctx.beginPath();
        const isSelected = kf.id === selectedKeyframeId;
        ctx.arc(x, y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? colors.kfSelected : color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    // Playhead
    if (selectedClip) {
      const ph = playheadPosition - selectedClip.position;
      if (ph >= tMin && ph <= tMax) {
        const x = toX(ph);
        ctx.strokeStyle = colors.playhead;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, PAD.top);
        ctx.lineTo(x, PAD.top + gH);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [tracks, selectedKeyframeId, playheadPosition, selectedClip]);

  // Click to select keyframe or seek
  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas || !selectedClip || tracks.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const PAD = { top: 16, right: 16, bottom: 24, left: 40 };
    const gW = canvas.width - PAD.left - PAD.right;
    const gH = canvas.height - PAD.top - PAD.bottom;

    let tMin = Number.POSITIVE_INFINITY;
    let tMax = Number.NEGATIVE_INFINITY;
    let vMin = Number.POSITIVE_INFINITY;
    let vMax = Number.NEGATIVE_INFINITY;
    for (const track of tracks)
      for (const kf of track.keyframes) {
        tMin = Math.min(tMin, kf.time);
        tMax = Math.max(tMax, kf.time);
        vMin = Math.min(vMin, kf.value);
        vMax = Math.max(vMax, kf.value);
      }
    if (!Number.isFinite(tMin)) return;
    if (tMin === tMax) {
      tMin -= 0.5;
      tMax += 0.5;
    }
    if (vMin === vMax) {
      vMin -= 10;
      vMax += 10;
    }
    const toX = (t: number) => PAD.left + ((t - tMin) / (tMax - tMin)) * gW;
    const toY = (v: number) => PAD.top + (1 - (v - vMin) / (vMax - vMin)) * gH;

    let hitId: string | null = null;
    for (const track of tracks) {
      for (const kf of track.keyframes) {
        const dx = mx - toX(kf.time);
        const dy = my - toY(kf.value);
        if (Math.sqrt(dx * dx + dy * dy) < 8) {
          hitId = kf.id;
          break;
        }
      }
      if (hitId) break;
    }
    if (hitId) {
      setSelectedKeyframeId(hitId === selectedKeyframeId ? null : hitId);
    } else {
      const t = tMin + ((mx - PAD.left) / gW) * (tMax - tMin);
      setPlayheadPosition(selectedClip.position + Math.max(0, t));
    }
  }

  function applyPreset(easing: EasingType) {
    if (!selectedClip || !selectedKeyframeId) return;
    for (const track of tracks) {
      const kf = track.keyframes.find((k) => k.id === selectedKeyframeId);
      if (kf) {
        updateKeyframe(
          selectedClip.id,
          track.propertyName as AnimatableProperty,
          selectedKeyframeId,
          { easing },
        );
        break;
      }
    }
  }

  return (
    <div
      className="flex flex-col border-t border-border bg-card"
      data-ocid="graph_editor.panel"
    >
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border shrink-0">
        <span className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wider">
          Graph Editor
        </span>
        <div className="flex items-center gap-1">
          {EASING_PRESETS.map((p) => (
            <Button
              key={p.value}
              variant="ghost"
              size="sm"
              className={"h-5 text-[9px] px-1.5 py-0"}
              disabled={!selectedKeyframeId}
              onClick={() => applyPreset(p.value)}
              data-ocid={`graph_editor.preset_${p.value}_button`}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={160}
        className="w-full h-40 block cursor-crosshair"
        onClick={handleCanvasClick}
        onKeyDown={(e) => {
          if (e.key === "Escape") setSelectedKeyframeId(null);
        }}
        tabIndex={0}
        aria-label="Keyframe graph editor"
        data-ocid="graph_editor.canvas_target"
      />
    </div>
  );
}
