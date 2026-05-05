import List        "mo:core/List";
import Map         "mo:core/Map";
import Principal   "mo:core/Principal";
import Runtime     "mo:core/Runtime";
import Stack       "mo:core/Stack";
import Time        "mo:core/Time";
import Types       "../types/projects";
import ProjectsLib "../lib/projects";

mixin (
  projects     : Map.Map<Types.ProjectId, Types.ProjectInternal>,
  nextProjectId : [var Nat],
  nextClipId    : [var Nat],
) {

  // ── Project lifecycle ───────────────────────────────────────────────────

  /// Create a new empty project; returns its metadata.
  public shared ({ caller }) func createProject(name : Text) : async Types.ProjectMeta {
    let id = nextProjectId[0];
    nextProjectId[0] += 1;
    let now = Time.now();
    let proj : Types.ProjectInternal = {
      id;
      owner             = caller;
      var name;
      createdAt         = now;
      var lastModified  = now;
      var totalDuration = 0.0;
      clips             = List.empty<Types.ClipMutable>();
      var musicTrack    = null;
      undoStack         = Stack.empty<Types.TimelineSnapshot>();
      redoStack         = Stack.empty<Types.TimelineSnapshot>();
    };
    projects.add(id, proj);
    {
      id;
      owner         = caller;
      name;
      createdAt     = now;
      lastModified  = now;
      totalDuration = 0.0;
    };
  };

  /// Delete a project; traps if caller is not the owner.
  public shared ({ caller }) func deleteProject(projectId : Types.ProjectId) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    projects.remove(projectId);
  };

  /// List all projects owned by the caller.
  public query ({ caller }) func listProjects() : async [Types.ProjectMeta] {
    projects.values()
      .filter(func(p) { Principal.equal(p.owner, caller) })
      .map<Types.ProjectInternal, Types.ProjectMeta>(func(p) {
        { id = p.id; owner = p.owner; name = p.name; createdAt = p.createdAt;
          lastModified = p.lastModified; totalDuration = p.totalDuration };
      })
      .toArray();
  };

  /// Load a full project (metadata + clips + music track).
  public query ({ caller }) func getProject(projectId : Types.ProjectId) : async ?Types.Project {
    switch (projects.get(projectId)) {
      case null null;
      case (?p) {
        if (not Principal.equal(p.owner, caller)) return null;
        ?{
          meta = { id = p.id; owner = p.owner; name = p.name; createdAt = p.createdAt;
                   lastModified = p.lastModified; totalDuration = p.totalDuration };
          clips = p.clips.map<Types.ClipMutable, Types.Clip>(func(c) { ProjectsLib.clipToPublic(c) }).toArray();
          musicTrack = p.musicTrack;
        };
      };
    };
  };

  /// Rename a project.
  public shared ({ caller }) func renameProject(projectId : Types.ProjectId, newName : Text) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    proj.name         := newName;
    proj.lastModified := Time.now();
  };

  // ── Clip management ─────────────────────────────────────────────────────

  /// Add a clip to the project timeline; returns assigned ClipId.
  public shared ({ caller }) func addClip(
    projectId : Types.ProjectId,
    trackId   : Types.TrackId,
    fileRef   : Text,
    clipType  : Types.ClipType,
    duration  : Float,
  ) : async Types.ClipId {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    ProjectsLib.pushUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    let clipId = ProjectsLib.addClip(proj.clips, nextClipId[0], trackId, fileRef, clipType, duration);
    nextClipId[0] += 1;
    proj.totalDuration := ProjectsLib.computeTotalDuration(proj.clips);
    proj.lastModified  := Time.now();
    clipId;
  };

  /// Update clip properties (only provided fields are changed).
  public shared ({ caller }) func updateClip(
    projectId   : Types.ProjectId,
    clipId      : Types.ClipId,
    fileRef     : ?Text,
    speed       : ?Float,
    volume      : ?Float,
    trimIn      : ?Float,
    trimOut     : ?Float,
    colorFilter : ?Types.ColorFilter,
    transition  : ??Types.Transition,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    ProjectsLib.pushUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    ProjectsLib.updateClip(proj.clips, clipId, fileRef, speed, volume, trimIn, trimOut, colorFilter, transition);
    proj.totalDuration := ProjectsLib.computeTotalDuration(proj.clips);
    proj.lastModified  := Time.now();
  };

  /// Remove a clip from the project timeline.
  public shared ({ caller }) func removeClip(
    projectId : Types.ProjectId,
    clipId    : Types.ClipId,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    ProjectsLib.pushUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    ProjectsLib.removeClip(proj.clips, clipId);
    proj.totalDuration := ProjectsLib.computeTotalDuration(proj.clips);
    proj.lastModified  := Time.now();
  };

  /// Reorder a clip to a new position within its track.
  public shared ({ caller }) func reorderClip(
    projectId : Types.ProjectId,
    clipId    : Types.ClipId,
    newPos    : Nat,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    ProjectsLib.pushUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    ProjectsLib.reorderClip(proj.clips, clipId, newPos);
    proj.lastModified := Time.now();
  };

  // ── Music track ─────────────────────────────────────────────────────────

  /// Set (or replace) the background music track.
  public shared ({ caller }) func setMusicTrack(
    projectId : Types.ProjectId,
    fileRef   : Text,
    volume    : Float,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    ProjectsLib.pushUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    proj.musicTrack   := ?{ fileRef; volume; muted = false };
    proj.lastModified := Time.now();
  };

  /// Update music track volume and/or mute toggle.
  public shared ({ caller }) func updateMusicTrack(
    projectId : Types.ProjectId,
    volume    : ?Float,
    muted     : ?Bool,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let track = switch (proj.musicTrack) {
      case (?t) t;
      case null Runtime.trap("no music track");
    };
    let newVol   = switch (volume) { case (?v) v; case null track.volume };
    let newMuted = switch (muted)  { case (?m) m; case null track.muted  };
    proj.musicTrack   := ?{ track with volume = newVol; muted = newMuted };
    proj.lastModified := Time.now();
  };

  /// Remove the background music track.
  public shared ({ caller }) func removeMusicTrack(projectId : Types.ProjectId) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    ProjectsLib.pushUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    proj.musicTrack   := null;
    proj.lastModified := Time.now();
  };

  // ── Undo / Redo ─────────────────────────────────────────────────────────

  /// Undo the last change; returns the restored snapshot or null.
  public shared ({ caller }) func undo(projectId : Types.ProjectId) : async ?Types.TimelineSnapshot {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let result = ProjectsLib.applyUndo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    switch (result) {
      case (?snap) { proj.musicTrack := snap.musicTrack };
      case null    {};
    };
    proj.totalDuration := ProjectsLib.computeTotalDuration(proj.clips);
    proj.lastModified  := Time.now();
    result;
  };

  /// Redo the last undone change; returns the restored snapshot or null.
  public shared ({ caller }) func redo(projectId : Types.ProjectId) : async ?Types.TimelineSnapshot {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let result = ProjectsLib.applyRedo(proj.clips, proj.musicTrack, proj.undoStack, proj.redoStack);
    switch (result) {
      case (?snap) { proj.musicTrack := snap.musicTrack };
      case null    {};
    };
    proj.totalDuration := ProjectsLib.computeTotalDuration(proj.clips);
    proj.lastModified  := Time.now();
    result;
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  /// Persist the current timeline state (updates lastModified).
  public shared ({ caller }) func saveProject(projectId : Types.ProjectId) : async Types.ProjectMeta {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let now = Time.now();
    proj.lastModified  := now;
    proj.totalDuration := ProjectsLib.computeTotalDuration(proj.clips);
    {
      id            = proj.id;
      owner         = proj.owner;
      name          = proj.name;
      createdAt     = proj.createdAt;
      lastModified  = now;
      totalDuration = proj.totalDuration;
    };
  };
}
