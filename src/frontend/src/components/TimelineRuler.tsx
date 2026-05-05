interface TimelineRulerProps {
  totalDuration: number;
  pixelsPerSecond: number;
  playheadPosition: number;
  onSeek: (position: number) => void;
}

export function TimelineRuler({
  totalDuration,
  pixelsPerSecond,
  playheadPosition,
  onSeek,
}: TimelineRulerProps) {
  const ticks = Math.ceil(totalDuration) + 10;
  const FPS = 30;

  // Determine label density based on zoom
  const showFrameNumbers = pixelsPerSecond >= 120;
  const showSeconds = pixelsPerSecond >= 40;
  const majorInterval =
    pixelsPerSecond >= 80 ? 1 : pixelsPerSecond >= 30 ? 5 : 10;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
  };

  // Format as mm:ss:ff
  function formatTimecode(secs: number) {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    const f = Math.round((secs % 1) * FPS)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}:${f}`;
  }

  // Frame-level ticks at high zoom
  const renderFrameTicks = showFrameNumbers && pixelsPerSecond >= 120;
  const framePx = pixelsPerSecond / FPS;
  const totalFrames = Math.ceil(ticks * FPS);

  return (
    <div
      role="presentation"
      className="relative h-7 border-b border-border bg-muted/30 shrink-0 cursor-pointer select-none"
      style={{ minWidth: ticks * pixelsPerSecond }}
      onClick={handleClick}
      onKeyDown={() => {}}
      data-ocid="timeline.ruler"
    >
      {/* Frame-level ticks at high zoom */}
      {renderFrameTicks &&
        Array.from({ length: totalFrames }, (_, i) => i).map((frame) => {
          const isSec = frame % FPS === 0;
          if (isSec) return null; // handled below
          return (
            <div
              key={`f${frame}`}
              className="absolute top-0"
              style={{ left: frame * framePx }}
            >
              <div className="w-px h-1.5 bg-border/40" />
            </div>
          );
        })}

      {/* Second-level ticks */}
      {Array.from({ length: ticks }, (_, i) => i).map((second) => {
        const isMajor = second % majorInterval === 0;
        const label = showFrameNumbers
          ? formatTimecode(second)
          : `${Math.floor(second / 60)
              .toString()
              .padStart(2, "0")}:${(second % 60).toString().padStart(2, "0")}`;
        return (
          <div
            key={second}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: second * pixelsPerSecond }}
          >
            <div className={`w-px bg-border/60 ${isMajor ? "h-4" : "h-2"}`} />
            {isMajor && (
              <span className="text-[9px] text-muted-foreground mt-0.5 tabular-nums whitespace-nowrap">
                {label}
              </span>
            )}
            {!isMajor && showSeconds && pixelsPerSecond >= 60 && (
              <span className="text-[8px] text-muted-foreground/60 mt-0.5 tabular-nums">
                {second}s
              </span>
            )}
          </div>
        );
      })}

      {/* Playhead marker on ruler */}
      <div
        className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-20"
        style={{ left: playheadPosition * pixelsPerSecond }}
      >
        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-primary" />
        <div className="w-px flex-1 timeline-scrubber" />
      </div>
    </div>
  );
}
