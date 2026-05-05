import { Button } from "@/components/ui/button";
import { Music2, Volume2, VolumeX } from "lucide-react";
import { useEditorStore } from "../store/editorStore";

interface MusicTrackRowProps {
  pixelsPerSecond: number;
  playheadPosition: number;
  totalDuration: number;
}

export function MusicTrackRow({
  pixelsPerSecond,
  playheadPosition,
  totalDuration,
}: MusicTrackRowProps) {
  const musicTrack = useEditorStore((s) => s.musicTrack);
  const setMusicTrack = useEditorStore((s) => s.setMusicTrack);

  if (!musicTrack) return null;

  const trackWidth = Math.max(totalDuration * pixelsPerSecond, 200);

  return (
    <div
      className="flex items-stretch border-b border-border"
      data-ocid="timeline.music_track_row"
    >
      {/* Track label */}
      <div className="flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1">
        <Music2 className="w-3 h-3 text-primary" />
        <span className="text-[9px] text-muted-foreground">MUSIC</span>
      </div>

      {/* Track body */}
      <div
        className="track-container relative h-10 flex-1"
        data-ocid="timeline.music_track"
      >
        {/* Music block spanning full duration */}
        <div
          className="absolute top-1 bottom-1 rounded clip-block-audio flex items-center px-3 gap-2 border border-primary/20"
          style={{
            left: 0,
            width: trackWidth,
            opacity: musicTrack.muted ? 0.4 : 1,
            transition: "opacity 0.2s",
          }}
        >
          <Music2 className="w-3 h-3 text-primary shrink-0" />
          <span className="text-xs text-foreground/70 truncate flex-1">
            {musicTrack.name}
          </span>
          <span className="text-[9px] text-muted-foreground mr-1">
            {musicTrack.volume}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5 shrink-0"
            onClick={() =>
              setMusicTrack({ ...musicTrack, muted: !musicTrack.muted })
            }
            data-ocid="timeline.music_track.mute_toggle"
          >
            {musicTrack.muted ? (
              <VolumeX className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none"
          style={{ left: playheadPosition * pixelsPerSecond }}
        />
      </div>
    </div>
  );
}
