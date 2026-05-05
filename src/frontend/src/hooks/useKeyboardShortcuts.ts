import { useEffect } from "react";
import { useEditorStore } from "../store/editorStore";
import { useUndoRedo } from "./useUndoRedo";

export function useKeyboardShortcuts() {
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const removeClip = useEditorStore((s) => s.removeClip);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const clips = useEditorStore((s) => s.clips);
  const addKeyframe = useEditorStore((s) => s.addKeyframe);
  const getInterpolatedValue = useEditorStore((s) => s.getInterpolatedValue);
  const splitClip = useEditorStore((s) => s.splitClip);
  const duplicateClip = useEditorStore((s) => s.duplicateClip);
  const toggleGraphEditor = useEditorStore((s) => s.toggleGraphEditor);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;

        case "z":
        case "Z":
          if ((e.ctrlKey || e.metaKey) && canUndo) {
            e.preventDefault();
            undo();
          }
          break;

        case "y":
        case "Y":
          if ((e.ctrlKey || e.metaKey) && canRedo) {
            e.preventDefault();
            redo();
          }
          break;

        case "Delete":
        case "Backspace":
          if (selectedClipId) {
            e.preventDefault();
            removeClip(selectedClipId);
          }
          break;

        case "k":
        case "K":
          if (selectedClipId) {
            e.preventDefault();
            const clip = clips.find((c) => c.id === selectedClipId);
            if (!clip) break;
            const localTime = playheadPosition - clip.position;
            // Add keyframe on first available track or opacity by default
            const prop = clip.keyframeTracks[0]?.propertyName ?? "opacity";
            const currentVal =
              getInterpolatedValue(selectedClipId, prop, playheadPosition) ??
              100;
            addKeyframe(selectedClipId, prop, {
              time: localTime,
              value: currentVal,
              easing: "easeInOut",
            });
          }
          break;

        case "g":
        case "G":
          e.preventDefault();
          toggleGraphEditor();
          break;

        case "s":
        case "S":
          if (!(e.ctrlKey || e.metaKey) && selectedClipId) {
            e.preventDefault();
            splitClip(selectedClipId, playheadPosition);
          }
          break;

        case "d":
        case "D":
          if ((e.ctrlKey || e.metaKey) && selectedClipId) {
            e.preventDefault();
            duplicateClip(selectedClipId);
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    isPlaying,
    selectedClipId,
    playheadPosition,
    clips,
    canUndo,
    canRedo,
    setIsPlaying,
    removeClip,
    addKeyframe,
    getInterpolatedValue,
    splitClip,
    duplicateClip,
    toggleGraphEditor,
    undo,
    redo,
  ]);
}
