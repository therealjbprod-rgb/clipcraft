import List  "mo:core/List";
import Stack "mo:core/Stack";
import Time  "mo:core/Time";
import KFTypes "../types/keyframes";
import EfTypes "../types/effects";

module {
  public type ProjectId = Nat;
  public type ClipId = Nat;
  public type TrackId = Nat;

  public type ClipType = { #video; #audio; #image; #text };

  /// Properties specific to text clips.
  public type TextClipProps = {
    content    : Text;
    fontFamily : Text;
    fontSize   : Float;
    fontColor  : Text;   // CSS hex/rgba string
    alignment  : { #left; #center; #right };
    bold       : Bool;
    italic     : Bool;
  };

  public type TransitionType = {
    #crossfade;
    #dissolve;
    #slide;
    #zoom;
    #fadeToBlack;
  };

  public type ColorFilter = {
    brightness  : Float;  // -100.0 to 100.0
    contrast    : Float;  // -100.0 to 100.0
    saturation  : Float;  // -100.0 to 100.0
    hueRotation : Float;  // 0.0 to 360.0
    opacity     : Float;  // 0.0 to 1.0
  };

  public type Transition = {
    transitionType : TransitionType;
    duration       : Float; // seconds, 0.3 to 2.0
  };

  // Immutable shared clip (API boundary)
  public type Clip = {
    id          : ClipId;
    trackId     : TrackId;
    fileRef     : Text;  // object-storage asset key
    clipType    : ClipType;
    duration    : Float; // seconds
    trimIn      : Float; // seconds
    trimOut     : Float; // seconds
    speed       : Float; // 0.5 to 2.0
    volume      : Float; // 0.0 to 100.0
    colorFilter : ColorFilter;
    transition     : ?Transition; // transition AFTER this clip
    position       : Nat;   // zero-indexed order within track
    textProps      : ?TextClipProps;
    keyframeTracks : [KFTypes.KeyframeTrack];
    effects        : [EfTypes.Effect];
  };

  // Mutable version for internal storage
  public type ClipMutable = {
    id              : ClipId;
    trackId         : TrackId;
    var fileRef     : Text;
    var clipType    : ClipType;
    var duration    : Float;
    var trimIn      : Float;
    var trimOut     : Float;
    var speed       : Float;
    var volume      : Float;
    var colorFilter : ColorFilter;
    var transition     : ?Transition;
    var position       : Nat;
    var textProps      : ?TextClipProps;
    var keyframeTracks : [KFTypes.KeyframeTrack];
    var effects        : [EfTypes.Effect];
  };

  public type MusicTrack = {
    fileRef : Text;  // object-storage asset key
    volume  : Float; // 0.0 to 100.0
    muted   : Bool;
  };

  // Immutable snapshot for undo/redo history
  public type TimelineSnapshot = {
    clips      : [Clip];
    musicTrack : ?MusicTrack;
  };

  public type ProjectMeta = {
    id            : ProjectId;
    owner         : Principal;
    name          : Text;
    createdAt     : Time.Time;
    lastModified  : Time.Time;
    totalDuration : Float; // seconds
  };

  public type Project = {
    meta       : ProjectMeta;
    clips      : [Clip];
    musicTrack : ?MusicTrack;
  };

  // Internal mutable project (stored in canister state)
  public type ProjectInternal = {
    id                : ProjectId;
    owner             : Principal;
    var name          : Text;
    createdAt         : Time.Time;
    var lastModified  : Time.Time;
    var totalDuration : Float;
    clips             : List.List<ClipMutable>;
    var musicTrack    : ?MusicTrack;
    undoStack         : Stack.Stack<TimelineSnapshot>;
    redoStack         : Stack.Stack<TimelineSnapshot>;
  };
}
