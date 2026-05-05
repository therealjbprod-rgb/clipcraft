import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Blend,
  ChevronDown,
  ChevronRight,
  Film,
  Filter,
  Layers,
  Palette,
  Plus,
  RotateCw,
  Save,
  Sparkles,
  Upload,
  Wand2,
  Wind,
  X,
  Zap,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { useEditorStore } from "../store/editorStore";
import type { Effect, EffectType, TransitionType } from "../types/editor";

// ─── Types ──────────────────────────────────────────────────────────────────

interface MediaLibraryProps {
  onMusicImport?: (file: File) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  musicInputRef: React.RefObject<HTMLInputElement | null>;
  onFileImport: (files: FileList | null) => void;
  onMusicFileImport: (files: FileList | null) => void;
}

type LeftTab = "media" | "effects" | "transitions";
type EffectCategory =
  | "all"
  | "motion"
  | "distortion"
  | "color"
  | "stylized"
  | "shake";

// ─── Built-in Effect Definitions ────────────────────────────────────────────

interface BuiltinEffect {
  id: string;
  name: string;
  type: EffectType;
  category: EffectCategory;
  icon: React.ReactNode;
  iconBg: string;
  defaultParams: Record<string, number>;
  paramDefs: Array<{
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    type?: "select";
    options?: Array<{ label: string; value: number }>;
  }>;
}

const BUILTIN_EFFECTS: BuiltinEffect[] = [
  {
    id: "shake",
    name: "Shake",
    type: "shake",
    category: "shake",
    icon: <Activity className="w-4 h-4" />,
    iconBg: "bg-orange-500/20 text-orange-400",
    defaultParams: {
      intensity: 5,
      speed: 5,
      randomness: 0.5,
      axis: 2,
      rotation: 0,
    },
    paramDefs: [
      { key: "intensity", label: "Intensity", min: 0, max: 10, step: 0.1 },
      { key: "speed", label: "Speed", min: 0, max: 10, step: 0.1 },
      { key: "randomness", label: "Randomness", min: 0, max: 1, step: 0.01 },
      {
        key: "axis",
        label: "Axis",
        min: 0,
        max: 2,
        step: 1,
        type: "select",
        options: [
          { label: "X", value: 0 },
          { label: "Y", value: 1 },
          { label: "Both", value: 2 },
        ],
      },
      {
        key: "rotation",
        label: "Rotation Shake",
        min: 0,
        max: 1,
        step: 1,
        type: "select",
        options: [
          { label: "Off", value: 0 },
          { label: "On", value: 1 },
        ],
      },
    ],
  },
  {
    id: "blur",
    name: "Blur",
    type: "blur",
    category: "distortion",
    icon: <Wind className="w-4 h-4" />,
    iconBg: "bg-blue-500/20 text-blue-400",
    defaultParams: { radius: 5 },
    paramDefs: [{ key: "radius", label: "Radius", min: 0, max: 20, step: 0.5 }],
  },
  {
    id: "colorShift",
    name: "Color Shift",
    type: "colorShift",
    category: "color",
    icon: <Palette className="w-4 h-4" />,
    iconBg: "bg-violet-500/20 text-violet-400",
    defaultParams: { hueRotate: 0, saturate: 1, brightness: 1 },
    paramDefs: [
      { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 1 },
      { key: "saturate", label: "Saturate", min: 0, max: 3, step: 0.05 },
      { key: "brightness", label: "Brightness", min: 0.5, max: 2, step: 0.05 },
    ],
  },
  {
    id: "glitch",
    name: "Glitch",
    type: "colorShift",
    category: "stylized",
    icon: <Zap className="w-4 h-4" />,
    iconBg: "bg-green-500/20 text-green-400",
    defaultParams: { hueRotate: 45, saturate: 2, brightness: 1.2 },
    paramDefs: [
      { key: "hueRotate", label: "Hue Shift", min: -180, max: 180, step: 1 },
      { key: "saturate", label: "Saturate", min: 0, max: 3, step: 0.05 },
    ],
  },
];

// ─── Transition Definitions ──────────────────────────────────────────────────

interface TransitionDef {
  type:
    | TransitionType
    | "slideLeft"
    | "slideRight"
    | "slideUp"
    | "slideDown"
    | "zoomIn"
    | "zoomOut"
    | "blur"
    | "spin"
    | "glitch";
  label: string;
  icon: React.ReactNode;
  iconBg: string;
}

const TRANSITION_DEFS: TransitionDef[] = [
  {
    type: "crossfade",
    label: "Fade",
    icon: <Blend className="w-4 h-4" />,
    iconBg: "bg-blue-500/20 text-blue-400",
  },
  {
    type: "slide",
    label: "Slide Left",
    icon: <ArrowLeft className="w-4 h-4" />,
    iconBg: "bg-cyan-500/20 text-cyan-400",
  },
  {
    type: "slideRight",
    label: "Slide Right",
    icon: <ArrowRight className="w-4 h-4" />,
    iconBg: "bg-cyan-500/20 text-cyan-400",
  },
  {
    type: "slideUp",
    label: "Slide Up",
    icon: <ArrowUp className="w-4 h-4" />,
    iconBg: "bg-teal-500/20 text-teal-400",
  },
  {
    type: "slideDown",
    label: "Slide Down",
    icon: <ArrowDown className="w-4 h-4" />,
    iconBg: "bg-teal-500/20 text-teal-400",
  },
  {
    type: "zoom",
    label: "Zoom In",
    icon: <ZoomIn className="w-4 h-4" />,
    iconBg: "bg-orange-500/20 text-orange-400",
  },
  {
    type: "blur",
    label: "Blur",
    icon: <Filter className="w-4 h-4" />,
    iconBg: "bg-indigo-500/20 text-indigo-400",
  },
  {
    type: "spin",
    label: "Spin",
    icon: <RotateCw className="w-4 h-4" />,
    iconBg: "bg-pink-500/20 text-pink-400",
  },
  {
    type: "glitch",
    label: "Glitch",
    icon: <Zap className="w-4 h-4" />,
    iconBg: "bg-green-500/20 text-green-400",
  },
  {
    type: "dissolve",
    label: "Dissolve",
    icon: <Sparkles className="w-4 h-4" />,
    iconBg: "bg-purple-500/20 text-purple-400",
  },
  {
    type: "fadeToBlack",
    label: "Fade to Black",
    icon: <Wand2 className="w-4 h-4" />,
    iconBg: "bg-muted text-muted-foreground",
  },
];

// ─── Save Preset Modal ───────────────────────────────────────────────────────

interface SavePresetModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

function SavePresetModal({ onSave, onClose }: SavePresetModalProps) {
  const [name, setName] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      data-ocid="save_preset.dialog"
    >
      <button
        type="button"
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div className="relative z-10 bg-card border border-border rounded-xl p-5 w-72 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-foreground">
            Save as Preset
          </span>
          <button
            type="button"
            onClick={onClose}
            data-ocid="save_preset.close_button"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Preset name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-3"
          data-ocid="save_preset.input"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={onClose}
            data-ocid="save_preset.cancel_button"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={!name.trim()}
            onClick={() => {
              if (name.trim()) {
                onSave(name.trim());
                onClose();
              }
            }}
            data-ocid="save_preset.confirm_button"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Effect Card ─────────────────────────────────────────────────────────────

interface EffectCardProps {
  effect: BuiltinEffect;
  onApply: (effect: BuiltinEffect, params: Record<string, number>) => void;
  onSavePreset: (
    name: string,
    effect: BuiltinEffect,
    params: Record<string, number>,
  ) => void;
}

function EffectCard({ effect, onApply, onSavePreset }: EffectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [params, setParams] = useState<Record<string, number>>(
    effect.defaultParams,
  );
  const [showSaveModal, setShowSaveModal] = useState(false);

  const updateParam = (key: string, value: number) =>
    setParams((p) => ({ ...p, [key]: value }));

  return (
    <>
      <div
        className={cn(
          "rounded-lg border transition-all",
          expanded
            ? "border-primary/40 bg-card"
            : "border-border bg-muted/20 hover:border-border/80",
        )}
      >
        <button
          type="button"
          className="w-full flex items-center gap-2.5 p-2.5 text-left"
          onClick={() => setExpanded(!expanded)}
          data-ocid={`effects.${effect.id}_card`}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              effect.iconBg,
            )}
          >
            {effect.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">
              {effect.name}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {effect.category}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                onApply(effect, params);
              }}
              data-ocid={`effects.${effect.id}_apply_button`}
            >
              Apply
            </Button>
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="px-2.5 pb-2.5 space-y-2.5 border-t border-border/60 pt-2.5">
            {effect.paramDefs.map((def) => (
              <div key={def.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground">
                    {def.label}
                  </span>
                  {def.type === "select" && def.options ? (
                    <select
                      className="bg-input border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none"
                      value={params[def.key]}
                      onChange={(e) =>
                        updateParam(def.key, Number(e.target.value))
                      }
                      data-ocid={`effects.${effect.id}_${def.key}_select`}
                    >
                      {def.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[10px] font-mono text-foreground/70">
                      {params[def.key].toFixed(def.step < 1 ? 2 : 0)}
                    </span>
                  )}
                </div>
                {def.type !== "select" && (
                  <Slider
                    value={[params[def.key]]}
                    min={def.min}
                    max={def.max}
                    step={def.step}
                    onValueChange={([v]) => updateParam(def.key, v)}
                    data-ocid={`effects.${effect.id}_${def.key}_slider`}
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setShowSaveModal(true)}
              data-ocid={`effects.${effect.id}_save_preset_button`}
            >
              <Save className="w-3 h-3" /> Save as Preset
            </button>
          </div>
        )}
      </div>
      {showSaveModal && (
        <SavePresetModal
          onSave={(name) => onSavePreset(name, effect, params)}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </>
  );
}

// ─── Transition Card ─────────────────────────────────────────────────────────

interface TransitionCardProps {
  def: TransitionDef;
  onApply: (type: TransitionType, duration: number) => void;
}

function TransitionCard({ def, onApply }: TransitionCardProps) {
  const [duration, setDuration] = useState(0.5);
  const baseType = def.type as TransitionType;

  return (
    <div className="rounded-lg border border-border bg-muted/20 hover:border-border/80 transition-all p-2.5">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            def.iconBg,
          )}
        >
          {def.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">{def.label}</p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-[10px] text-primary hover:bg-primary/10"
          onClick={() => onApply(baseType, duration)}
          data-ocid={`transitions.${def.type}_apply_button`}
        >
          Apply
        </Button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground">Duration</span>
          <span className="text-[10px] font-mono text-foreground/70">
            {duration.toFixed(1)}s
          </span>
        </div>
        <Slider
          value={[duration]}
          min={0.1}
          max={2}
          step={0.1}
          onValueChange={([v]) => setDuration(v)}
          data-ocid={`transitions.${def.type}_duration_slider`}
        />
      </div>
    </div>
  );
}

// ─── Effects Tab ──────────────────────────────────────────────────────────────

function EffectsTab() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const addEffect = useEditorStore((s) => s.addEffect);
  const effectPresets = useEditorStore((s) => s.effectPresets);
  const [activeCategory, setActiveCategory] = useState<EffectCategory>("all");

  const categories: Array<{ id: EffectCategory; label: string }> = [
    { id: "all", label: "All" },
    { id: "motion", label: "Motion" },
    { id: "distortion", label: "Distortion" },
    { id: "color", label: "Color" },
    { id: "stylized", label: "Stylized" },
    { id: "shake", label: "Shake" },
  ];

  const filtered =
    activeCategory === "all"
      ? BUILTIN_EFFECTS
      : BUILTIN_EFFECTS.filter((e) => e.category === activeCategory);

  function handleApply(
    effectDef: BuiltinEffect,
    params: Record<string, number>,
  ) {
    if (!selectedClipId) return;
    const effect: Effect = {
      id: `fx-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      effectType: effectDef.type,
      params,
      keyframeTracks: [],
    };
    addEffect(selectedClipId, effect);
  }

  function handleSavePreset(
    name: string,
    effectDef: BuiltinEffect,
    params: Record<string, number>,
  ) {
    useEditorStore.setState((s) => ({
      effectPresets: [
        ...s.effectPresets,
        {
          id: `preset-${Date.now()}`,
          name,
          effectType: effectDef.type,
          params,
        },
      ],
    }));
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {!selectedClipId && (
        <div className="mx-2 mt-2 mb-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
          <p className="text-[10px] text-primary/80">
            Select a clip on the timeline to apply effects.
          </p>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-1 p-2 overflow-x-auto shrink-0 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors",
              activeCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
            onClick={() => setActiveCategory(cat.id)}
            data-ocid={`effects.${cat.id}_filter`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Effect cards */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2 min-h-0">
        {filtered.map((eff) => (
          <EffectCard
            key={eff.id}
            effect={eff}
            onApply={handleApply}
            onSavePreset={handleSavePreset}
          />
        ))}

        {/* Saved presets */}
        {effectPresets.length > 0 && (
          <>
            <div className="pt-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider px-0.5">
                Saved Presets
              </span>
            </div>
            {effectPresets.map((preset, i) => (
              <div
                key={preset.id}
                className="rounded-lg border border-border bg-muted/20 p-2.5 flex items-center gap-2.5"
                data-ocid={`effects.preset.${i + 1}`}
              >
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {preset.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground capitalize">
                    {preset.effectType}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Transitions Tab ─────────────────────────────────────────────────────────

function TransitionsTab() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const updateClip = useEditorStore((s) => s.updateClip);
  const clips = useEditorStore((s) => s.clips);
  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;

  function handleApply(type: TransitionType, duration: number) {
    if (!selectedClipId) return;
    updateClip(selectedClipId, { transition: { type, duration } });
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {!selectedClipId && (
        <div className="mx-2 mt-2 mb-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2">
          <p className="text-[10px] text-primary/80">
            Select a clip on the timeline to apply a transition.
          </p>
        </div>
      )}
      {selectedClip?.transition && (
        <div className="mx-2 mt-2 mb-1 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 flex items-center justify-between">
          <p className="text-[10px] text-accent/80">
            Active:{" "}
            <span className="font-semibold text-foreground/80">
              {selectedClip.transition.type}
            </span>{" "}
            ({selectedClip.transition.duration.toFixed(1)}s)
          </p>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={() =>
              selectedClipId && updateClip(selectedClipId, { transition: null })
            }
            data-ocid="transitions.clear_button"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2 min-h-0">
        {TRANSITION_DEFS.map((def) => (
          <TransitionCard key={def.type} def={def} onApply={handleApply} />
        ))}
      </div>
    </div>
  );
}

// ─── Media Tab ───────────────────────────────────────────────────────────────

interface MediaTabProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  musicInputRef: React.RefObject<HTMLInputElement | null>;
  onFileImport: (files: FileList | null) => void;
  onMusicFileImport: (files: FileList | null) => void;
}

function MediaTab({
  fileInputRef,
  musicInputRef,
  onFileImport,
  onMusicFileImport,
}: MediaTabProps) {
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectClip = useEditorStore((s) => s.selectClip);
  const addClip = useEditorStore((s) => s.addClip);
  const musicTrack = useEditorStore((s) => s.musicTrack);
  const setMusicTrack = useEditorStore((s) => s.setMusicTrack);
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
          onClick={() => setExpanded(!expanded)}
          data-ocid="media_library.toggle"
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
          Media Library
        </button>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => fileInputRef.current?.click()}
          data-ocid="media_library.import_button"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {expanded && (
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2 min-h-0">
          {clips.length === 0 ? (
            <button
              type="button"
              className="w-full h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary/70"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="media_library.empty_state"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs">Import media</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {clips.map((clip, i) => (
                <button
                  type="button"
                  key={clip.id}
                  className={cn(
                    "aspect-video rounded border border-border overflow-hidden text-[10px] flex flex-col items-center justify-center gap-1 transition-all",
                    clip.clipType === "video"
                      ? "bg-card clip-block-video"
                      : clip.clipType === "audio"
                        ? "bg-card clip-block-audio"
                        : "bg-card clip-block-image",
                    selectedClipId === clip.id && "ring-1 ring-primary",
                  )}
                  onClick={() => selectClip(clip.id)}
                  onDoubleClick={() => addClip({ ...clip, position: 0 })}
                  data-ocid={`media_library.item.${i + 1}`}
                >
                  {clip.clipType === "video" && (
                    <Film className="w-4 h-4 text-primary" />
                  )}
                  {clip.clipType === "audio" && (
                    <Activity className="w-4 h-4 text-primary" />
                  )}
                  {clip.clipType === "image" && (
                    <Layers className="w-4 h-4 text-primary" />
                  )}
                  <span className="truncate w-full px-1 text-center text-foreground/70">
                    {clip.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {clip.duration.toFixed(1)}s
                  </span>
                </button>
              ))}
            </div>
          )}
          {clips.length > 0 && (
            <button
              type="button"
              className="mt-2 w-full py-1.5 rounded border border-dashed border-border hover:border-primary/50 text-xs text-muted-foreground hover:text-primary/70 transition-colors flex items-center justify-center gap-1"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="media_library.add_more_button"
            >
              <Upload className="w-3 h-3" /> Import more
            </button>
          )}
        </div>
      )}

      <div className="border-t border-border shrink-0">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs font-semibold text-foreground/80">
            Music
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => musicInputRef.current?.click()}
            data-ocid="music.import_button"
          >
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
        {musicTrack && (
          <div className="px-3 pb-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs truncate text-foreground/70 flex-1">
              {musicTrack.name}
            </span>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={() =>
                setMusicTrack({ ...musicTrack, muted: !musicTrack.muted })
              }
              data-ocid="music.mute_toggle"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,audio/*,image/*"
        className="hidden"
        onChange={(e) => onFileImport(e.target.files)}
      />
      <input
        ref={musicInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => onMusicFileImport(e.target.files)}
      />
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function MediaLibrary({
  fileInputRef,
  musicInputRef,
  onFileImport,
  onMusicFileImport,
}: MediaLibraryProps) {
  const [activeTab, setActiveTab] = useState<LeftTab>("media");

  const tabs: Array<{ id: LeftTab; label: string; icon: React.ReactNode }> = [
    { id: "media", label: "Media", icon: <Film className="w-3.5 h-3.5" /> },
    {
      id: "effects",
      label: "Effects",
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: "transitions",
      label: "Transitions",
      icon: <Blend className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col h-full" data-ocid="left_panel">
      {/* Tab bar */}
      <div className="flex border-b border-border shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`left_panel.${tab.id}_tab`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "media" && (
          <MediaTab
            fileInputRef={fileInputRef}
            musicInputRef={musicInputRef}
            onFileImport={onFileImport}
            onMusicFileImport={onMusicFileImport}
          />
        )}
        {activeTab === "effects" && <EffectsTab />}
        {activeTab === "transitions" && <TransitionsTab />}
      </div>
    </div>
  );
}

function fileToClipType(file: File) {
  if (file.type.startsWith("video/")) return "video" as const;
  if (file.type.startsWith("audio/")) return "audio" as const;
  return "image" as const;
}

async function getMediaDuration(
  file: File,
  type: "video" | "audio" | "image",
): Promise<number> {
  if (type === "image") return 5;
  return new Promise((resolve) => {
    const el =
      type === "video"
        ? document.createElement("video")
        : document.createElement("audio");
    el.src = URL.createObjectURL(file);
    el.onloadedmetadata = () => resolve(el.duration || 5);
    el.onerror = () => resolve(5);
  });
}

export { fileToClipType, getMediaDuration };
