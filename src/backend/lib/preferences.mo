import Map    "mo:core/Map";
import Types  "../types/preferences";

module {

  /// Retrieve preferences for a user; returns defaults when not yet set.
  public func getPreferences(
    store  : Map.Map<Principal, Types.UserPreferences>,
    userId : Principal,
  ) : Types.UserPreferences {
    switch (store.get(userId)) {
      case (?prefs) prefs;
      case null     ({ theme = #dark });
    };
  };

  /// Persist preferences for a user.
  public func setPreferences(
    store  : Map.Map<Principal, Types.UserPreferences>,
    userId : Principal,
    prefs  : Types.UserPreferences,
  ) : () {
    store.add(userId, prefs);
  };

}
