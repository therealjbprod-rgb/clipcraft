// ─── Local/UI Types (runtime, not backend wire types) ─────────────────────────

export type ClipType = "video" | "audio" | "image" | "text";

export type TransitionType =
  | "crossfade"
  | "dissolve"
  | "slide"
  | "zoom"
  | "fadeToBlack";

export type EasingType =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "bounce";

export type AnimatableProperty =
  | "position_x"
  | "position_y"
  | "scale_x"
  | "scale_y"
  | "rotation"
  | "opacity"
  | "shake_intensity"
  | "shake_speed"
  | "blur_radius"
  | "effect_intensity"
  | "hue_shift"
  | "saturation";

export type EffectType = "shake" | "blur" | "colorShift";

export interface ColorFilter {
  brightness: number; // default 100 (percent)
  contrast: number;
  saturation: number;
  hueRotation: number; // degrees
  opacity: number; // 0–100
}

export interface Transition {
  type: TransitionType;
  duration: number; // seconds
}

export interface Keyframe {
  id: string;
  time: number;
  value: number;
  easing: EasingType;
}

export interface KeyframeTrack {
  propertyName: AnimatableProperty;
  keyframes: Keyframe[];
}

export interface Effect {
  id: string;
  effectType: EffectType;
  params: Record<string, number>;
  keyframeTracks: KeyframeTrack[];
}

export interface TextClipProps {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  bold: boolean;
  italic: boolean;
  alignment: "left" | "center" | "right";
}

export interface Clip {
  id: string;
  trackId: string;
  /** original File reference (may be undefined after hydration) */
  fileRef?: File;
  /** blob:// URL for <video>/<audio>/<img> */
  objectUrl: string;
  /** display name */
  name: string;
  clipType: ClipType;
  /** full media duration in seconds */
  duration: number;
  /** trim start offset in seconds */
  trimIn: number;
  /** trim end offset in seconds (0 = no trim) */
  trimOut: number;
  /** playback speed multiplier */
  speed: number;
  /** 0–100 */
  volume: number;
  colorFilter: ColorFilter;
  transition: Transition | null;
  /** position on the timeline in seconds */
  position: number;
  /** keyframe animation tracks */
  keyframeTracks: KeyframeTrack[];
  /** applied effects */
  effects: Effect[];
  /** text clip properties (only for text clips) */
  textProps?: TextClipProps;
}

export interface MusicTrack {
  fileRef?: File;
  objectUrl: string;
  name: string;
  volume: number;
  muted: boolean;
}

export interface TimelineSnapshot {
  clips: Clip[];
  musicTrack: MusicTrack | null;
}

export interface ProjectMeta {
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  meta: ProjectMeta;
  clips: Clip[];
  musicTrack: MusicTrack | null;
}

// ─── Default Factories ────────────────────────────────────────────────────────

export function defaultColorFilter(): ColorFilter {
  return {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotation: 0,
    opacity: 100,
  };
}

export function defaultTransition(): Transition {
  return { type: "crossfade", duration: 0.5 };
}

export function defaultTextClipProps(): TextClipProps {
  return {
    content: "Text",
    fontFamily: "Space Grotesk",
    fontSize: 48,
    fontColor: "#ffffff",
    bold: false,
    italic: false,
    alignment: "center",
  };
}
