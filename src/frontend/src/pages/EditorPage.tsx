import { useCallback, useRef, useState } from "react";
import { ClipPropertiesPanel } from "../components/ClipPropertiesPanel";
import { ExportPanel } from "../components/ExportPanel";
import { GraphEditor } from "../components/GraphEditor";
import { KeyframePanel } from "../components/KeyframePanel";
import { Layout } from "../components/Layout";
import { MediaLibrary } from "../components/MediaLibrary";
import { PreviewPlayer } from "../components/PreviewPlayer";
import { Timeline } from "../components/Timeline";
import { TransportBar } from "../components/TransportBar";
import { useAutosave } from "../hooks/useAutosave";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useEditorStore } from "../store/editorStore";
import { type Clip, type ClipType, defaultColorFilter } from "../types/editor";

function RightPanel() {
  const graphEditorVisible = useEditorStore((s) => s.graphEditorVisible);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        <div
          style={{
            height: graphEditorVisible ? "50%" : "100%",
            transition: "height 0.2s",
            overflow: "hidden",
          }}
        >
          <ClipPropertiesPanel />
        </div>
        {graphEditorVisible && (
          <div style={{ height: "50%", overflow: "hidden" }}>
            <KeyframePanel />
          </div>
        )}
      </div>
      {graphEditorVisible && <GraphEditor />}
    </div>
  );
}

function fileToClipType(file: File): ClipType {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

async function getMediaDuration(file: File, type: ClipType): Promise<number> {
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

export default function EditorPage() {
  useKeyboardShortcuts();
  useAutosave();

  const clips = useEditorStore((s) => s.clips);
  const addClip = useEditorStore((s) => s.addClip);
  const setMusicTrack = useEditorStore((s) => s.setMusicTrack);

  const [zoom, setZoom] = useState(80);
  const [showExport, setShowExport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        const clipType = fileToClipType(file);
        const duration = await getMediaDuration(file, clipType);
        const objectUrl = URL.createObjectURL(file);
        const lastPos = clips.reduce((max, c) => {
          const end =
            c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
          return end > max ? end : max;
        }, 0);

        const newClip: Clip = {
          id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          trackId: clipType === "audio" ? "audio-1" : "video-1",
          fileRef: file,
          objectUrl,
          name: file.name.replace(/\.[^.]+$/, ""),
          clipType,
          duration,
          trimIn: 0,
          trimOut: 0,
          speed: 1,
          volume: 100,
          colorFilter: defaultColorFilter(),
          transition: null,
          position: lastPos,
          keyframeTracks: [],
          effects: [],
        };
        addClip(newClip);
      }
    },
    [clips, addClip],
  );

  const handleMusicImport = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setMusicTrack({
        fileRef: file,
        objectUrl,
        name: file.name.replace(/\.[^.]+$/, ""),
        volume: 80,
        muted: false,
      });
    },
    [setMusicTrack],
  );

  return (
    <>
      <Layout
        header={
          <TransportBar
            zoom={zoom}
            onZoomChange={setZoom}
            onExportClick={() => setShowExport(true)}
          />
        }
        leftPanel={
          <MediaLibrary
            fileInputRef={fileInputRef}
            musicInputRef={musicInputRef}
            onFileImport={handleFileImport}
            onMusicFileImport={handleMusicImport}
            onMusicImport={() => musicInputRef.current?.click()}
          />
        }
        mainArea={
          <PreviewPlayer onImportClick={() => fileInputRef.current?.click()} />
        }
        rightPanel={<RightPanel />}
        timeline={
          <Timeline
            pixelsPerSecond={zoom}
            onAddVideoClip={() => fileInputRef.current?.click()}
            onAddAudioClip={() => fileInputRef.current?.click()}
          />
        }
      />

      {showExport && <ExportPanel onClose={() => setShowExport(false)} />}
    </>
  );
}
