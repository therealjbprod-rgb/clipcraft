import Map           "mo:core/Map";
import Principal     "mo:core/Principal";
import Runtime       "mo:core/Runtime";
import KFTypes        "../types/keyframes";
import ProjTypes      "../types/projects";
import KeyframesLib  "../lib/keyframes";

mixin (
  projects      : Map.Map<ProjTypes.ProjectId, ProjTypes.ProjectInternal>,
  nextKeyframeId : [var Nat],
) {

  // ── Keyframe management ──────────────────────────────────────────────────

  /// Add a keyframe to a specific property track on a clip.
  public shared ({ caller }) func addKeyframe(
    projectId    : ProjTypes.ProjectId,
    clipId       : ProjTypes.ClipId,
    propertyName : KFTypes.AnimatableProperty,
    time         : Float,
    value        : Float,
    easing       : KFTypes.EasingType,
  ) : async KFTypes.KeyframeId {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let clip = switch (proj.clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    let kfId = nextKeyframeId[0];
    nextKeyframeId[0] += 1;
    let kf : KFTypes.Keyframe = { id = kfId; time; value; easing };
    let existingTrack = switch (clip.keyframeTracks.find(func(t) { t.propertyName == propertyName })) {
      case (?t) t;
      case null ({ propertyName = propertyName; keyframes = [] });
    };
    let updatedTrack = KeyframesLib.addKeyframe(existingTrack, kf);
    clip.keyframeTracks := KeyframesLib.upsertTrack(clip.keyframeTracks, updatedTrack);
    kfId;
  };

  /// Remove a keyframe from a clip's property track.
  public shared ({ caller }) func removeKeyframe(
    projectId    : ProjTypes.ProjectId,
    clipId       : ProjTypes.ClipId,
    propertyName : KFTypes.AnimatableProperty,
    keyframeId   : KFTypes.KeyframeId,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let clip = switch (proj.clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    let track = switch (clip.keyframeTracks.find(func(t) { t.propertyName == propertyName })) {
      case (?t) t;
      case null Runtime.trap("track not found");
    };
    let updated = KeyframesLib.removeKeyframe(track, keyframeId);
    clip.keyframeTracks := KeyframesLib.upsertTrack(clip.keyframeTracks, updated);
  };

  /// Update a keyframe's value and/or easing curve.
  public shared ({ caller }) func updateKeyframe(
    projectId    : ProjTypes.ProjectId,
    clipId       : ProjTypes.ClipId,
    propertyName : KFTypes.AnimatableProperty,
    keyframeId   : KFTypes.KeyframeId,
    value        : ?Float,
    easing       : ?KFTypes.EasingType,
  ) : async () {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let clip = switch (proj.clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    let track = switch (clip.keyframeTracks.find(func(t) { t.propertyName == propertyName })) {
      case (?t) t;
      case null Runtime.trap("track not found");
    };
    let updated = KeyframesLib.updateKeyframe(track, keyframeId, value, easing);
    clip.keyframeTracks := KeyframesLib.upsertTrack(clip.keyframeTracks, updated);
  };

  /// Get all keyframe tracks for a clip.
  public query ({ caller }) func getClipKeyframeTracks(
    projectId : ProjTypes.ProjectId,
    clipId    : ProjTypes.ClipId,
  ) : async [KFTypes.KeyframeTrack] {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let clip = switch (proj.clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    clip.keyframeTracks;
  };

}
