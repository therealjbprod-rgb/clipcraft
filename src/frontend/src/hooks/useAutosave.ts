import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/editorStore";

const AUTOSAVE_DELAY = 3000;

/**
 * Debounced autosave: saves project to backend 3s after last clip mutation.
 * Only runs when a currentProjectId is set.
 */
export function useAutosave() {
  const { actor, isFetching } = useActor(createActor);
  const clips = useEditorStore((s) => s.clips);
  const musicTrack = useEditorStore((s) => s.musicTrack);
  const currentProjectId = useEditorStore((s) => s.currentProjectId);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const setLastSavedAt = useEditorStore((s) => s.setLastSavedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: clips and musicTrack are intentional triggers
  useEffect(() => {
    if (!actor || isFetching || !currentProjectId) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");

    timerRef.current = setTimeout(async () => {
      try {
        await actor.saveProject(currentProjectId);
        setLastSavedAt(Date.now());
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    clips,
    musicTrack,
    actor,
    isFetching,
    currentProjectId,
    setSaveStatus,
    setLastSavedAt,
  ]);
}
