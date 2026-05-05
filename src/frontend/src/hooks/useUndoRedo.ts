import { useEditorStore } from "../store/editorStore";

export function useUndoRedo() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.undoStack.length > 0);
  const canRedo = useEditorStore((s) => s.redoStack.length > 0);

  return { undo, redo, canUndo, canRedo };
}
