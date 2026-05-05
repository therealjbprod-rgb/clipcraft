import { create } from "zustand";
import type {
  AnimatableProperty,
  Clip,
  EasingType,
  Effect,
  Keyframe,
  MusicTrack,
  TimelineSnapshot,
} from "../types/editor";

const MAX_HISTORY = 50;

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("clipcraft-theme");
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

interface EditorState {
  // Project
  projectName: string;
  currentProjectId: bigint | null;
  clips: Clip[];
  musicTrack: MusicTrack | null;
  selectedClipId: string | null;
  playheadPosition: number;
  isPlaying: boolean;
  undoStack: TimelineSnapshot[];
  redoStack: TimelineSnapshot[];
  // Theme
  theme: Theme;
  // Save
  saveStatus: SaveStatus;
  lastSavedAt: number | null;
  // Effect/Transition presets
  effectPresets: Array<{ id: string; name: string; effectType: string }>;
  transitionPresets: Array<{
    id: string;
    name: string;
    transitionType: string;
  }>;
  // Graph editor
  graphEditorVisible: boolean;
  selectedKeyframeId: string | null;

  // Actions — project
  setProjectName: (name: string) => void;
  setCurrentProjectId: (id: bigint | null) => void;
  setClips: (clips: Clip[]) => void;
  addClip: (clip: Clip) => void;
  updateClip: (id: string, patch: Partial<Clip>) => void;
  removeClip: (id: string) => void;
  selectClip: (id: string | null) => void;
  setPlayheadPosition: (position: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setMusicTrack: (track: MusicTrack | null) => void;

  // Actions — theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Actions — save status
  setSaveStatus: (status: SaveStatus) => void;
  setLastSavedAt: (ts: number) => void;

  // Actions — keyframes
  addKeyframe: (
    clipId: string,
    propertyName: AnimatableProperty,
    keyframe: Omit<Keyframe, "id">,
  ) => void;
  updateKeyframe: (
    clipId: string,
    propertyName: AnimatableProperty,
    keyframeId: string,
    patch: Partial<Omit<Keyframe, "id">>,
  ) => void;
  removeKeyframe: (
    clipId: string,
    propertyName: AnimatableProperty,
    keyframeId: string,
  ) => void;
  getInterpolatedValue: (
    clipId: string,
    propertyName: AnimatableProperty,
    time: number,
  ) => number | null;

  // Actions — effects
  addEffect: (clipId: string, effect: Effect) => void;
  updateEffect: (
    clipId: string,
    effectId: string,
    patch: Partial<Effect>,
  ) => void;
  removeEffect: (clipId: string, effectId: string) => void;

  // Graph editor
  toggleGraphEditor: () => void;
  setGraphEditorVisible: (v: boolean) => void;
  setSelectedKeyframeId: (id: string | null) => void;

  // Clip operations
  splitClip: (clipId: string, time: number) => void;
  duplicateClip: (clipId: string) => void;

  // Snapshot helpers
  snapshot: () => TimelineSnapshot;
  pushUndo: () => void;
  undo: () => void;
  redo: () => void;
}

function makeSnapshot(state: EditorState): TimelineSnapshot {
  return {
    clips: JSON.parse(JSON.stringify(state.clips)) as Clip[],
    musicTrack: state.musicTrack
      ? (JSON.parse(JSON.stringify(state.musicTrack)) as MusicTrack)
      : null,
  };
}

function interpolate(
  t: number,
  t0: number,
  t1: number,
  v0: number,
  v1: number,
  easing: EasingType,
): number {
  const raw = t1 === t0 ? 1 : (t - t0) / (t1 - t0);
  const p = Math.max(0, Math.min(1, raw));
  let e: number;
  switch (easing) {
    case "easeIn":
      e = p * p;
      break;
    case "easeOut":
      e = p * (2 - p);
      break;
    case "easeInOut":
      e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      break;
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let q = p;
      if (q < 1 / d1) {
        e = n1 * q * q;
      } else if (q < 2 / d1) {
        q -= 1.5 / d1;
        e = n1 * q * q + 0.75;
      } else if (q < 2.5 / d1) {
        q -= 2.25 / d1;
        e = n1 * q * q + 0.9375;
      } else {
        q -= 2.625 / d1;
        e = n1 * q * q + 0.984375;
      }
      break;
    }
    default:
      e = p;
  }
  return v0 + (v1 - v0) * e;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  projectName: "Untitled Project",
  currentProjectId: null,
  clips: [],
  musicTrack: null,
  selectedClipId: null,
  playheadPosition: 0,
  isPlaying: false,
  undoStack: [],
  redoStack: [],
  theme: getStoredTheme(),
  saveStatus: "idle",
  lastSavedAt: null,
  effectPresets: [],
  transitionPresets: [],
  graphEditorVisible: false,
  selectedKeyframeId: null,

  setProjectName: (name) => set({ projectName: name }),
  setCurrentProjectId: (id) => set({ currentProjectId: id }),

  setClips: (clips) => set({ clips }),

  addClip: (clip) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      return { clips: [...s.clips, clip], undoStack, redoStack: [] };
    }),

  updateClip: (id, patch) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      return {
        clips: s.clips.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        undoStack,
        redoStack: [],
      };
    }),

  removeClip: (id) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      return {
        clips: s.clips.filter((c) => c.id !== id),
        selectedClipId: s.selectedClipId === id ? null : s.selectedClipId,
        undoStack,
        redoStack: [],
      };
    }),

  selectClip: (id) => set({ selectedClipId: id }),
  setPlayheadPosition: (position) => set({ playheadPosition: position }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setMusicTrack: (track) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      return { musicTrack: track, undoStack, redoStack: [] };
    }),

  setTheme: (theme) => {
    localStorage.setItem("clipcraft-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },

  toggleTheme: () => {
    const current = get().theme;
    get().setTheme(current === "dark" ? "light" : "dark");
  },

  setSaveStatus: (saveStatus) => set({ saveStatus }),
  setLastSavedAt: (ts) => set({ lastSavedAt: ts }),

  // ─── Keyframe Operations ────────────────────────────────────────────────────
  addKeyframe: (clipId, propertyName, kf) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      const id = `kf-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newKf: Keyframe = { ...kf, id };
      const clips = s.clips.map((c) => {
        if (c.id !== clipId) return c;
        const existing = c.keyframeTracks.find(
          (t) => t.propertyName === propertyName,
        );
        if (existing) {
          return {
            ...c,
            keyframeTracks: c.keyframeTracks.map((t) =>
              t.propertyName === propertyName
                ? {
                    ...t,
                    keyframes: [...t.keyframes, newKf].sort(
                      (a, b) => a.time - b.time,
                    ),
                  }
                : t,
            ),
          };
        }
        return {
          ...c,
          keyframeTracks: [
            ...c.keyframeTracks,
            { propertyName, keyframes: [newKf] },
          ],
        };
      });
      return { clips, undoStack, redoStack: [] };
    }),

  updateKeyframe: (clipId, propertyName, keyframeId, patch) =>
    set((s) => {
      const clips = s.clips.map((c) => {
        if (c.id !== clipId) return c;
        return {
          ...c,
          keyframeTracks: c.keyframeTracks.map((t) =>
            t.propertyName === propertyName
              ? {
                  ...t,
                  keyframes: t.keyframes
                    .map((k) => (k.id === keyframeId ? { ...k, ...patch } : k))
                    .sort((a, b) => a.time - b.time),
                }
              : t,
          ),
        };
      });
      return { clips };
    }),

  removeKeyframe: (clipId, propertyName, keyframeId) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      const clips = s.clips.map((c) => {
        if (c.id !== clipId) return c;
        return {
          ...c,
          keyframeTracks: c.keyframeTracks.map((t) =>
            t.propertyName === propertyName
              ? {
                  ...t,
                  keyframes: t.keyframes.filter((k) => k.id !== keyframeId),
                }
              : t,
          ),
        };
      });
      return { clips, undoStack, redoStack: [] };
    }),

  getInterpolatedValue: (clipId, propertyName, time) => {
    const clip = get().clips.find((c) => c.id === clipId);
    if (!clip) return null;
    const track = clip.keyframeTracks.find(
      (t) => t.propertyName === propertyName,
    );
    if (!track || track.keyframes.length === 0) return null;
    const kfs = [...track.keyframes].sort((a, b) => a.time - b.time);
    if (time <= kfs[0].time) return kfs[0].value;
    if (time >= kfs[kfs.length - 1].time) return kfs[kfs.length - 1].value;
    for (let i = 0; i < kfs.length - 1; i++) {
      if (time >= kfs[i].time && time <= kfs[i + 1].time) {
        return interpolate(
          time,
          kfs[i].time,
          kfs[i + 1].time,
          kfs[i].value,
          kfs[i + 1].value,
          kfs[i].easing,
        );
      }
    }
    return null;
  },

  // ─── Effect Operations ──────────────────────────────────────────────────────
  addEffect: (clipId, effect) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      const clips = s.clips.map((c) =>
        c.id === clipId ? { ...c, effects: [...c.effects, effect] } : c,
      );
      return { clips, undoStack, redoStack: [] };
    }),

  updateEffect: (clipId, effectId, patch) =>
    set((s) => {
      const clips = s.clips.map((c) => {
        if (c.id !== clipId) return c;
        return {
          ...c,
          effects: c.effects.map((e) =>
            e.id === effectId ? { ...e, ...patch } : e,
          ),
        };
      });
      return { clips };
    }),

  removeEffect: (clipId, effectId) =>
    set((s) => {
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      const clips = s.clips.map((c) => {
        if (c.id !== clipId) return c;
        return { ...c, effects: c.effects.filter((e) => e.id !== effectId) };
      });
      return { clips, undoStack, redoStack: [] };
    }),

  // ─── Graph Editor ───────────────────────────────────────────────────────────
  toggleGraphEditor: () =>
    set((s) => ({ graphEditorVisible: !s.graphEditorVisible })),
  setGraphEditorVisible: (v) => set({ graphEditorVisible: v }),
  setSelectedKeyframeId: (id) => set({ selectedKeyframeId: id }),

  // ─── Clip Operations ────────────────────────────────────────────────────────
  splitClip: (clipId, time) =>
    set((s) => {
      const clip = s.clips.find((c) => c.id === clipId);
      if (!clip) return {};
      const clipStart = clip.position;
      const effectiveDur =
        (clip.duration - clip.trimIn - clip.trimOut) / clip.speed;
      const clipEnd = clipStart + effectiveDur;
      if (time <= clipStart || time >= clipEnd) return {};
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      const splitLocalTime = clip.trimIn + (time - clipStart) * clip.speed;
      const leftClip: Clip = {
        ...clip,
        duration: clip.duration,
        trimOut: clip.duration - splitLocalTime,
        keyframeTracks: [],
        effects: [],
      };
      const rightClip: Clip = {
        ...clip,
        id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        position: time,
        trimIn: splitLocalTime,
        keyframeTracks: [],
        effects: [],
      };
      const clips = s.clips
        .filter((c) => c.id !== clipId)
        .concat([leftClip, rightClip]);
      return { clips, undoStack, redoStack: [] };
    }),

  duplicateClip: (clipId) =>
    set((s) => {
      const clip = s.clips.find((c) => c.id === clipId);
      if (!clip) return {};
      const snap = makeSnapshot(s as EditorState);
      const undoStack = [...s.undoStack, snap].slice(-MAX_HISTORY);
      const effectiveDur =
        (clip.duration - clip.trimIn - clip.trimOut) / clip.speed;
      const newClip: Clip = {
        ...clip,
        id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        position: clip.position + effectiveDur,
        keyframeTracks: JSON.parse(
          JSON.stringify(clip.keyframeTracks),
        ) as typeof clip.keyframeTracks,
        effects: JSON.parse(
          JSON.stringify(clip.effects),
        ) as typeof clip.effects,
      };
      return { clips: [...s.clips, newClip], undoStack, redoStack: [] };
    }),

  // ─── Snapshot / Undo/Redo ───────────────────────────────────────────────────
  snapshot: () => makeSnapshot(get() as EditorState),

  pushUndo: () =>
    set((s) => ({
      undoStack: [...s.undoStack, makeSnapshot(s as EditorState)].slice(
        -MAX_HISTORY,
      ),
      redoStack: [],
    })),

  undo: () =>
    set((s) => {
      if (s.undoStack.length === 0) return {};
      const prev = s.undoStack[s.undoStack.length - 1];
      const currentSnap = makeSnapshot(s as EditorState);
      return {
        clips: prev.clips,
        musicTrack: prev.musicTrack,
        undoStack: s.undoStack.slice(0, -1),
        redoStack: [...s.redoStack, currentSnap].slice(-MAX_HISTORY),
      };
    }),

  redo: () =>
    set((s) => {
      if (s.redoStack.length === 0) return {};
      const next = s.redoStack[s.redoStack.length - 1];
      const currentSnap = makeSnapshot(s as EditorState);
      return {
        clips: next.clips,
        musicTrack: next.musicTrack,
        redoStack: s.redoStack.slice(0, -1),
        undoStack: [...s.undoStack, currentSnap].slice(-MAX_HISTORY),
      };
    }),
}));
