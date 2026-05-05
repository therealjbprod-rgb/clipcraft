import List   "mo:core/List";
import Stack  "mo:core/Stack";
import Types  "../types/projects";
import Runtime "mo:core/Runtime";

module {

  // ── Helpers ──────────────────────────────────────────────────────────────

  /// Create a default color filter (no effect).
  public func defaultColorFilter() : Types.ColorFilter {
    { brightness = 0.0; contrast = 0.0; saturation = 0.0; hueRotation = 0.0; opacity = 1.0 };
  };

  /// Convert a mutable clip to its immutable shared form.
  public func clipToPublic(c : Types.ClipMutable) : Types.Clip {
    {
      id             = c.id;
      trackId        = c.trackId;
      fileRef        = c.fileRef;
      clipType       = c.clipType;
      duration       = c.duration;
      trimIn         = c.trimIn;
      trimOut        = c.trimOut;
      speed          = c.speed;
      volume         = c.volume;
      colorFilter    = c.colorFilter;
      transition     = c.transition;
      position       = c.position;
      textProps      = c.textProps;
      keyframeTracks = c.keyframeTracks;
      effects        = c.effects;
    };
  };

  /// Compute total rendered duration from clip list.
  public func computeTotalDuration(clips : List.List<Types.ClipMutable>) : Float {
    clips.foldLeft(0.0, func(acc, c) {
      let effective = (c.trimOut - c.trimIn) / c.speed;
      if (effective > acc) effective else acc;
    });
  };

  // ── Clip CRUD ─────────────────────────────────────────────────────────────

  /// Add a new clip; returns the assigned ClipId.
  public func addClip(
    clips    : List.List<Types.ClipMutable>,
    nextId   : Nat,
    trackId  : Types.TrackId,
    fileRef  : Text,
    clipType : Types.ClipType,
    duration : Float,
  ) : Types.ClipId {
    let pos = clips.size();
    let clip : Types.ClipMutable = {
      id              = nextId;
      trackId;
      var fileRef     = fileRef;
      var clipType    = clipType;
      var duration    = duration;
      var trimIn      = 0.0;
      var trimOut     = duration;
      var speed       = 1.0;
      var volume      = 100.0;
      var colorFilter = defaultColorFilter();
      var transition  = null;
      var position    = pos;
      var textProps   = null;
      var keyframeTracks = [];
      var effects     = [];
    };
    clips.add(clip);
    nextId;
  };

  /// Update mutable clip fields; traps if clipId not found.
  public func updateClip(
    clips       : List.List<Types.ClipMutable>,
    clipId      : Types.ClipId,
    fileRef     : ?Text,
    speed       : ?Float,
    volume      : ?Float,
    trimIn      : ?Float,
    trimOut     : ?Float,
    colorFilter : ?Types.ColorFilter,
    transition  : ??Types.Transition,
  ) : () {
    let clip = switch (clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    switch (fileRef)    { case (?v) { clip.fileRef     := v }; case null {} };
    switch (speed)      { case (?v) { clip.speed       := v }; case null {} };
    switch (volume)     { case (?v) { clip.volume      := v }; case null {} };
    switch (trimIn)     { case (?v) { clip.trimIn      := v }; case null {} };
    switch (trimOut)    { case (?v) { clip.trimOut     := v }; case null {} };
    switch (colorFilter){ case (?v) { clip.colorFilter := v }; case null {} };
    switch (transition) { case (?v) { clip.transition  := v }; case null {} };
  };

  /// Remove a clip by id; traps if not found.
  public func removeClip(
    clips  : List.List<Types.ClipMutable>,
    clipId : Types.ClipId,
  ) : () {
    let idx = switch (clips.findIndex(func(c) { c.id == clipId })) {
      case (?i) i;
      case null Runtime.trap("clip not found");
    };
    // Shift: remove by filtering and reindex positions
    let arr = clips.toArray();
    clips.clear();
    var pos = 0;
    for (c in arr.values()) {
      if (c.id != clipId) {
        c.position := pos;
        clips.add(c);
        pos += 1;
      };
    };
  };

  /// Reorder a clip to a new position index within its track.
  public func reorderClip(
    clips  : List.List<Types.ClipMutable>,
    clipId : Types.ClipId,
    newPos : Nat,
  ) : () {
    let clip = switch (clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    let oldPos = clip.position;
    if (oldPos == newPos) return;
    // Directly mutate positions on all affected clips
    clips.forEach(func(c) {
      if (c.id == clipId) {
        c.position := newPos;
      } else if (oldPos < newPos and c.position > oldPos and c.position <= newPos) {
        c.position := c.position - 1;
      } else if (oldPos > newPos and c.position >= newPos and c.position < oldPos) {
        c.position := c.position + 1;
      };
    });
  };

  // ── Undo / Redo ───────────────────────────────────────────────────────────

  /// Capture current state onto undo stack; clear redo stack.
  public func pushUndo(
    clips      : List.List<Types.ClipMutable>,
    musicTrack : ?Types.MusicTrack,
    undoStack  : Stack.Stack<Types.TimelineSnapshot>,
    redoStack  : Stack.Stack<Types.TimelineSnapshot>,
  ) : () {
    undoStack.push(snapshotTimeline(clips, musicTrack));
    redoStack.clear();
  };

  /// Pop undo stack; restore snapshot; push current state to redo.
  /// Returns restored snapshot, or null if stack empty.
  public func applyUndo(
    clips      : List.List<Types.ClipMutable>,
    musicTrack : ?Types.MusicTrack,
    undoStack  : Stack.Stack<Types.TimelineSnapshot>,
    redoStack  : Stack.Stack<Types.TimelineSnapshot>,
  ) : ?Types.TimelineSnapshot {
    switch (undoStack.pop()) {
      case null null;
      case (?snap) {
        redoStack.push(snapshotTimeline(clips, musicTrack));
        restoreSnapshot(clips, snap);
        ?snap;
      };
    };
  };

  /// Pop redo stack; restore snapshot; push current state to undo.
  public func applyRedo(
    clips      : List.List<Types.ClipMutable>,
    musicTrack : ?Types.MusicTrack,
    undoStack  : Stack.Stack<Types.TimelineSnapshot>,
    redoStack  : Stack.Stack<Types.TimelineSnapshot>,
  ) : ?Types.TimelineSnapshot {
    switch (redoStack.pop()) {
      case null null;
      case (?snap) {
        undoStack.push(snapshotTimeline(clips, musicTrack));
        restoreSnapshot(clips, snap);
        ?snap;
      };
    };
  };

  // ── Serialisation ─────────────────────────────────────────────────────────

  /// Snapshot the current timeline (for save or undo capture).
  public func snapshotTimeline(
    clips      : List.List<Types.ClipMutable>,
    musicTrack : ?Types.MusicTrack,
  ) : Types.TimelineSnapshot {
    { clips = clips.map<Types.ClipMutable, Types.Clip>(func(c) { clipToPublic(c) }).toArray(); musicTrack };
  };

  /// Restore timeline state from a snapshot (mutates clips list in-place).
  public func restoreSnapshot(
    clips    : List.List<Types.ClipMutable>,
    snapshot : Types.TimelineSnapshot,
  ) : () {
    clips.clear();
    for (c in snapshot.clips.values()) {
      let m : Types.ClipMutable = {
        id              = c.id;
        trackId         = c.trackId;
        var fileRef     = c.fileRef;
        var clipType    = c.clipType;
        var duration    = c.duration;
        var trimIn      = c.trimIn;
        var trimOut     = c.trimOut;
        var speed       = c.speed;
        var volume      = c.volume;
        var colorFilter = c.colorFilter;
        var transition  = c.transition;
        var position    = c.position;
        var textProps   = c.textProps;
        var keyframeTracks = c.keyframeTracks;
        var effects     = c.effects;
      };
      clips.add(m);
    };
  };
}
