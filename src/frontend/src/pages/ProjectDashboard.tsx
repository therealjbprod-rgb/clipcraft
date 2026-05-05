import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  Clock,
  Film,
  FolderOpen,
  LogOut,
  Moon,
  Pencil,
  Plus,
  Sun,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ProjectMeta as BackendProjectMeta } from "../backend";
import {
  useCreateProject,
  useDeleteProject,
  useListProjects,
  useRenameProject,
} from "../hooks/useBackend";
import { useTheme } from "../hooks/useTheme";
import { useEditorStore } from "../store/editorStore";

function timeAgo(tsNs: bigint): string {
  const ms = Number(tsNs / 1_000_000n);
  const diff = Date.now() - ms;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const GRADIENT_COLORS = [
  { from: "oklch(0.45 0.18 200)", to: "oklch(0.3 0.12 230)" },
  { from: "oklch(0.42 0.16 280)", to: "oklch(0.3 0.1 300)" },
  { from: "oklch(0.44 0.17 30)", to: "oklch(0.32 0.12 15)" },
  { from: "oklch(0.4 0.14 150)", to: "oklch(0.3 0.1 170)" },
  { from: "oklch(0.44 0.16 50)", to: "oklch(0.32 0.12 35)" },
  { from: "oklch(0.42 0.15 320)", to: "oklch(0.3 0.1 340)" },
];

interface ProjectCardProps {
  project: BackendProjectMeta;
  idx: number;
  onOpen: (p: BackendProjectMeta) => void;
  onDelete: (id: bigint) => void;
  onRename: (id: bigint, name: string) => void;
}

function ProjectCard({
  project,
  idx,
  onOpen,
  onDelete,
  onRename,
}: ProjectCardProps) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const grad = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];

  function startEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditName(project.name);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 50);
  }

  function commitEdit() {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(project.id, trimmed);
    }
    setEditing(false);
  }

  return (
    <motion.div
      key={String(project.id)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-smooth cursor-pointer"
      onClick={() => !editing && onOpen(project)}
      data-ocid={`dashboard.project_card.${idx + 1}`}
    >
      {/* Thumbnail */}
      <div
        className="aspect-video relative flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${grad.from}, ${grad.to})`,
        }}
      >
        {/* Film-strip top */}
        <div
          className="absolute top-0 left-0 right-0 h-5 flex items-center gap-0.5 px-1.5 opacity-30"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
            <div
              key={n}
              className="w-3 h-3.5 rounded-[1px] bg-foreground/60 shrink-0"
            />
          ))}
        </div>
        {/* Film-strip bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-5 flex items-center gap-0.5 px-1.5 opacity-30"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
            <div
              key={n}
              className="w-3 h-3.5 rounded-[1px] bg-foreground/60 shrink-0"
            />
          ))}
        </div>
        {/* Initials badge */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-foreground/10 border border-foreground/20 backdrop-blur-sm flex items-center justify-center">
          <span className="font-display font-bold text-base text-foreground/80">
            {getInitials(project.name)}
          </span>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 backdrop-blur-sm border border-border/40">
          <Clock className="w-2.5 h-2.5 text-foreground/60" />
          <span className="text-xs font-mono text-foreground/70">
            {formatDuration(project.totalDuration)}
          </span>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-smooth" />
      </div>

      {/* Info */}
      <div className="px-3 pt-2.5 pb-2 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {editing ? (
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-6 px-1.5 text-sm font-medium"
              data-ocid={`dashboard.rename_input.${idx + 1}`}
            />
          ) : (
            <p className="font-medium text-sm text-foreground truncate leading-tight">
              {project.name}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {timeAgo(project.lastModified)}
          </p>
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
        <button
          type="button"
          className="w-7 h-7 rounded-md bg-card/80 hover:bg-card border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground backdrop-blur-sm"
          onClick={startEdit}
          aria-label="Rename project"
          data-ocid={`dashboard.rename_button.${idx + 1}`}
        >
          <Pencil className="w-3 h-3" />
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="w-7 h-7 rounded-md bg-destructive/80 hover:bg-destructive flex items-center justify-center text-destructive-foreground backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              aria-label="Delete project"
              data-ocid={`dashboard.delete_button.${idx + 1}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete project?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{project.name}&rdquo; will be permanently deleted. This
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid={`dashboard.delete_cancel_button.${idx + 1}`}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => onDelete(project.id)}
                data-ocid={`dashboard.delete_confirm_button.${idx + 1}`}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

export default function ProjectDashboard() {
  const { isAuthenticated, isInitializing, clear } = useInternetIdentity();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const setProjectName = useEditorStore((s) => s.setProjectName);
  const setCurrentProjectId = useEditorStore((s) => s.setCurrentProjectId);

  const { data: projects, isLoading } = useListProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const renameProject = useRenameProject();

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  // Route guard — redirect to /login if not authenticated
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  async function handleCreate() {
    const name = newName.trim() || "Untitled Project";
    setNewName("");
    setCreating(false);
    try {
      const meta = await createProject.mutateAsync(name);
      setProjectName(meta.name);
      setCurrentProjectId(meta.id);
      navigate({
        to: "/editor/$projectId",
        params: { projectId: String(meta.id) },
      });
    } catch {
      /* mutation handles error */
    }
  }

  function handleOpenProject(meta: BackendProjectMeta) {
    setProjectName(meta.name);
    setCurrentProjectId(meta.id);
    navigate({
      to: "/editor/$projectId",
      params: { projectId: String(meta.id) },
    });
  }

  function handleRename(projectId: bigint, name: string) {
    renameProject.mutate({ projectId, name });
  }

  function handleLogout() {
    clear();
    navigate({ to: "/login" });
  }

  if (isInitializing)
    return <div className="h-screen w-screen bg-background" />;

  return (
    <div className="min-h-screen w-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="flex-none h-14 bg-card border-b border-border flex items-center px-6 gap-3 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Film className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-base text-foreground tracking-tight">
            ClipCraft
          </span>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
          aria-label="Toggle theme"
          data-ocid="dashboard.theme_toggle"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
          data-ocid="dashboard.logout_button"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </Button>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Page heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground tracking-tight">
              Recent Projects
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Pick up where you left off
            </p>
          </div>
          <Button
            onClick={() => setCreating(true)}
            className="gap-2"
            data-ocid="dashboard.new_project_button"
          >
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </div>

        {/* New project inline form */}
        {creating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-card border border-primary/30 rounded-xl flex items-center gap-3 shadow-sm"
          >
            <Input
              placeholder="Project name…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setCreating(false);
              }}
              autoFocus
              className="flex-1"
              data-ocid="dashboard.project_name_input"
            />
            <Button
              onClick={handleCreate}
              disabled={createProject.isPending}
              data-ocid="dashboard.create_confirm_button"
            >
              Create
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCreating(false)}
              data-ocid="dashboard.create_cancel_button"
            >
              Cancel
            </Button>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-28 text-center"
            data-ocid="dashboard.empty_state"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center mb-5">
              <FolderOpen className="w-9 h-9 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-muted-foreground text-sm mb-7 max-w-xs">
              Create your first project and start editing right in the browser
            </p>
            <Button
              size="lg"
              onClick={() => setCreating(true)}
              className="gap-2"
              data-ocid="dashboard.empty_cta_button"
            >
              <Plus className="w-5 h-5" /> Create your first project
            </Button>
          </motion.div>
        ) : (
          /* Project grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* New project card — always first */}
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="group relative bg-card border-2 border-dashed border-border rounded-xl overflow-hidden hover:border-primary/50 hover:bg-muted/30 transition-smooth cursor-pointer flex flex-col items-center justify-center aspect-video text-muted-foreground hover:text-primary"
              onClick={() => setCreating(true)}
              data-ocid="dashboard.new_project_card"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-current/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-smooth">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">New Project</span>
            </motion.button>

            {projects.map((project, idx) => (
              <ProjectCard
                key={String(project.id)}
                project={project}
                idx={idx}
                onOpen={handleOpenProject}
                onDelete={(id) => deleteProject.mutate(id)}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="flex-none h-10 bg-muted/40 border-t border-border flex items-center justify-center">
        <span className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} ClipCraft · Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </span>
      </footer>
    </div>
  );
}
