module {

  // ── Easing ────────────────────────────────────────────────────────────────

  public type EasingType = {
    #linear;
    #easeIn;
    #easeOut;
    #easeInOut;
    #bounce;
  };

  // ── Animatable properties ─────────────────────────────────────────────────

  public type AnimatableProperty = {
    #position_x;
    #position_y;
    #scale_x;
    #scale_y;
    #rotation;
    #opacity;
    #effect_intensity;
    #blur_radius;
    #hue_shift;
    #saturation;
    #shake_intensity;
    #shake_speed;
  };

  // ── Keyframe ──────────────────────────────────────────────────────────────

  public type KeyframeId = Nat;

  /// A single keyframe at a given time with a value and easing toward the next keyframe.
  public type Keyframe = {
    id     : KeyframeId;
    time   : Float;      // seconds from clip start
    value  : Float;
    easing : EasingType;
  };

  // ── KeyframeTrack ─────────────────────────────────────────────────────────

  /// A track of keyframes for one animatable property.
  public type KeyframeTrack = {
    propertyName : AnimatableProperty;
    keyframes    : [Keyframe];
  };

}
