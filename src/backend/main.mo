import List     "mo:core/List";
import Map      "mo:core/Map";
import ProjTypes "types/projects";
import EfTypes   "types/effects";
import PrefTypes "types/preferences";
import ProjectsApi  "mixins/projects-api";
import KeyframesApi "mixins/keyframes-api";
import EffectsApi   "mixins/effects-api";
import PrefsApi     "mixins/preferences-api";

actor {
  // ── Shared state ──────────────────────────────────────────────────────────────
  let nextProjectId  : [var Nat] = [var 0];
  let nextClipId     : [var Nat] = [var 0];
  let nextKeyframeId : [var Nat] = [var 0];
  let nextEffectId   : [var Nat] = [var 0];
  let nextPresetId   : [var Nat] = [var 0];

  let projects        = Map.empty<ProjTypes.ProjectId, ProjTypes.ProjectInternal>();
  let effectPresets   = List.empty<EfTypes.EffectPreset>();
  let transPresets    = List.empty<EfTypes.TransitionPreset>();
  let userPreferences = Map.empty<Principal, PrefTypes.UserPreferences>();

  // ── Mixin composition ───────────────────────────────────────────────────────────
  include ProjectsApi(projects, nextProjectId, nextClipId);
  include KeyframesApi(projects, nextKeyframeId);
  include EffectsApi(projects, effectPresets, transPresets, nextEffectId, nextPresetId);
  include PrefsApi(userPreferences);
};
