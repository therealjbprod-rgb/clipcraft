import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BarChart2, Diamond, Plus, Trash2 } from "lucide-react";
import { useEditorStore } from "../store/editorStore";
import type { AnimatableProperty, EasingType } from "../types/editor";

const PROPERTY_LABELS: Record<AnimatableProperty, string> = {
  position_x: "Position X",
  position_y: "Position Y",
  scale_x: "Scale X",
  scale_y: "Scale Y",
  rotation: "Rotation",
  opacity: "Opacity",
  shake_intensity: "Shake Intensity",
  shake_speed: "Shake Speed",
  blur_radius: "Blur Radius",
  effect_intensity: "Effect Intensity",
  hue_shift: "Hue Shift",
  saturation: "Saturation",
};

const EASING_OPTIONS: EasingType[] = [
  "linear",
  "easeIn",
  "easeOut",
  "easeInOut",
  "bounce",
];

function formatTime(secs: number) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  const f = Math.round((secs % 1) * 30)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}:${f}`;
}

export function KeyframePanel() {
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const addKeyframe = useEditorStore((s) => s.addKeyframe);
  const removeKeyframe = useEditorStore((s) => s.removeKeyframe);
  const updateKeyframe = useEditorStore((s) => s.updateKeyframe);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const setSelectedKeyframeId = useEditorStore((s) => s.setSelectedKeyframeId);
  const toggleGraphEditor = useEditorStore((s) => s.toggleGraphEditor);
  const graphEditorVisible = useEditorStore((s) => s.graphEditorVisible);
  const getInterpolatedValue = useEditorStore((s) => s.getInterpolatedValue);

  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;

  if (!selectedClip) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground p-4"
        data-ocid="keyframe.empty_state"
      >
        <Diamond className="w-6 h-6 opacity-20" />
        <p className="text-[11px] text-center">
          Select a clip to view keyframes
        </p>
      </div>
    );
  }

  const tracks = selectedClip.keyframeTracks;

  function handleAddKeyframe(prop: AnimatableProperty) {
    if (!selectedClip) return;
    const localTime = playheadPosition - selectedClip.position;
    const currentVal =
      getInterpolatedValue(selectedClip.id, prop, playheadPosition) ??
      defaultValueFor(prop);
    addKeyframe(selectedClip.id, prop, {
      time: localTime,
      value: currentVal,
      easing: "easeInOut",
    });
  }

  function handleAddNewTrack() {
    if (!selectedClip) return;
    const usedProps = new Set(tracks.map((t) => t.propertyName));
    const unused = (Object.keys(PROPERTY_LABELS) as AnimatableProperty[]).find(
      (p) => !usedProps.has(p),
    );
    if (!unused) return;
    handleAddKeyframe(unused);
  }

  return (
    <div className="flex flex-col h-full" data-ocid="keyframe.panel">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-[10px] font-semibold text-foreground/80 uppercase tracking-wider">
          Keyframes
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-5 w-5",
              graphEditorVisible && "text-primary bg-primary/10",
            )}
            onClick={toggleGraphEditor}
            title="Toggle Graph Editor (G)"
            data-ocid="keyframe.graph_editor_toggle"
          >
            <BarChart2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleAddNewTrack}
            title="Add property track"
            data-ocid="keyframe.add_track_button"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {tracks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-24 gap-2 text-muted-foreground"
            data-ocid="keyframe.tracks_empty_state"
          >
            <p className="text-[10px] text-center px-3">
              Press K to add a keyframe at playhead
            </p>
          </div>
        ) : (
          <div className="py-1">
            {tracks.map((track) => (
              <div key={track.propertyName} className="mb-1">
                <div className="flex items-center justify-between px-3 py-1 bg-muted/10">
                  <span className="text-[10px] font-medium text-foreground/70">
                    {PROPERTY_LABELS[track.propertyName]}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 opacity-60 hover:opacity-100"
                    onClick={() => handleAddKeyframe(track.propertyName)}
                    title="Add keyframe at playhead"
                    data-ocid={`keyframe.add_kf_button.${track.propertyName}`}
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </Button>
                </div>
                {track.keyframes.map((kf, i) => {
                  const isSelected = selectedKeyframeId === kf.id;
                  return (
                    <button
                      key={kf.id}
                      type="button"
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors",
                        isSelected ? "bg-primary/10" : "hover:bg-muted/20",
                      )}
                      onClick={() => {
                        setSelectedKeyframeId(isSelected ? null : kf.id);
                        setPlayheadPosition(selectedClip.position + kf.time);
                      }}
                      data-ocid={`keyframe.item.${i + 1}`}
                    >
                      <Diamond
                        className={cn(
                          "w-2.5 h-2.5 shrink-0",
                          isSelected
                            ? "fill-primary text-primary"
                            : "text-muted-foreground",
                        )}
                      />
                      <span className="font-mono text-[10px] text-foreground/70 w-14 shrink-0">
                        {formatTime(kf.time)}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground flex-1">
                        {kf.value.toFixed(1)}
                      </span>
                      {isSelected && (
                        <select
                          className="text-[9px] bg-input border border-border rounded px-1 py-0.5 text-foreground focus:outline-none"
                          value={kf.easing}
                          onChange={(e) =>
                            updateKeyframe(
                              selectedClip.id,
                              track.propertyName,
                              kf.id,
                              { easing: e.target.value as EasingType },
                            )
                          }
                          data-ocid={`keyframe.easing_select.${i + 1}`}
                        >
                          {EASING_OPTIONS.map((e) => (
                            <option key={e} value={e}>
                              {e}
                            </option>
                          ))}
                        </select>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 hover:text-destructive"
                        onClick={(ev) => {
                          ev.stopPropagation();
                          removeKeyframe(
                            selectedClip.id,
                            track.propertyName,
                            kf.id,
                          );
                          if (isSelected) setSelectedKeyframeId(null);
                        }}
                        data-ocid={`keyframe.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </Button>
                    </button>
                  );
                })}
                <Separator className="mx-3" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function defaultValueFor(prop: AnimatableProperty): number {
  switch (prop) {
    case "opacity":
      return 100;
    case "scale_x":
    case "scale_y":
      return 100;
    case "position_x":
    case "position_y":
      return 0;
    case "rotation":
      return 0;
    default:
      return 0;
  }
}
