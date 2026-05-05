import Types "./keyframes";

module {

  // ── Effect types ──────────────────────────────────────────────────────────

  public type EffectType = {
    #shake;
    #blur;
    #colorShift;
  };

  public type EffectId = Nat;

  /// An effect instance applied to a clip.
  /// params: named float parameters (e.g. ("intensity", 0.8), ("speed", 1.5)).
  /// keyframeTracks: animated parameters over time.
  public type Effect = {
    id             : EffectId;
    effectType     : EffectType;
    params         : [(Text, Float)];
    keyframeTracks : [Types.KeyframeTrack];
  };

  // ── Presets ───────────────────────────────────────────────────────────────

  public type PresetId = Nat;

  /// A saved/shareable effect preset.
  public type EffectPreset = {
    id           : PresetId;
    name         : Text;
    creatorId    : Principal;
    effectType   : EffectType;
    params       : [(Text, Float)];
    isPublic     : Bool;
  };

  /// Supported transition types (extends the basic set).
  public type TransitionType = {
    #crossfade;
    #dissolve;
    #slide;
    #zoom;
    #fadeToBlack;
    #blur;
    #spin;
    #glitch;
  };

  /// A saved/shareable transition preset.
  public type TransitionPreset = {
    id             : PresetId;
    name           : Text;
    creatorId      : Principal;
    transitionType : TransitionType;
    params         : [(Text, Float)];
    isPublic       : Bool;
  };

}
