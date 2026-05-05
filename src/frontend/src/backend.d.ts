import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Project {
    musicTrack?: MusicTrack;
    meta: ProjectMeta;
    clips: Array<Clip>;
}
export type EffectId = bigint;
export interface UserPreferences {
    theme: Theme;
}
export interface TransitionPreset {
    id: PresetId;
    name: string;
    creatorId: Principal;
    transitionType: TransitionType__1;
    isPublic: boolean;
    params: Array<[string, number]>;
}
export type Time = bigint;
export type PresetId = bigint;
export type KeyframeId = bigint;
export interface KeyframeTrack {
    keyframes: Array<Keyframe>;
    propertyName: AnimatableProperty;
}
export interface Keyframe {
    id: KeyframeId;
    value: number;
    time: number;
    easing: EasingType;
}
export interface Effect {
    id: EffectId;
    keyframeTracks: Array<KeyframeTrack>;
    effectType: EffectType;
    params: Array<[string, number]>;
}
export interface Clip {
    id: ClipId;
    duration: number;
    keyframeTracks: Array<KeyframeTrack>;
    trimOut: number;
    effects: Array<Effect>;
    colorFilter: ColorFilter;
    trimIn: number;
    transition?: Transition;
    clipType: ClipType;
    volume: number;
    textProps?: TextClipProps;
    speed: number;
    trackId: TrackId;
    position: bigint;
    fileRef: string;
}
export type ClipId = bigint;
export interface TimelineSnapshot {
    musicTrack?: MusicTrack;
    clips: Array<Clip>;
}
export interface EffectPreset {
    id: PresetId;
    name: string;
    creatorId: Principal;
    effectType: EffectType;
    isPublic: boolean;
    params: Array<[string, number]>;
}
export interface MusicTrack {
    muted: boolean;
    volume: number;
    fileRef: string;
}
export interface Transition {
    duration: number;
    transitionType: TransitionType;
}
export type TrackId = bigint;
export type ProjectId = bigint;
export interface ProjectMeta {
    id: ProjectId;
    owner: Principal;
    name: string;
    createdAt: Time;
    totalDuration: number;
    lastModified: Time;
}
export interface TextClipProps {
    italic: boolean;
    content: string;
    bold: boolean;
    fontFamily: string;
    fontSize: number;
    alignment: Variant_center_left_right;
    fontColor: string;
}
export interface ColorFilter {
    contrast: number;
    hueRotation: number;
    brightness: number;
    opacity: number;
    saturation: number;
}
export enum AnimatableProperty {
    rotation = "rotation",
    shake_intensity = "shake_intensity",
    effect_intensity = "effect_intensity",
    scale_x = "scale_x",
    scale_y = "scale_y",
    blur_radius = "blur_radius",
    position_x = "position_x",
    position_y = "position_y",
    hue_shift = "hue_shift",
    shake_speed = "shake_speed",
    opacity = "opacity",
    saturation = "saturation"
}
export enum ClipType {
    audio = "audio",
    video = "video",
    text = "text",
    image = "image"
}
export enum EasingType {
    easeInOut = "easeInOut",
    bounce = "bounce",
    easeIn = "easeIn",
    easeOut = "easeOut",
    linear = "linear"
}
export enum EffectType {
    blur = "blur",
    shake = "shake",
    colorShift = "colorShift"
}
export enum Theme {
    dark = "dark",
    light = "light"
}
export enum TransitionType {
    zoom = "zoom",
    fadeToBlack = "fadeToBlack",
    slide = "slide",
    crossfade = "crossfade",
    dissolve = "dissolve"
}
export enum TransitionType__1 {
    blur = "blur",
    spin = "spin",
    zoom = "zoom",
    fadeToBlack = "fadeToBlack",
    slide = "slide",
    crossfade = "crossfade",
    glitch = "glitch",
    dissolve = "dissolve"
}
export enum Variant_center_left_right {
    center = "center",
    left = "left",
    right = "right"
}
export interface backendInterface {
    addClip(projectId: ProjectId, trackId: TrackId, fileRef: string, clipType: ClipType, duration: number): Promise<ClipId>;
    addEffect(projectId: ProjectId, clipId: ClipId, effectType: EffectType, params: Array<[string, number]>): Promise<EffectId>;
    addKeyframe(projectId: ProjectId, clipId: ClipId, propertyName: AnimatableProperty, time: number, value: number, easing: EasingType): Promise<KeyframeId>;
    createProject(name: string): Promise<ProjectMeta>;
    deletePreset(presetId: PresetId, isEffect: boolean): Promise<void>;
    deleteProject(projectId: ProjectId): Promise<void>;
    getClipKeyframeTracks(projectId: ProjectId, clipId: ClipId): Promise<Array<KeyframeTrack>>;
    getProject(projectId: ProjectId): Promise<Project | null>;
    getUserPreferences(): Promise<UserPreferences>;
    listEffectPresets(): Promise<Array<EffectPreset>>;
    listProjects(): Promise<Array<ProjectMeta>>;
    listTransitionPresets(): Promise<Array<TransitionPreset>>;
    redo(projectId: ProjectId): Promise<TimelineSnapshot | null>;
    removeClip(projectId: ProjectId, clipId: ClipId): Promise<void>;
    removeEffect(projectId: ProjectId, clipId: ClipId, effectId: EffectId): Promise<void>;
    removeKeyframe(projectId: ProjectId, clipId: ClipId, propertyName: AnimatableProperty, keyframeId: KeyframeId): Promise<void>;
    removeMusicTrack(projectId: ProjectId): Promise<void>;
    renameProject(projectId: ProjectId, newName: string): Promise<void>;
    reorderClip(projectId: ProjectId, clipId: ClipId, newPos: bigint): Promise<void>;
    saveEffectPreset(name: string, effectType: EffectType, params: Array<[string, number]>, isPublic: boolean): Promise<PresetId>;
    saveProject(projectId: ProjectId): Promise<ProjectMeta>;
    saveTransitionPreset(name: string, transitionType: TransitionType__1, params: Array<[string, number]>, isPublic: boolean): Promise<PresetId>;
    setMusicTrack(projectId: ProjectId, fileRef: string, volume: number): Promise<void>;
    setUserPreferences(prefs: UserPreferences): Promise<void>;
    undo(projectId: ProjectId): Promise<TimelineSnapshot | null>;
    updateClip(projectId: ProjectId, clipId: ClipId, fileRef: string | null, speed: number | null, volume: number | null, trimIn: number | null, trimOut: number | null, colorFilter: ColorFilter | null, transition: Some<Transition | null> | None): Promise<void>;
    updateEffect(projectId: ProjectId, clipId: ClipId, effectId: EffectId, params: Array<[string, number]>): Promise<void>;
    updateKeyframe(projectId: ProjectId, clipId: ClipId, propertyName: AnimatableProperty, keyframeId: KeyframeId, value: number | null, easing: EasingType | null): Promise<void>;
    updateMusicTrack(projectId: ProjectId, volume: number | null, muted: boolean | null): Promise<void>;
}
