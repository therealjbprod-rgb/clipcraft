import Map             "mo:core/Map";
import PrefTypes       "../types/preferences";
import PreferencesLib  "../lib/preferences";

mixin (
  userPreferences : Map.Map<Principal, PrefTypes.UserPreferences>,
) {

  /// Get the caller's user preferences (returns defaults if not yet set).
  public query ({ caller }) func getUserPreferences() : async PrefTypes.UserPreferences {
    PreferencesLib.getPreferences(userPreferences, caller);
  };

  /// Persist the caller's user preferences.
  public shared ({ caller }) func setUserPreferences(prefs : PrefTypes.UserPreferences) : async () {
    PreferencesLib.setPreferences(userPreferences, caller, prefs);
  };

}
