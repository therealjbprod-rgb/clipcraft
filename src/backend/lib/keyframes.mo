import Types  "../types/keyframes";
import Runtime "mo:core/Runtime";

module {

  /// Add a keyframe to a track's keyframe array; returns the updated array sorted by time.
  public func addKeyframe(
    track     : Types.KeyframeTrack,
    keyframe  : Types.Keyframe,
  ) : Types.KeyframeTrack {
    let updated = track.keyframes.concat([keyframe]);
    let sorted = updated.sort(func(a, b) {
      if (a.time < b.time) #less
      else if (a.time > b.time) #greater
      else #equal;
    });
    { track with keyframes = sorted };
  };

  /// Remove a keyframe by id from a track; traps if not found.
  public func removeKeyframe(
    track      : Types.KeyframeTrack,
    keyframeId : Types.KeyframeId,
  ) : Types.KeyframeTrack {
    let filtered = track.keyframes.filter(func(k) { k.id != keyframeId });
    if (filtered.size() == track.keyframes.size()) Runtime.trap("keyframe not found");
    { track with keyframes = filtered };
  };

  /// Update a keyframe's value and/or easing; traps if not found.
  public func updateKeyframe(
    track      : Types.KeyframeTrack,
    keyframeId : Types.KeyframeId,
    value      : ?Float,
    easing     : ?Types.EasingType,
  ) : Types.KeyframeTrack {
    var found = false;
    let updated = track.keyframes.map(func(k) {
      if (k.id == keyframeId) {
        found := true;
        let v = switch (value)  { case (?v) v; case null k.value  };
        let e = switch (easing) { case (?e) e; case null k.easing };
        { k with value = v; easing = e };
      } else k;
    });
    if (not found) Runtime.trap("keyframe not found");
    { track with keyframes = updated };
  };

  /// Interpolate the value for a given time on a keyframe track.
  /// Returns null when there are no keyframes.
  public func interpolate(
    track : Types.KeyframeTrack,
    time  : Float,
  ) : ?Float {
    let kfs = track.keyframes;
    if (kfs.size() == 0) return null;
    // Clamp to first/last
    let first = kfs[0];
    let last  = kfs[kfs.size() - 1];
    if (time <= first.time) return ?first.value;
    if (time >= last.time)  return ?last.value;
    // Find surrounding pair
    var i = 0;
    while (i + 1 < kfs.size()) {
      let a = kfs[i];
      let b = kfs[i + 1];
      if (time >= a.time and time <= b.time) {
        let t = (time - a.time) / (b.time - a.time);
        let lerped = a.value + t * (b.value - a.value);
        return ?lerped;
      };
      i += 1;
    };
    ?last.value;
  };

  /// Upsert a KeyframeTrack in a track array (by propertyName).
  /// If the property already has a track, it is replaced; otherwise appended.
  public func upsertTrack(
    tracks : [Types.KeyframeTrack],
    track  : Types.KeyframeTrack,
  ) : [Types.KeyframeTrack] {
    let found = tracks.find(func(t) { t.propertyName == track.propertyName });
    switch (found) {
      case (?_) {
        tracks.map(func(t) {
          if (t.propertyName == track.propertyName) track else t;
        });
      };
      case null { tracks.concat([track]) };
    };
  };

}
