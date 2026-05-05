import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  RotateCcw,
  ScissorsIcon,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import { defaultColorFilter } from "../types/editor";
import type { TransitionType } from "../types/editor";

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toFixed(2).padStart(5, "0");
  return `${m}:${s}`;
}

const SPEED_PRESETS = [0.5, 0.75, 1, 1.5, 2];

const TRANSITION_OPTIONS: { label: string; value: TransitionType | "none" }[] =
  [
    { label: "None", value: "none" },
    { label: "Crossfade", value: "crossfade" },
    { label: "Dissolve", value: "dissolve" },
    { label: "Slide", value: "slide" },
    { label: "Zoom", value: "zoom" },
    { label: "Fade to Black", value: "fadeToBlack" },
  ];

const FONT_FAMILIES = [
  "Space Grotesk",
  "Inter",
  "Roboto",
  "Montserrat",
  "Oswald",
  "Playfair Display",
  "Impact",
  "Georgia",
];

export function ClipPropertiesPanel() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const clips = useEditorStore((s) => s.clips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const removeClip = useEditorStore((s) => s.removeClip);
  const updateEffect = useEditorStore((s) => s.updateEffect);
  const removeEffect = useEditorStore((s) => s.removeEffect);

  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;

  if (!selectedClip) {
    return (
      <div className="flex flex-col h-full" data-ocid="properties.panel">
        <div className="px-3 py-2 border-b border-border">
          <p className="text-xs font-semibold text-foreground/80">Properties</p>
        </div>
        <div
          className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2 p-4"
          data-ocid="properties.empty_state"
        >
          <ScissorsIcon className="w-8 h-8 opacity-20" />
          <p className="text-xs text-center">
            Select a clip to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const cf = selectedClip.colorFilter;

  return (
    <div className="flex flex-col h-full" data-ocid="properties.panel">
      <div className="px-3 py-2 border-b border-border shrink-0">
        <p className="text-xs font-semibold text-foreground/80">
          Clip Properties
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
        {/* Name + type */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Name
          </span>
          <p className="text-sm text-foreground truncate mt-0.5">
            {selectedClip.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Type
          </span>
          <Badge variant="outline" className="text-[10px] capitalize">
            {selectedClip.clipType}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Duration
          </span>
          <span className="text-xs font-mono">
            {formatTime(selectedClip.duration)}
          </span>
        </div>

        <Separator />

        {/* Speed presets */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
            Speed
          </span>
          <div className="flex gap-1 flex-wrap">
            {SPEED_PRESETS.map((sp) => (
              <button
                key={sp}
                type="button"
                className={cn(
                  "px-2 py-0.5 rounded text-[11px] border transition-smooth",
                  Math.abs(selectedClip.speed - sp) < 0.01
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
                onClick={() => updateClip(selectedClip.id, { speed: sp })}
                data-ocid={`properties.speed_${String(sp).replace(".", "_")}_button`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Volume
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() =>
                  updateClip(selectedClip.id, {
                    volume: selectedClip.volume > 0 ? 0 : 100,
                  })
                }
                data-ocid="properties.volume_mute_toggle"
              >
                {selectedClip.volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <span className="text-xs font-mono w-8 text-right">
                {selectedClip.volume}%
              </span>
            </div>
          </div>
          <Slider
            value={[selectedClip.volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={([v]) => updateClip(selectedClip.id, { volume: v })}
            data-ocid="properties.volume_slider"
          />
        </div>

        <Separator />

        {/* Trim controls */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
            Trim
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[9px] text-muted-foreground block mb-1">
                In point
              </span>
              <input
                type="number"
                className="w-full bg-input border border-border rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedClip.trimIn.toFixed(2)}
                min={0}
                max={selectedClip.duration - selectedClip.trimOut - 0.1}
                step={0.1}
                onChange={(e) =>
                  updateClip(selectedClip.id, {
                    trimIn: Math.max(0, Number(e.target.value)),
                  })
                }
                data-ocid="properties.trim_in_input"
              />
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground block mb-1">
                Out point
              </span>
              <input
                type="number"
                className="w-full bg-input border border-border rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={selectedClip.trimOut.toFixed(2)}
                min={0}
                max={selectedClip.duration - selectedClip.trimIn - 0.1}
                step={0.1}
                onChange={(e) =>
                  updateClip(selectedClip.id, {
                    trimOut: Math.max(0, Number(e.target.value)),
                  })
                }
                data-ocid="properties.trim_out_input"
              />
            </div>
          </div>
        </div>

        {/* Transition */}
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-2">
            Transition
          </span>
          <select
            className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            value={selectedClip.transition?.type ?? "none"}
            onChange={(e) => {
              const v = e.target.value as TransitionType | "none";
              updateClip(selectedClip.id, {
                transition:
                  v === "none"
                    ? null
                    : {
                        type: v,
                        duration: selectedClip.transition?.duration ?? 0.5,
                      },
              });
            }}
            data-ocid="properties.transition_select"
          >
            {TRANSITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {selectedClip.transition && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] text-muted-foreground">
                  Duration
                </span>
                <span className="text-[9px] font-mono">
                  {selectedClip.transition.duration.toFixed(1)}s
                </span>
              </div>
              <Slider
                value={[selectedClip.transition.duration]}
                min={0.3}
                max={2.0}
                step={0.1}
                onValueChange={([v]) =>
                  updateClip(selectedClip.id, {
                    transition: selectedClip.transition
                      ? { ...selectedClip.transition, duration: v }
                      : null,
                  })
                }
                data-ocid="properties.transition_duration_slider"
              />
            </div>
          )}
        </div>

        {/* Color filters (non-audio only) */}
        {selectedClip.clipType !== "audio" && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Color
                </span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() =>
                    updateClip(selectedClip.id, {
                      colorFilter: defaultColorFilter(),
                    })
                  }
                  data-ocid="properties.color_reset_button"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>
              {(
                [
                  ["Brightness", "brightness", 0, 200],
                  ["Contrast", "contrast", 0, 200],
                  ["Saturation", "saturation", 0, 200],
                  ["Hue Rotation", "hueRotation", 0, 360],
                  ["Opacity", "opacity", 0, 100],
                ] as const
              ).map(([label, key, min, max]) => (
                <div key={key} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-[10px] font-mono">{cf[key]}</span>
                  </div>
                  <Slider
                    value={[cf[key]]}
                    min={min}
                    max={max}
                    step={1}
                    onValueChange={([v]) =>
                      updateClip(selectedClip.id, {
                        colorFilter: { ...cf, [key]: v },
                      })
                    }
                    data-ocid={`properties.${key}_slider`}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Text properties (text clips only) */}
        {selectedClip.clipType === "text" && selectedClip.textProps && (
          <>
            <Separator />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-3">
                Text
              </span>

              {/* Content */}
              <div className="mb-3">
                <span className="text-[9px] text-muted-foreground block mb-1">
                  Content
                </span>
                <textarea
                  className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  rows={3}
                  value={selectedClip.textProps.content}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      textProps: {
                        ...selectedClip.textProps!,
                        content: e.target.value,
                      },
                    })
                  }
                  data-ocid="properties.text_content_textarea"
                />
              </div>

              {/* Font family */}
              <div className="mb-3">
                <span className="text-[9px] text-muted-foreground block mb-1">
                  Font Family
                </span>
                <select
                  className="w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  value={selectedClip.textProps.fontFamily}
                  onChange={(e) =>
                    updateClip(selectedClip.id, {
                      textProps: {
                        ...selectedClip.textProps!,
                        fontFamily: e.target.value,
                      },
                    })
                  }
                  data-ocid="properties.text_font_family_select"
                >
                  {FONT_FAMILIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font size + color */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <span className="text-[9px] text-muted-foreground block mb-1">
                    Size
                  </span>
                  <input
                    type="number"
                    min={8}
                    max={200}
                    step={1}
                    className="w-full bg-input border border-border rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    value={selectedClip.textProps.fontSize}
                    onChange={(e) =>
                      updateClip(selectedClip.id, {
                        textProps: {
                          ...selectedClip.textProps!,
                          fontSize: Number(e.target.value),
                        },
                      })
                    }
                    data-ocid="properties.text_font_size_input"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground block mb-1">
                    Color
                  </span>
                  <input
                    type="color"
                    className="w-full h-[28px] rounded border border-border bg-input cursor-pointer"
                    value={selectedClip.textProps.fontColor}
                    onChange={(e) =>
                      updateClip(selectedClip.id, {
                        textProps: {
                          ...selectedClip.textProps!,
                          fontColor: e.target.value,
                        },
                      })
                    }
                    data-ocid="properties.text_color_input"
                  />
                </div>
              </div>

              {/* Bold, italic, alignment */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className={cn(
                    "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                    selectedClip.textProps.bold
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() =>
                    updateClip(selectedClip.id, {
                      textProps: {
                        ...selectedClip.textProps!,
                        bold: !selectedClip.textProps!.bold,
                      },
                    })
                  }
                  data-ocid="properties.text_bold_toggle"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                    selectedClip.textProps.italic
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() =>
                    updateClip(selectedClip.id, {
                      textProps: {
                        ...selectedClip.textProps!,
                        italic: !selectedClip.textProps!.italic,
                      },
                    })
                  }
                  data-ocid="properties.text_italic_toggle"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1" />
                {(["left", "center", "right"] as const).map((align) => {
                  const AlignIcon =
                    align === "left"
                      ? AlignLeft
                      : align === "center"
                        ? AlignCenter
                        : AlignRight;
                  return (
                    <button
                      key={align}
                      type="button"
                      className={cn(
                        "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                        selectedClip.textProps!.alignment === align
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                      onClick={() =>
                        updateClip(selectedClip.id, {
                          textProps: {
                            ...selectedClip.textProps!,
                            alignment: align,
                          },
                        })
                      }
                      data-ocid={`properties.text_align_${align}_button`}
                    >
                      <AlignIcon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Applied Effects Stack */}
        {selectedClip.effects.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Applied Effects
                </span>
                <Zap className="w-3 h-3 text-primary/60" />
              </div>
              <div className="space-y-2">
                {selectedClip.effects.map((effect, i) => (
                  <div
                    key={effect.id}
                    className="rounded-lg border border-border bg-muted/20 p-2.5"
                    data-ocid={`properties.effect.${i + 1}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground capitalize">
                        {effect.effectType}
                      </span>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => removeEffect(selectedClip.id, effect.id)}
                        data-ocid={`properties.effect.${i + 1}.delete_button`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Params display/edit */}
                    {Object.entries(effect.params).map(([key, value]) => (
                      <div key={key} className="mb-2 last:mb-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] font-mono text-foreground/70">
                            {typeof value === "number"
                              ? value % 1 !== 0
                                ? value.toFixed(2)
                                : value
                              : String(value)}
                          </span>
                        </div>
                        <Slider
                          value={[value]}
                          min={0}
                          max={
                            effect.effectType === "blur"
                              ? 20
                              : effect.effectType === "shake"
                                ? 10
                                : 3
                          }
                          step={0.1}
                          onValueChange={([v]) =>
                            updateEffect(selectedClip.id, effect.id, {
                              params: { ...effect.params, [key]: v },
                            })
                          }
                          data-ocid={`properties.effect.${i + 1}.${key}_slider`}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Delete */}
        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => removeClip(selectedClip.id)}
          data-ocid="properties.delete_button"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Clip
        </Button>
      </div>
    </div>
  );
}
