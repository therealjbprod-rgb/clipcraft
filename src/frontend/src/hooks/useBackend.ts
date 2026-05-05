import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectMeta as BackendProjectMeta } from "../backend";

/**
 * List all projects for the current user.
 */
export function useListProjects() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<BackendProjectMeta[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Create a new project and return its meta.
 */
export function useCreateProject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<BackendProjectMeta, Error, string>({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createProject(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

/**
 * Delete a project by ID.
 */
export function useDeleteProject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, bigint>({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProject(projectId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

/**
 * Rename a project.
 */
export function useRenameProject() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation<void, Error, { projectId: bigint; name: string }>({
    mutationFn: async ({ projectId, name }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.renameProject(projectId, name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

/**
 * Save (manual save) a project.
 */
export function useSaveProject() {
  const { actor } = useActor(createActor);
  return useMutation<BackendProjectMeta, Error, bigint>({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.saveProject(projectId);
    },
  });
}

/**
 * List effect presets.
 */
export function useEffectPresets() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["effect-presets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEffectPresets();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * List transition presets.
 */
export function useTransitionPresets() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["transition-presets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTransitionPresets();
    },
    enabled: !!actor && !isFetching,
  });
}
