import { useMemo } from "react";
import { useEditorStore } from "../store/editorStore";
import type { Clip } from "../types/editor";

export interface TimelineInfo {
  /** Total timeline duration in seconds */
  totalDuration: number;
  /** Clips sorted by position */
  sortedClips: Clip[];
  /** Effective clip duration after trimming, per clip id */
  clipDurations: Record<string, number>;
}

export function useTimeline(): TimelineInfo {
  const clips = useEditorStore((s) => s.clips);

  return useMemo(() => {
    const sortedClips = [...clips].sort((a, b) => a.position - b.position);

    const clipDurations: Record<string, number> = {};
    let totalDuration = 0;

    for (const clip of sortedClips) {
      const effective =
        (clip.duration - clip.trimIn - clip.trimOut) / clip.speed;
      clipDurations[clip.id] = Math.max(0, effective);
      const end = clip.position + clipDurations[clip.id];
      if (end > totalDuration) totalDuration = end;
    }

    return { totalDuration, sortedClips, clipDurations };
  }, [clips]);
}
