import List        "mo:core/List";
import Map         "mo:core/Map";
import Principal   "mo:core/Principal";
import Runtime     "mo:core/Runtime";
import EfTypes     "../types/effects";
import ProjTypes   "../types/projects";
import EffectsLib  "../lib/effects";

mixin (
  projects        : Map.Map<ProjTypes.ProjectId, ProjTypes.ProjectInternal>,
  effectPresets   : List.List<EfTypes.EffectPreset>,
  transPresets    : List.List<EfTypes.TransitionPreset>,
  nextEffectId    : [var Nat],
  nextPresetId    : [var Nat],
) {

  // ── Per-clip effects ──────────────────────────────────────────────────────

  /// Add an effect to a clip; returns the assigned EffectId.
  public shared ({ caller }) func addEffect(
    projectId  : ProjTypes.ProjectId,
    clipId     : ProjTypes.ClipId,
    effectType : EfTypes.EffectType,
    params     : [(Text, Float)],
  ) : async EfTypes.EffectId {
    let proj = switch (projects.get(projectId)) {
      case (?p) p;
      case null Runtime.trap("project not found");
    };
    if (not Principal.equal(proj.owner, caller)) Runtime.trap("not owner");
    let clip = switch (proj.clips.find(func(c) { c.id == clipId })) {
      case (?c) c;
      case null Runtime.trap("clip not found");
    };
    let eid = nextEffectId[0];
    nextEffectId[0] += 1;
    let effect = EffectsLib.newEffect(eid, effectType, params);
    clip.effects := clip.effects.concat([effect]);
    eid;
  };

  /// Update parameters on a clip's effect.
  public shared ({ caller }) func updateEffect(
    projectId : ProjTypes.ProjectId,
    clipId    : ProjTypes.ClipId,
    effectId  : EfTypes.EffectId,
    params    : [(Text, Float)],
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
    var found = false;
    let updated = clip.effects.map(func(e) {
      if (e.id == effectId) {
        found := true;
        EffectsLib.updateEffectParams(e, params);
      } else e;
    });
    if (not found) Runtime.trap("effect not found");
    clip.effects := updated;
  };

  /// Remove an effect from a clip.
  public shared ({ caller }) func removeEffect(
    projectId : ProjTypes.ProjectId,
    clipId    : ProjTypes.ClipId,
    effectId  : EfTypes.EffectId,
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
    clip.effects := clip.effects.filter(func(e) { e.id != effectId });
  };

  // ── Effect presets ────────────────────────────────────────────────────────

  /// Save a reusable effect preset; returns its PresetId.
  public shared ({ caller }) func saveEffectPreset(
    name       : Text,
    effectType : EfTypes.EffectType,
    params     : [(Text, Float)],
    isPublic   : Bool,
  ) : async EfTypes.PresetId {
    let pid = nextPresetId[0];
    nextPresetId[0] += 1;
    let preset = EffectsLib.newEffectPreset(pid, name, caller, effectType, params, isPublic);
    effectPresets.add(preset);
    pid;
  };

  /// List effect presets visible to the caller (all public + caller's private).
  public query ({ caller }) func listEffectPresets() : async [EfTypes.EffectPreset] {
    EffectsLib.listVisibleEffectPresets(effectPresets, caller);
  };

  // ── Transition presets ────────────────────────────────────────────────────

  /// Save a reusable transition preset; returns its PresetId.
  public shared ({ caller }) func saveTransitionPreset(
    name           : Text,
    transitionType : EfTypes.TransitionType,
    params         : [(Text, Float)],
    isPublic       : Bool,
  ) : async EfTypes.PresetId {
    let pid = nextPresetId[0];
    nextPresetId[0] += 1;
    let preset = EffectsLib.newTransitionPreset(pid, name, caller, transitionType, params, isPublic);
    transPresets.add(preset);
    pid;
  };

  /// List transition presets visible to the caller.
  public query ({ caller }) func listTransitionPresets() : async [EfTypes.TransitionPreset] {
    EffectsLib.listVisibleTransitionPresets(transPresets, caller);
  };

  /// Delete a preset (effect or transition) the caller owns.
  public shared ({ caller }) func deletePreset(
    presetId   : EfTypes.PresetId,
    isEffect   : Bool,
  ) : async () {
    if (isEffect) {
      let idx = switch (effectPresets.findIndex(func(p) { p.id == presetId })) {
        case (?i) i;
        case null Runtime.trap("preset not found");
      };
      let preset = effectPresets.at(idx);
      if (not Principal.equal(preset.creatorId, caller)) Runtime.trap("not owner");
      let arr = effectPresets.toArray();
      effectPresets.clear();
      for (p in arr.values()) {
        if (p.id != presetId) effectPresets.add(p);
      };
    } else {
      let idx = switch (transPresets.findIndex(func(p) { p.id == presetId })) {
        case (?i) i;
        case null Runtime.trap("preset not found");
      };
      let preset = transPresets.at(idx);
      if (not Principal.equal(preset.creatorId, caller)) Runtime.trap("not owner");
      let arr = transPresets.toArray();
      transPresets.clear();
      for (p in arr.values()) {
        if (p.id != presetId) transPresets.add(p);
      };
    };
  };

}
