import List   "mo:core/List";
import Types  "../types/effects";
import Principal "mo:core/Principal";

module {

  // ── Effect helpers ────────────────────────────────────────────────────────

  /// Build a new Effect with the given type and params.
  public func newEffect(
    id         : Types.EffectId,
    effectType : Types.EffectType,
    params     : [(Text, Float)],
  ) : Types.Effect {
    { id; effectType; params; keyframeTracks = [] };
  };

  /// Update params on an existing effect; returns the updated effect.
  public func updateEffectParams(
    effect : Types.Effect,
    params : [(Text, Float)],
  ) : Types.Effect {
    { effect with params };
  };

  // ── Preset helpers ────────────────────────────────────────────────────────

  /// Create a new EffectPreset record.
  public func newEffectPreset(
    id         : Types.PresetId,
    name       : Text,
    creatorId  : Principal,
    effectType : Types.EffectType,
    params     : [(Text, Float)],
    isPublic   : Bool,
  ) : Types.EffectPreset {
    { id; name; creatorId; effectType; params; isPublic };
  };

  /// Create a new TransitionPreset record.
  public func newTransitionPreset(
    id             : Types.PresetId,
    name           : Text,
    creatorId      : Principal,
    transitionType : Types.TransitionType,
    params         : [(Text, Float)],
    isPublic       : Bool,
  ) : Types.TransitionPreset {
    { id; name; creatorId; transitionType; params; isPublic };
  };

  /// List effect presets visible to the given caller (public + own).
  public func listVisibleEffectPresets(
    presets  : List.List<Types.EffectPreset>,
    caller   : Principal,
  ) : [Types.EffectPreset] {
    presets.filter(func(p) {
      p.isPublic or Principal.equal(p.creatorId, caller);
    }).toArray();
  };

  /// List transition presets visible to the given caller (public + own).
  public func listVisibleTransitionPresets(
    presets : List.List<Types.TransitionPreset>,
    caller  : Principal,
  ) : [Types.TransitionPreset] {
    presets.filter(func(p) {
      p.isPublic or Principal.equal(p.creatorId, caller);
    }).toArray();
  };

}
