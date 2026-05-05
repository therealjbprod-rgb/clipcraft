import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, Info, Square, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTimeline } from "../hooks/useTimeline";
import { useEditorStore } from "../store/editorStore";

interface ExportPanelProps {
  onClose: () => void;
}

type ExportState = "idle" | "exporting" | "done" | "error";

export function ExportPanel({ onClose }: ExportPanelProps) {
  const clips = useEditorStore((s) => s.clips);
  const { totalDuration, sortedClips } = useTimeline();
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const abortRef = useRef(false);

  const videoClips = sortedClips.filter(
    (c) => c.clipType === "video" || c.clipType === "image",
  );

  const handleExport = useCallback(async () => {
    setExportState("exporting");
    setProgress(0);
    setDownloadUrl(null);
    setErrorMsg(null);
    abortRef.current = false;

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setErrorMsg("Canvas not supported");
      setExportState("error");
      return;
    }

    let stream: MediaStream;
    try {
      stream = canvas.captureStream(30);
    } catch {
      setErrorMsg("Canvas stream not supported in this browser.");
      setExportState("error");
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

    const chunks: Blob[] = [];
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType });
    } catch {
      setErrorMsg("MediaRecorder not supported for this format.");
      setExportState("error");
      return;
    }
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setExportState("done");
    };

    recorder.start(100);

    // Render each clip sequentially
    const total = Math.max(videoClips.length, 1);
    for (let i = 0; i < videoClips.length; i++) {
      if (abortRef.current) break;
      const clip = videoClips[i];
      setProgress(Math.round((i / total) * 90));

      if (clip.clipType === "image") {
        // Draw image for its duration (5s default)
        const img = new Image();
        img.src = clip.objectUrl;
        await new Promise<void>((resolve) => {
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Hold for 5 seconds at 30fps
            let frames = 150;
            const drawFrame = () => {
              if (frames-- <= 0 || abortRef.current) {
                resolve();
                return;
              }
              requestAnimationFrame(drawFrame);
            };
            requestAnimationFrame(drawFrame);
          };
          img.onerror = () => resolve();
        });
      } else {
        // Video clip
        const video = document.createElement("video");
        video.src = clip.objectUrl;
        video.muted = true;
        video.currentTime = clip.trimIn;
        video.playbackRate = clip.speed;

        // Apply color filter
        const { brightness, contrast, saturation, hueRotation, opacity } =
          clip.colorFilter;
        ctx.filter = [
          `brightness(${brightness}%)`,
          `contrast(${contrast}%)`,
          `saturate(${saturation}%)`,
          `hue-rotate(${hueRotation}deg)`,
          `opacity(${opacity}%)`,
        ].join(" ");

        const trimEnd = clip.duration - clip.trimOut - clip.trimIn;

        await new Promise<void>((resolve) => {
          video.oncanplay = () => {
            video.play().catch(() => resolve());
          };
          video.onerror = () => resolve();

          const drawLoop = () => {
            if (abortRef.current) {
              video.pause();
              resolve();
              return;
            }
            const localTime = video.currentTime - clip.trimIn;
            if (localTime >= trimEnd || video.ended) {
              video.pause();
              ctx.filter = "none";
              resolve();
              return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawLoop);
          };
          video.onplaying = drawLoop;
          video.load();
        });

        ctx.filter = "none";
      }
    }

    if (!abortRef.current) {
      setProgress(100);
    }

    recorder.stop();
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }, [videoClips]);

  const handleCancel = () => {
    abortRef.current = true;
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    setExportState("idle");
    setProgress(0);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `clipcraft_export_${Date.now()}.webm`;
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      data-ocid="export.dialog"
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Close */}
        <button
          type="button"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
          data-ocid="export.close_button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display font-semibold text-lg mb-1">
          Export Project
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {videoClips.length} video clip{videoClips.length !== 1 ? "s" : ""} ·{" "}
          {totalDuration.toFixed(1)}s total
        </p>

        <Separator className="mb-4" />

        {/* Info about WebM */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border mb-4">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Export uses{" "}
            <strong className="text-foreground">MediaRecorder</strong> to
            capture your timeline in real-time. Output is{" "}
            <strong className="text-foreground">.webm format</strong> — playable
            in Chrome, Firefox, and most modern browsers. For MP4 conversion,
            use a free tool like HandBrake.
          </p>
        </div>

        {/* Progress */}
        {(exportState === "exporting" || exportState === "done") && (
          <div className="mb-4" data-ocid="export.progress">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">
                {exportState === "done" ? "Export complete!" : "Exporting…"}
              </span>
              <span className="text-xs font-mono text-primary">
                {progress}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {exportState === "error" && errorMsg && (
          <div
            className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs"
            data-ocid="export.error_state"
          >
            {errorMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {exportState === "idle" && (
            <>
              <Button
                className="flex-1"
                onClick={handleExport}
                disabled={clips.length === 0}
                data-ocid="export.start_button"
              >
                <Download className="w-4 h-4 mr-1.5" /> Start Export
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                data-ocid="export.cancel_button"
              >
                Cancel
              </Button>
            </>
          )}

          {exportState === "exporting" && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancel}
              data-ocid="export.abort_button"
            >
              <Square className="w-4 h-4 mr-1.5" /> Stop Export
            </Button>
          )}

          {exportState === "done" && (
            <>
              <Button
                className="flex-1"
                onClick={handleDownload}
                data-ocid="export.download_button"
              >
                <Download className="w-4 h-4 mr-1.5" /> Download .webm
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setExportState("idle");
                  setProgress(0);
                }}
                data-ocid="export.export_again_button"
              >
                Export Again
              </Button>
            </>
          )}

          {exportState === "error" && (
            <>
              <Button
                className="flex-1"
                onClick={handleExport}
                data-ocid="export.retry_button"
              >
                Retry
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                data-ocid="export.close_button2"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
