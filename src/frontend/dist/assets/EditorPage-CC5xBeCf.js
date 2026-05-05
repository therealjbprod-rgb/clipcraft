import { j as jsxRuntimeExports, r as reactExports, R as React2, u as useEditorStore } from "./index-CVmM3hSM.js";
import { S as Slot, c as cn, a as cva, u as useComposedRefs, b as createLucideIcon, B as Button, d as useTheme, F as Film } from "./useTheme-DzgyOB_M.js";
import { P as Primitive, S as Sparkles } from "./sparkles-Trl0JvTP.js";
import { u as useLayoutEffect2, c as createContextScope$1, a as createSlot, b as useControllableState, d as composeEventHandlers, P as Primitive$1, T as Trash2, e as Plus, S as Sun, M as Moon, f as Skeleton, g as useActor, h as createActor } from "./backend-ZxJz7qmr.js";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root$2 = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root$2,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
var DirectionContext = reactExports.createContext(void 0);
function useDirection(localDir) {
  const globalDir = reactExports.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
function useSize(element) {
  const [size, setSize] = reactExports.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope2] = createContextScope$1(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React2.useRef(null);
    const itemMap = React2.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React2.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React2.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection2(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React2.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection2,
    createCollectionScope2
  ];
}
var PAGE_KEYS = ["PageUp", "PageDown"];
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var BACK_KEYS = {
  "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
  "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
  "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"]
};
var SLIDER_NAME = "Slider";
var [Collection, useCollection, createCollectionScope] = createCollection(SLIDER_NAME);
var [createSliderContext] = createContextScope$1(SLIDER_NAME, [
  createCollectionScope
]);
var [SliderProvider, useSliderContext] = createSliderContext(SLIDER_NAME);
var Slider$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      name,
      min = 0,
      max = 100,
      step = 1,
      orientation = "horizontal",
      disabled = false,
      minStepsBetweenThumbs = 0,
      defaultValue = [min],
      value,
      onValueChange = () => {
      },
      onValueCommit = () => {
      },
      inverted = false,
      form,
      ...sliderProps
    } = props;
    const thumbRefs = reactExports.useRef(/* @__PURE__ */ new Set());
    const valueIndexToChangeRef = reactExports.useRef(0);
    const isHorizontal = orientation === "horizontal";
    const SliderOrientation = isHorizontal ? SliderHorizontal : SliderVertical;
    const [values = [], setValues] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: (value2) => {
        var _a;
        const thumbs = [...thumbRefs.current];
        (_a = thumbs[valueIndexToChangeRef.current]) == null ? void 0 : _a.focus();
        onValueChange(value2);
      }
    });
    const valuesBeforeSlideStartRef = reactExports.useRef(values);
    function handleSlideStart(value2) {
      const closestIndex = getClosestValueIndex(values, value2);
      updateValues(value2, closestIndex);
    }
    function handleSlideMove(value2) {
      updateValues(value2, valueIndexToChangeRef.current);
    }
    function handleSlideEnd() {
      const prevValue = valuesBeforeSlideStartRef.current[valueIndexToChangeRef.current];
      const nextValue = values[valueIndexToChangeRef.current];
      const hasChanged = nextValue !== prevValue;
      if (hasChanged) onValueCommit(values);
    }
    function updateValues(value2, atIndex, { commit } = { commit: false }) {
      const decimalCount = getDecimalCount(step);
      const snapToStep = roundValue(Math.round((value2 - min) / step) * step + min, decimalCount);
      const nextValue = clamp(snapToStep, [min, max]);
      setValues((prevValues = []) => {
        const nextValues = getNextSortedValues(prevValues, nextValue, atIndex);
        if (hasMinStepsBetweenValues(nextValues, minStepsBetweenThumbs * step)) {
          valueIndexToChangeRef.current = nextValues.indexOf(nextValue);
          const hasChanged = String(nextValues) !== String(prevValues);
          if (hasChanged && commit) onValueCommit(nextValues);
          return hasChanged ? nextValues : prevValues;
        } else {
          return prevValues;
        }
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderProvider,
      {
        scope: props.__scopeSlider,
        name,
        disabled,
        min,
        max,
        valueIndexToChangeRef,
        thumbs: thumbRefs.current,
        values,
        orientation,
        form,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderOrientation,
          {
            "aria-disabled": disabled,
            "data-disabled": disabled ? "" : void 0,
            ...sliderProps,
            ref: forwardedRef,
            onPointerDown: composeEventHandlers(sliderProps.onPointerDown, () => {
              if (!disabled) valuesBeforeSlideStartRef.current = values;
            }),
            min,
            max,
            inverted,
            onSlideStart: disabled ? void 0 : handleSlideStart,
            onSlideMove: disabled ? void 0 : handleSlideMove,
            onSlideEnd: disabled ? void 0 : handleSlideEnd,
            onHomeKeyDown: () => !disabled && updateValues(min, 0, { commit: true }),
            onEndKeyDown: () => !disabled && updateValues(max, values.length - 1, { commit: true }),
            onStepKeyDown: ({ event, direction: stepDirection }) => {
              if (!disabled) {
                const isPageKey = PAGE_KEYS.includes(event.key);
                const isSkipKey = isPageKey || event.shiftKey && ARROW_KEYS.includes(event.key);
                const multiplier = isSkipKey ? 10 : 1;
                const atIndex = valueIndexToChangeRef.current;
                const value2 = values[atIndex];
                const stepInDirection = step * multiplier * stepDirection;
                updateValues(value2 + stepInDirection, atIndex, { commit: true });
              }
            }
          }
        ) }) })
      }
    );
  }
);
Slider$1.displayName = SLIDER_NAME;
var [SliderOrientationProvider, useSliderOrientationContext] = createSliderContext(SLIDER_NAME, {
  startEdge: "left",
  endEdge: "right",
  size: "width",
  direction: 1
});
var SliderHorizontal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      dir,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const [slider, setSlider] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setSlider(node));
    const rectRef = reactExports.useRef(void 0);
    const direction = useDirection(dir);
    const isDirectionLTR = direction === "ltr";
    const isSlidingFromLeft = isDirectionLTR && !inverted || !isDirectionLTR && inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || slider.getBoundingClientRect();
      const input = [0, rect.width];
      const output = isSlidingFromLeft ? [min, max] : [max, min];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.left);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromLeft ? "left" : "right",
        endEdge: isSlidingFromLeft ? "right" : "left",
        direction: isSlidingFromLeft ? 1 : -1,
        size: "width",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            dir: direction,
            "data-orientation": "horizontal",
            ...sliderProps,
            ref: composedRefs,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientX);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromLeft ? "from-left" : "from-right";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderVertical = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      min,
      max,
      inverted,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const sliderRef = reactExports.useRef(null);
    const ref = useComposedRefs(forwardedRef, sliderRef);
    const rectRef = reactExports.useRef(void 0);
    const isSlidingFromBottom = !inverted;
    function getValueFromPointer(pointerPosition) {
      const rect = rectRef.current || sliderRef.current.getBoundingClientRect();
      const input = [0, rect.height];
      const output = isSlidingFromBottom ? [max, min] : [min, max];
      const value = linearScale(input, output);
      rectRef.current = rect;
      return value(pointerPosition - rect.top);
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SliderOrientationProvider,
      {
        scope: props.__scopeSlider,
        startEdge: isSlidingFromBottom ? "bottom" : "top",
        endEdge: isSlidingFromBottom ? "top" : "bottom",
        size: "height",
        direction: isSlidingFromBottom ? 1 : -1,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          SliderImpl,
          {
            "data-orientation": "vertical",
            ...sliderProps,
            ref,
            style: {
              ...sliderProps.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)"
            },
            onSlideStart: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideStart == null ? void 0 : onSlideStart(value);
            },
            onSlideMove: (event) => {
              const value = getValueFromPointer(event.clientY);
              onSlideMove == null ? void 0 : onSlideMove(value);
            },
            onSlideEnd: () => {
              rectRef.current = void 0;
              onSlideEnd == null ? void 0 : onSlideEnd();
            },
            onStepKeyDown: (event) => {
              const slideDirection = isSlidingFromBottom ? "from-bottom" : "from-top";
              const isBackKey = BACK_KEYS[slideDirection].includes(event.key);
              onStepKeyDown == null ? void 0 : onStepKeyDown({ event, direction: isBackKey ? -1 : 1 });
            }
          }
        )
      }
    );
  }
);
var SliderImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSlider,
      onSlideStart,
      onSlideMove,
      onSlideEnd,
      onHomeKeyDown,
      onEndKeyDown,
      onStepKeyDown,
      ...sliderProps
    } = props;
    const context = useSliderContext(SLIDER_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.span,
      {
        ...sliderProps,
        ref: forwardedRef,
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          if (event.key === "Home") {
            onHomeKeyDown(event);
            event.preventDefault();
          } else if (event.key === "End") {
            onEndKeyDown(event);
            event.preventDefault();
          } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(event.key)) {
            onStepKeyDown(event);
            event.preventDefault();
          }
        }),
        onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
          const target = event.target;
          target.setPointerCapture(event.pointerId);
          event.preventDefault();
          if (context.thumbs.has(target)) {
            target.focus();
          } else {
            onSlideStart(event);
          }
        }),
        onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) onSlideMove(event);
        }),
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          const target = event.target;
          if (target.hasPointerCapture(event.pointerId)) {
            target.releasePointerCapture(event.pointerId);
            onSlideEnd(event);
          }
        })
      }
    );
  }
);
var TRACK_NAME = "SliderTrack";
var SliderTrack = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...trackProps } = props;
    const context = useSliderContext(TRACK_NAME, __scopeSlider);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.span,
      {
        "data-disabled": context.disabled ? "" : void 0,
        "data-orientation": context.orientation,
        ...trackProps,
        ref: forwardedRef
      }
    );
  }
);
SliderTrack.displayName = TRACK_NAME;
var RANGE_NAME = "SliderRange";
var SliderRange = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, ...rangeProps } = props;
    const context = useSliderContext(RANGE_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(RANGE_NAME, __scopeSlider);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const valuesCount = context.values.length;
    const percentages = context.values.map(
      (value) => convertValueToPercentage(value, context.min, context.max)
    );
    const offsetStart = valuesCount > 1 ? Math.min(...percentages) : 0;
    const offsetEnd = 100 - Math.max(...percentages);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.span,
      {
        "data-orientation": context.orientation,
        "data-disabled": context.disabled ? "" : void 0,
        ...rangeProps,
        ref: composedRefs,
        style: {
          ...props.style,
          [orientation.startEdge]: offsetStart + "%",
          [orientation.endEdge]: offsetEnd + "%"
        }
      }
    );
  }
);
SliderRange.displayName = RANGE_NAME;
var THUMB_NAME = "SliderThumb";
var SliderThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const getItems = useCollection(props.__scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const index = reactExports.useMemo(
      () => thumb ? getItems().findIndex((item) => item.ref.current === thumb) : -1,
      [getItems, thumb]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumbImpl, { ...props, ref: composedRefs, index });
  }
);
var SliderThumbImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSlider, index, name, ...thumbProps } = props;
    const context = useSliderContext(THUMB_NAME, __scopeSlider);
    const orientation = useSliderOrientationContext(THUMB_NAME, __scopeSlider);
    const [thumb, setThumb] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setThumb(node));
    const isFormControl = thumb ? context.form || !!thumb.closest("form") : true;
    const size = useSize(thumb);
    const value = context.values[index];
    const percent = value === void 0 ? 0 : convertValueToPercentage(value, context.min, context.max);
    const label = getLabel(index, context.values.length);
    const orientationSize = size == null ? void 0 : size[orientation.size];
    const thumbInBoundsOffset = orientationSize ? getThumbInBoundsOffset(orientationSize, percent, orientation.direction) : 0;
    reactExports.useEffect(() => {
      if (thumb) {
        context.thumbs.add(thumb);
        return () => {
          context.thumbs.delete(thumb);
        };
      }
    }, [thumb, context.thumbs]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        style: {
          transform: "var(--radix-slider-thumb-transform)",
          position: "absolute",
          [orientation.startEdge]: `calc(${percent}% + ${thumbInBoundsOffset}px)`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: props.__scopeSlider, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Primitive$1.span,
            {
              role: "slider",
              "aria-label": props["aria-label"] || label,
              "aria-valuemin": context.min,
              "aria-valuenow": value,
              "aria-valuemax": context.max,
              "aria-orientation": context.orientation,
              "data-orientation": context.orientation,
              "data-disabled": context.disabled ? "" : void 0,
              tabIndex: context.disabled ? void 0 : 0,
              ...thumbProps,
              ref: composedRefs,
              style: value === void 0 ? { display: "none" } : props.style,
              onFocus: composeEventHandlers(props.onFocus, () => {
                context.valueIndexToChangeRef.current = index;
              })
            }
          ) }),
          isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            SliderBubbleInput,
            {
              name: name ?? (context.name ? context.name + (context.values.length > 1 ? "[]" : "") : void 0),
              form: context.form,
              value
            },
            index
          )
        ]
      }
    );
  }
);
SliderThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var SliderBubbleInput = reactExports.forwardRef(
  ({ __scopeSlider, value, ...props }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevValue = usePrevious(value);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(inputProto, "value");
      const setValue = descriptor.set;
      if (prevValue !== value && setValue) {
        const event = new Event("input", { bubbles: true });
        setValue.call(input, value);
        input.dispatchEvent(event);
      }
    }, [prevValue, value]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive$1.input,
      {
        style: { display: "none" },
        ...props,
        ref: composedRefs,
        defaultValue: value
      }
    );
  }
);
SliderBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getNextSortedValues(prevValues = [], nextValue, atIndex) {
  const nextValues = [...prevValues];
  nextValues[atIndex] = nextValue;
  return nextValues.sort((a, b) => a - b);
}
function convertValueToPercentage(value, min, max) {
  const maxSteps = max - min;
  const percentPerStep = 100 / maxSteps;
  const percentage = percentPerStep * (value - min);
  return clamp(percentage, [0, 100]);
}
function getLabel(index, totalValues) {
  if (totalValues > 2) {
    return `Value ${index + 1} of ${totalValues}`;
  } else if (totalValues === 2) {
    return ["Minimum", "Maximum"][index];
  } else {
    return void 0;
  }
}
function getClosestValueIndex(values, nextValue) {
  if (values.length === 1) return 0;
  const distances = values.map((value) => Math.abs(value - nextValue));
  const closestDistance = Math.min(...distances);
  return distances.indexOf(closestDistance);
}
function getThumbInBoundsOffset(width, left, direction) {
  const halfWidth = width / 2;
  const halfPercent = 50;
  const offset = linearScale([0, halfPercent], [0, halfWidth]);
  return (halfWidth - offset(left) * direction) * direction;
}
function getStepsBetweenValues(values) {
  return values.slice(0, -1).map((value, index) => values[index + 1] - value);
}
function hasMinStepsBetweenValues(values, minStepsBetweenValues) {
  if (minStepsBetweenValues > 0) {
    const stepsBetweenValues = getStepsBetweenValues(values);
    const actualMinStepsBetweenValues = Math.min(...stepsBetweenValues);
    return actualMinStepsBetweenValues >= minStepsBetweenValues;
  }
  return true;
}
function linearScale(input, output) {
  return (value) => {
    if (input[0] === input[1] || output[0] === output[1]) return output[0];
    const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    return output[0] + ratio * (value - input[0]);
  };
}
function getDecimalCount(value) {
  return (String(value).split(".")[1] || "").length;
}
function roundValue(value, decimalCount) {
  const rounder = Math.pow(10, decimalCount);
  return Math.round(value * rounder) / rounder;
}
var Root$1 = Slider$1;
var Track = SliderTrack;
var Range = SliderRange;
var Thumb = SliderThumb;
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = reactExports.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Root$1,
    {
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Track,
          {
            "data-slot": "slider-track",
            className: cn(
              "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Range,
              {
                "data-slot": "slider-range",
                className: cn(
                  "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                )
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (value2, _) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Thumb,
          {
            "data-slot": "slider-thumb",
            className: "border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          },
          `${value2}`
        ))
      ]
    }
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$H = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$H);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$G = [
  ["path", { d: "M17 12H7", key: "16if0g" }],
  ["path", { d: "M19 18H5", key: "18s9l3" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignCenter = createLucideIcon("align-center", __iconNode$G);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$F = [
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 18H3", key: "1amg6g" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignLeft = createLucideIcon("align-left", __iconNode$F);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$E = [
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M21 18H7", key: "1ygte8" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }]
];
const AlignRight = createLucideIcon("align-right", __iconNode$E);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$D = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = createLucideIcon("arrow-down", __iconNode$D);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$C = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$C);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$B = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$B);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$A = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = createLucideIcon("arrow-up", __iconNode$A);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$z = [
  ["circle", { cx: "9", cy: "9", r: "7", key: "p2h5vp" }],
  ["circle", { cx: "15", cy: "15", r: "7", key: "19ennj" }]
];
const Blend = createLucideIcon("blend", __iconNode$z);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$y = [
  [
    "path",
    { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", key: "mg9rjx" }
  ]
];
const Bold = createLucideIcon("bold", __iconNode$y);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$x = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10", key: "1xfpm4" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4", key: "be30l9" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14", key: "1r4le6" }]
];
const ChartNoAxesColumn = createLucideIcon("chart-no-axes-column", __iconNode$x);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$w = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$w);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$v = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$v);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$u = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
      key: "1f1r0c"
    }
  ]
];
const Diamond = createLucideIcon("diamond", __iconNode$u);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$t = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode$t);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$s = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$s);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$r = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image$1 = createLucideIcon("image", __iconNode$r);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$q = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode$q);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$p = [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
];
const Italic = createLucideIcon("italic", __iconNode$p);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$o = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
      key: "zw3jo"
    }
  ],
  [
    "path",
    {
      d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
      key: "1wduqc"
    }
  ],
  [
    "path",
    {
      d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
      key: "kqbvx6"
    }
  ]
];
const Layers = createLucideIcon("layers", __iconNode$o);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$n = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$n);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$m = [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }]
];
const Music2 = createLucideIcon("music-2", __iconNode$m);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$l = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
      key: "e79jfc"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor", key: "1okk4w" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor", key: "f64h9f" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor", key: "qy21gx" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor", key: "fotxhn" }]
];
const Palette = createLucideIcon("palette", __iconNode$l);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$k = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$k);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$j = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode$j);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$i = [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
];
const Redo2 = createLucideIcon("redo-2", __iconNode$i);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$h = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$h);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$g = [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", key: "1p45f6" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }]
];
const RotateCw = createLucideIcon("rotate-cw", __iconNode$g);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$f = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$f);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$e = [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
];
const Scissors = createLucideIcon("scissors", __iconNode$e);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$d = [
  ["polygon", { points: "19 20 9 12 19 4 19 20", key: "o2sva" }],
  ["line", { x1: "5", x2: "5", y1: "19", y2: "5", key: "1ocqjk" }]
];
const SkipBack = createLucideIcon("skip-back", __iconNode$d);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$c = [
  ["polygon", { points: "5 4 15 12 5 20 5 4", key: "16p6eg" }],
  ["line", { x1: "19", x2: "19", y1: "5", y2: "19", key: "futhcm" }]
];
const SkipForward = createLucideIcon("skip-forward", __iconNode$c);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$b = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
];
const Square = createLucideIcon("square", __iconNode$b);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$a = [
  ["path", { d: "M12 4v16", key: "1654pz" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2", key: "e0r10z" }],
  ["path", { d: "M9 20h6", key: "s66wpe" }]
];
const Type = createLucideIcon("type", __iconNode$a);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$9 = [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
];
const Undo2 = createLucideIcon("undo-2", __iconNode$9);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$8 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$8);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$7 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode$7);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
      key: "ul74o6"
    }
  ],
  ["path", { d: "m14 7 3 3", key: "1r5n42" }],
  ["path", { d: "M5 6v4", key: "ilb8ba" }],
  ["path", { d: "M19 14v4", key: "blhpug" }],
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M7 8H3", key: "zfb6yr" }],
  ["path", { d: "M21 16h-4", key: "1cnmox" }],
  ["path", { d: "M11 3H9", key: "1obp7u" }]
];
const WandSparkles = createLucideIcon("wand-sparkles", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }]
];
const Wind = createLucideIcon("wind", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
];
const Zap = createLucideIcon("zap", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomIn = createLucideIcon("zoom-in", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
];
const ZoomOut = createLucideIcon("zoom-out", __iconNode);
function defaultColorFilter() {
  return {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotation: 0,
    opacity: 100
  };
}
function defaultTextClipProps() {
  return {
    content: "Text",
    fontFamily: "Space Grotesk",
    fontSize: 48,
    fontColor: "#ffffff",
    bold: false,
    italic: false,
    alignment: "center"
  };
}
function formatTime$4(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toFixed(2).padStart(5, "0");
  return `${m}:${s}`;
}
const SPEED_PRESETS = [0.5, 0.75, 1, 1.5, 2];
const TRANSITION_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Crossfade", value: "crossfade" },
  { label: "Dissolve", value: "dissolve" },
  { label: "Slide", value: "slide" },
  { label: "Zoom", value: "zoom" },
  { label: "Fade to Black", value: "fadeToBlack" }
];
const FONT_FAMILIES = [
  "Space Grotesk",
  "Inter",
  "Roboto",
  "Montserrat",
  "Oswald",
  "Playfair Display",
  "Impact",
  "Georgia"
];
function ClipPropertiesPanel() {
  var _a;
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const clips = useEditorStore((s) => s.clips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const removeClip = useEditorStore((s) => s.removeClip);
  const updateEffect = useEditorStore((s) => s.updateEffect);
  const removeEffect = useEditorStore((s) => s.removeEffect);
  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;
  if (!selectedClip) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "properties.panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground/80", children: "Properties" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2 p-4",
          "data-ocid": "properties.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-8 h-8 opacity-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center", children: "Select a clip to edit its properties" })
          ]
        }
      )
    ] });
  }
  const cf = selectedClip.colorFilter;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "properties.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground/80", children: "Clip Properties" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground truncate mt-0.5", children: selectedClip.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] capitalize", children: selectedClip.clipType })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Duration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono", children: formatTime$4(selectedClip.duration) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider block mb-2", children: "Speed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 flex-wrap", children: SPEED_PRESETS.map((sp) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: cn(
              "px-2 py-0.5 rounded text-[11px] border transition-smooth",
              Math.abs(selectedClip.speed - sp) < 0.01 ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
            ),
            onClick: () => updateClip(selectedClip.id, { speed: sp }),
            "data-ocid": `properties.speed_${String(sp).replace(".", "_")}_button`,
            children: [
              sp,
              "x"
            ]
          },
          sp
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Volume" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-muted-foreground hover:text-foreground transition-colors",
                onClick: () => updateClip(selectedClip.id, {
                  volume: selectedClip.volume > 0 ? 0 : 100
                }),
                "data-ocid": "properties.volume_mute_toggle",
                children: selectedClip.volume === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono w-8 text-right", children: [
              selectedClip.volume,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            value: [selectedClip.volume],
            min: 0,
            max: 100,
            step: 1,
            onValueChange: ([v]) => updateClip(selectedClip.id, { volume: v }),
            "data-ocid": "properties.volume_slider"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider block mb-2", children: "Trim" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block mb-1", children: "In point" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                className: "w-full bg-input border border-border rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                value: selectedClip.trimIn.toFixed(2),
                min: 0,
                max: selectedClip.duration - selectedClip.trimOut - 0.1,
                step: 0.1,
                onChange: (e) => updateClip(selectedClip.id, {
                  trimIn: Math.max(0, Number(e.target.value))
                }),
                "data-ocid": "properties.trim_in_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block mb-1", children: "Out point" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "number",
                className: "w-full bg-input border border-border rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                value: selectedClip.trimOut.toFixed(2),
                min: 0,
                max: selectedClip.duration - selectedClip.trimIn - 0.1,
                step: 0.1,
                onChange: (e) => updateClip(selectedClip.id, {
                  trimOut: Math.max(0, Number(e.target.value))
                }),
                "data-ocid": "properties.trim_out_input"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider block mb-2", children: "Transition" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            className: "w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
            value: ((_a = selectedClip.transition) == null ? void 0 : _a.type) ?? "none",
            onChange: (e) => {
              var _a2;
              const v = e.target.value;
              updateClip(selectedClip.id, {
                transition: v === "none" ? null : {
                  type: v,
                  duration: ((_a2 = selectedClip.transition) == null ? void 0 : _a2.duration) ?? 0.5
                }
              });
            },
            "data-ocid": "properties.transition_select",
            children: TRANSITION_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: opt.label }, opt.value))
          }
        ),
        selectedClip.transition && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "Duration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-mono", children: [
              selectedClip.transition.duration.toFixed(1),
              "s"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: [selectedClip.transition.duration],
              min: 0.3,
              max: 2,
              step: 0.1,
              onValueChange: ([v]) => updateClip(selectedClip.id, {
                transition: selectedClip.transition ? { ...selectedClip.transition, duration: v } : null
              }),
              "data-ocid": "properties.transition_duration_slider"
            }
          )
        ] })
      ] }),
      selectedClip.clipType !== "audio" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors",
                onClick: () => updateClip(selectedClip.id, {
                  colorFilter: defaultColorFilter()
                }),
                "data-ocid": "properties.color_reset_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-3 h-3" }),
                  " Reset"
                ]
              }
            )
          ] }),
          [
            ["Brightness", "brightness", 0, 200],
            ["Contrast", "contrast", 0, 200],
            ["Saturation", "saturation", 0, 200],
            ["Hue Rotation", "hueRotation", 0, 360],
            ["Opacity", "opacity", 0, 100]
          ].map(([label, key, min, max]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono", children: cf[key] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Slider,
              {
                value: [cf[key]],
                min,
                max,
                step: 1,
                onValueChange: ([v]) => updateClip(selectedClip.id, {
                  colorFilter: { ...cf, [key]: v }
                }),
                "data-ocid": `properties.${key}_slider`
              }
            )
          ] }, key))
        ] })
      ] }),
      selectedClip.clipType === "text" && selectedClip.textProps && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider block mb-3", children: "Text" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block mb-1", children: "Content" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none",
                rows: 3,
                value: selectedClip.textProps.content,
                onChange: (e) => updateClip(selectedClip.id, {
                  textProps: {
                    ...selectedClip.textProps,
                    content: e.target.value
                  }
                }),
                "data-ocid": "properties.text_content_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block mb-1", children: "Font Family" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "w-full bg-input border border-border rounded px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                value: selectedClip.textProps.fontFamily,
                onChange: (e) => updateClip(selectedClip.id, {
                  textProps: {
                    ...selectedClip.textProps,
                    fontFamily: e.target.value
                  }
                }),
                "data-ocid": "properties.text_font_family_select",
                children: FONT_FAMILIES.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f, children: f }, f))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block mb-1", children: "Size" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: 8,
                  max: 200,
                  step: 1,
                  className: "w-full bg-input border border-border rounded px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
                  value: selectedClip.textProps.fontSize,
                  onChange: (e) => updateClip(selectedClip.id, {
                    textProps: {
                      ...selectedClip.textProps,
                      fontSize: Number(e.target.value)
                    }
                  }),
                  "data-ocid": "properties.text_font_size_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground block mb-1", children: "Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  className: "w-full h-[28px] rounded border border-border bg-input cursor-pointer",
                  value: selectedClip.textProps.fontColor,
                  onChange: (e) => updateClip(selectedClip.id, {
                    textProps: {
                      ...selectedClip.textProps,
                      fontColor: e.target.value
                    }
                  }),
                  "data-ocid": "properties.text_color_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: cn(
                  "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                  selectedClip.textProps.bold ? "bg-primary/20 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                ),
                onClick: () => updateClip(selectedClip.id, {
                  textProps: {
                    ...selectedClip.textProps,
                    bold: !selectedClip.textProps.bold
                  }
                }),
                "data-ocid": "properties.text_bold_toggle",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: cn(
                  "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                  selectedClip.textProps.italic ? "bg-primary/20 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                ),
                onClick: () => updateClip(selectedClip.id, {
                  textProps: {
                    ...selectedClip.textProps,
                    italic: !selectedClip.textProps.italic
                  }
                }),
                "data-ocid": "properties.text_italic_toggle",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "w-3.5 h-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
            ["left", "center", "right"].map((align) => {
              const AlignIcon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: cn(
                    "w-7 h-7 rounded flex items-center justify-center border transition-colors",
                    selectedClip.textProps.alignment === align ? "bg-primary/20 border-primary/50 text-primary" : "border-border text-muted-foreground hover:text-foreground"
                  ),
                  onClick: () => updateClip(selectedClip.id, {
                    textProps: {
                      ...selectedClip.textProps,
                      alignment: align
                    }
                  }),
                  "data-ocid": `properties.text_align_${align}_button`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlignIcon, { className: "w-3.5 h-3.5" })
                },
                align
              );
            })
          ] })
        ] })
      ] }),
      selectedClip.effects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider", children: "Applied Effects" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 text-primary/60" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: selectedClip.effects.map((effect, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg border border-border bg-muted/20 p-2.5",
              "data-ocid": `properties.effect.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground capitalize", children: effect.effectType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "text-muted-foreground hover:text-destructive transition-colors",
                      onClick: () => removeEffect(selectedClip.id, effect.id),
                      "data-ocid": `properties.effect.${i + 1}.delete_button`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
                    }
                  )
                ] }),
                Object.entries(effect.params).map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 last:mb-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground capitalize", children: key.replace(/_/g, " ") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-foreground/70", children: typeof value === "number" ? value % 1 !== 0 ? value.toFixed(2) : value : String(value) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Slider,
                    {
                      value: [value],
                      min: 0,
                      max: effect.effectType === "blur" ? 20 : effect.effectType === "shake" ? 10 : 3,
                      step: 0.1,
                      onValueChange: ([v]) => updateEffect(selectedClip.id, effect.id, {
                        params: { ...effect.params, [key]: v }
                      }),
                      "data-ocid": `properties.effect.${i + 1}.${key}_slider`
                    }
                  )
                ] }, key))
              ]
            },
            effect.id
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "destructive",
          size: "sm",
          className: "w-full",
          onClick: () => removeClip(selectedClip.id),
          "data-ocid": "properties.delete_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 mr-1.5" }),
            " Remove Clip"
          ]
        }
      )
    ] })
  ] });
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
function useTimeline() {
  const clips = useEditorStore((s) => s.clips);
  return reactExports.useMemo(() => {
    const sortedClips = [...clips].sort((a, b) => a.position - b.position);
    const clipDurations = {};
    let totalDuration = 0;
    for (const clip of sortedClips) {
      const effective = (clip.duration - clip.trimIn - clip.trimOut) / clip.speed;
      clipDurations[clip.id] = Math.max(0, effective);
      const end = clip.position + clipDurations[clip.id];
      if (end > totalDuration) totalDuration = end;
    }
    return { totalDuration, sortedClips, clipDurations };
  }, [clips]);
}
function ExportPanel({ onClose }) {
  const clips = useEditorStore((s) => s.clips);
  const { totalDuration, sortedClips } = useTimeline();
  const [exportState, setExportState] = reactExports.useState("idle");
  const [progress, setProgress] = reactExports.useState(0);
  const [downloadUrl, setDownloadUrl] = reactExports.useState(null);
  const [errorMsg, setErrorMsg] = reactExports.useState(null);
  const recorderRef = reactExports.useRef(null);
  const abortRef = reactExports.useRef(false);
  const videoClips = sortedClips.filter(
    (c) => c.clipType === "video" || c.clipType === "image"
  );
  const handleExport = reactExports.useCallback(async () => {
    setExportState("exporting");
    setProgress(0);
    setDownloadUrl(null);
    setErrorMsg(null);
    abortRef.current = false;
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setErrorMsg("Canvas not supported");
      setExportState("error");
      return;
    }
    let stream;
    try {
      stream = canvas.captureStream(30);
    } catch {
      setErrorMsg("Canvas stream not supported in this browser.");
      setExportState("error");
      return;
    }
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "video/mp4";
    const chunks = [];
    let recorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType });
    } catch {
      setErrorMsg("MediaRecorder not supported for this format.");
      setExportState("error");
      return;
    }
    recorderRef.current = recorder;
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setExportState("done");
    };
    recorder.start(100);
    const total = Math.max(videoClips.length, 1);
    for (let i = 0; i < videoClips.length; i++) {
      if (abortRef.current) break;
      const clip = videoClips[i];
      setProgress(Math.round(i / total * 90));
      if (clip.clipType === "image") {
        const img = new Image();
        img.src = clip.objectUrl;
        await new Promise((resolve) => {
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let frames = 150;
            const drawFrame = () => {
              if (frames-- <= 0 || abortRef.current) {
                resolve();
                return;
              }
              requestAnimationFrame(drawFrame);
            };
            requestAnimationFrame(drawFrame);
          };
          img.onerror = () => resolve();
        });
      } else {
        const video = document.createElement("video");
        video.src = clip.objectUrl;
        video.muted = true;
        video.currentTime = clip.trimIn;
        video.playbackRate = clip.speed;
        const { brightness, contrast, saturation, hueRotation, opacity } = clip.colorFilter;
        ctx.filter = [
          `brightness(${brightness}%)`,
          `contrast(${contrast}%)`,
          `saturate(${saturation}%)`,
          `hue-rotate(${hueRotation}deg)`,
          `opacity(${opacity}%)`
        ].join(" ");
        const trimEnd = clip.duration - clip.trimOut - clip.trimIn;
        await new Promise((resolve) => {
          video.oncanplay = () => {
            video.play().catch(() => resolve());
          };
          video.onerror = () => resolve();
          const drawLoop = () => {
            if (abortRef.current) {
              video.pause();
              resolve();
              return;
            }
            const localTime = video.currentTime - clip.trimIn;
            if (localTime >= trimEnd || video.ended) {
              video.pause();
              ctx.filter = "none";
              resolve();
              return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(drawLoop);
          };
          video.onplaying = drawLoop;
          video.load();
        });
        ctx.filter = "none";
      }
    }
    if (!abortRef.current) {
      setProgress(100);
    }
    recorder.stop();
    for (const track of stream.getTracks()) {
      track.stop();
    }
  }, [videoClips]);
  const handleCancel = () => {
    var _a;
    abortRef.current = true;
    if (((_a = recorderRef.current) == null ? void 0 : _a.state) === "recording") {
      recorderRef.current.stop();
    }
    setExportState("idle");
    setProgress(0);
  };
  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `clipcraft_export_${Date.now()}.webm`;
    a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      "data-ocid": "export.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-6 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors",
            onClick: onClose,
            "data-ocid": "export.close_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-lg mb-1", children: "Export Project" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: [
          videoClips.length,
          " video clip",
          videoClips.length !== 1 ? "s" : "",
          " ·",
          " ",
          totalDuration.toFixed(1),
          "s total"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-primary shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
            "Export uses",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "MediaRecorder" }),
            " to capture your timeline in real-time. Output is",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: ".webm format" }),
            " — playable in Chrome, Firefox, and most modern browsers. For MP4 conversion, use a free tool like HandBrake."
          ] })
        ] }),
        (exportState === "exporting" || exportState === "done") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", "data-ocid": "export.progress", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: exportState === "done" ? "Export complete!" : "Exporting…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-primary", children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-2" })
        ] }),
        exportState === "error" && errorMsg && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs",
            "data-ocid": "export.error_state",
            children: errorMsg
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          exportState === "idle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "flex-1",
                onClick: handleExport,
                disabled: clips.length === 0,
                "data-ocid": "export.start_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-1.5" }),
                  " Start Export"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: onClose,
                "data-ocid": "export.cancel_button",
                children: "Cancel"
              }
            )
          ] }),
          exportState === "exporting" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "destructive",
              className: "flex-1",
              onClick: handleCancel,
              "data-ocid": "export.abort_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-4 h-4 mr-1.5" }),
                " Stop Export"
              ]
            }
          ),
          exportState === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "flex-1",
                onClick: handleDownload,
                "data-ocid": "export.download_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-1.5" }),
                  " Download .webm"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  setExportState("idle");
                  setProgress(0);
                },
                "data-ocid": "export.export_again_button",
                children: "Export Again"
              }
            )
          ] }),
          exportState === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1",
                onClick: handleExport,
                "data-ocid": "export.retry_button",
                children: "Retry"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: onClose,
                "data-ocid": "export.close_button2",
                children: "Close"
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
const TRACK_COLORS = [
  "oklch(0.7 0.15 200)",
  "oklch(0.7 0.18 30)",
  "oklch(0.65 0.16 120)",
  "oklch(0.65 0.18 280)",
  "oklch(0.7 0.2 40)",
  "oklch(0.68 0.14 160)"
];
const EASING_PRESETS = [
  { label: "Linear", value: "linear" },
  { label: "Ease In", value: "easeIn" },
  { label: "Ease Out", value: "easeOut" },
  { label: "Ease In-Out", value: "easeInOut" },
  { label: "Bounce", value: "bounce" }
];
function evalEasing(t, easing) {
  const p = Math.max(0, Math.min(1, t));
  switch (easing) {
    case "easeIn":
      return p * p;
    case "easeOut":
      return p * (2 - p);
    case "easeInOut":
      return p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let q = p;
      if (q < 1 / d1) return n1 * q * q;
      if (q < 2 / d1) {
        q -= 1.5 / d1;
        return n1 * q * q + 0.75;
      }
      if (q < 2.5 / d1) {
        q -= 2.25 / d1;
        return n1 * q * q + 0.9375;
      }
      q -= 2.625 / d1;
      return n1 * q * q + 0.984375;
    }
    default:
      return p;
  }
}
function interpolateVal(time, kfs) {
  if (kfs.length === 0) return null;
  const sorted = [...kfs].sort((a, b) => a.time - b.time);
  if (time <= sorted[0].time) return sorted[0].value;
  if (time >= sorted[sorted.length - 1].time)
    return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (time >= sorted[i].time && time <= sorted[i + 1].time) {
      const t0 = sorted[i].time;
      const t1 = sorted[i + 1].time;
      const v0 = sorted[i].value;
      const v1 = sorted[i + 1].value;
      const raw = t1 === t0 ? 1 : (time - t0) / (t1 - t0);
      const e = evalEasing(raw, sorted[i].easing);
      return v0 + (v1 - v0) * e;
    }
  }
  return null;
}
function GraphEditor() {
  const canvasRef = reactExports.useRef(null);
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const updateKeyframe = useEditorStore((s) => s.updateKeyframe);
  const setSelectedKeyframeId = useEditorStore((s) => s.setSelectedKeyframeId);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;
  const tracks = (selectedClip == null ? void 0 : selectedClip.keyframeTracks) ?? [];
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.classList.contains("dark");
    const colors = {
      bg: isDark ? "#1a1d24" : "#f8f9fb",
      grid: isDark ? "#2e3240" : "#d4d8e0",
      label: isDark ? "#6b7280" : "#9ca3af",
      emptyText: isDark ? "#6b7280" : "#9ca3af",
      playhead: isDark ? "oklch(0.7 0.15 200)" : "oklch(0.45 0.18 200)",
      kfSelected: isDark ? "#ffffff" : "#111827"
    };
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);
    if (tracks.length === 0) {
      ctx.fillStyle = colors.emptyText;
      ctx.font = "11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        "No keyframe tracks for selected clip",
        width / 2,
        height / 2
      );
      return;
    }
    const PAD = { top: 16, right: 16, bottom: 24, left: 40 };
    const gW = width - PAD.left - PAD.right;
    const gH = height - PAD.top - PAD.bottom;
    let tMin = Number.POSITIVE_INFINITY;
    let tMax = Number.NEGATIVE_INFINITY;
    let vMin = Number.POSITIVE_INFINITY;
    let vMax = Number.NEGATIVE_INFINITY;
    for (const track of tracks) {
      for (const kf of track.keyframes) {
        tMin = Math.min(tMin, kf.time);
        tMax = Math.max(tMax, kf.time);
        vMin = Math.min(vMin, kf.value);
        vMax = Math.max(vMax, kf.value);
      }
    }
    if (!Number.isFinite(tMin)) {
      tMin = 0;
      tMax = 10;
    }
    if (tMin === tMax) {
      tMin -= 0.5;
      tMax += 0.5;
    }
    if (!Number.isFinite(vMin)) {
      vMin = 0;
      vMax = 1;
    }
    if (vMin === vMax) {
      vMin -= 10;
      vMax += 10;
    }
    const tRange = tMax - tMin;
    const vRange = vMax - vMin;
    const toX = (t) => PAD.left + (t - tMin) / tRange * gW;
    const toY = (v) => PAD.top + (1 - (v - vMin) / vRange) * gH;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = PAD.top + i / 4 * gH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + gW, y);
      ctx.stroke();
      const vLabel = (vMax - i / 4 * vRange).toFixed(0);
      ctx.fillStyle = colors.label;
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(vLabel, PAD.left - 4, y + 3);
    }
    tracks.forEach((track, ti) => {
      const color = TRACK_COLORS[ti % TRACK_COLORS.length];
      const kfs = [...track.keyframes].sort((a, b) => a.time - b.time);
      if (kfs.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const steps = 120;
      for (let s = 0; s <= steps; s++) {
        const t = tMin + s / steps * tRange;
        const v = interpolateVal(t, kfs);
        if (v === null) continue;
        const x = toX(t);
        const y = toY(v);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
    tracks.forEach((track, ti) => {
      const color = TRACK_COLORS[ti % TRACK_COLORS.length];
      for (const kf of track.keyframes) {
        const x = toX(kf.time);
        const y = toY(kf.value);
        ctx.beginPath();
        const isSelected = kf.id === selectedKeyframeId;
        ctx.arc(x, y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? colors.kfSelected : color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
    if (selectedClip) {
      const ph = playheadPosition - selectedClip.position;
      if (ph >= tMin && ph <= tMax) {
        const x = toX(ph);
        ctx.strokeStyle = colors.playhead;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, PAD.top);
        ctx.lineTo(x, PAD.top + gH);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [tracks, selectedKeyframeId, playheadPosition, selectedClip]);
  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    if (!canvas || !selectedClip || tracks.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const PAD = { top: 16, right: 16, bottom: 24, left: 40 };
    const gW = canvas.width - PAD.left - PAD.right;
    const gH = canvas.height - PAD.top - PAD.bottom;
    let tMin = Number.POSITIVE_INFINITY;
    let tMax = Number.NEGATIVE_INFINITY;
    let vMin = Number.POSITIVE_INFINITY;
    let vMax = Number.NEGATIVE_INFINITY;
    for (const track of tracks)
      for (const kf of track.keyframes) {
        tMin = Math.min(tMin, kf.time);
        tMax = Math.max(tMax, kf.time);
        vMin = Math.min(vMin, kf.value);
        vMax = Math.max(vMax, kf.value);
      }
    if (!Number.isFinite(tMin)) return;
    if (tMin === tMax) {
      tMin -= 0.5;
      tMax += 0.5;
    }
    if (vMin === vMax) {
      vMin -= 10;
      vMax += 10;
    }
    const toX = (t) => PAD.left + (t - tMin) / (tMax - tMin) * gW;
    const toY = (v) => PAD.top + (1 - (v - vMin) / (vMax - vMin)) * gH;
    let hitId = null;
    for (const track of tracks) {
      for (const kf of track.keyframes) {
        const dx = mx - toX(kf.time);
        const dy = my - toY(kf.value);
        if (Math.sqrt(dx * dx + dy * dy) < 8) {
          hitId = kf.id;
          break;
        }
      }
      if (hitId) break;
    }
    if (hitId) {
      setSelectedKeyframeId(hitId === selectedKeyframeId ? null : hitId);
    } else {
      const t = tMin + (mx - PAD.left) / gW * (tMax - tMin);
      setPlayheadPosition(selectedClip.position + Math.max(0, t));
    }
  }
  function applyPreset(easing) {
    if (!selectedClip || !selectedKeyframeId) return;
    for (const track of tracks) {
      const kf = track.keyframes.find((k) => k.id === selectedKeyframeId);
      if (kf) {
        updateKeyframe(
          selectedClip.id,
          track.propertyName,
          selectedKeyframeId,
          { easing }
        );
        break;
      }
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col border-t border-border bg-card",
      "data-ocid": "graph_editor.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-1.5 border-b border-border shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-foreground/70 uppercase tracking-wider", children: "Graph Editor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: EASING_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-5 text-[9px] px-1.5 py-0",
              disabled: !selectedKeyframeId,
              onClick: () => applyPreset(p.value),
              "data-ocid": `graph_editor.preset_${p.value}_button`,
              children: p.label
            },
            p.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "canvas",
          {
            ref: canvasRef,
            width: 600,
            height: 160,
            className: "w-full h-40 block cursor-crosshair",
            onClick: handleCanvasClick,
            onKeyDown: (e) => {
              if (e.key === "Escape") setSelectedKeyframeId(null);
            },
            tabIndex: 0,
            "aria-label": "Keyframe graph editor",
            "data-ocid": "graph_editor.canvas_target"
          }
        )
      ]
    }
  );
}
const PROPERTY_LABELS = {
  position_x: "Position X",
  position_y: "Position Y",
  scale_x: "Scale X",
  scale_y: "Scale Y",
  rotation: "Rotation",
  opacity: "Opacity",
  shake_intensity: "Shake Intensity",
  shake_speed: "Shake Speed",
  blur_radius: "Blur Radius",
  effect_intensity: "Effect Intensity",
  hue_shift: "Hue Shift",
  saturation: "Saturation"
};
const EASING_OPTIONS = [
  "linear",
  "easeIn",
  "easeOut",
  "easeInOut",
  "bounce"
];
function formatTime$3(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  const f = Math.round(secs % 1 * 30).toString().padStart(2, "0");
  return `${m}:${s}:${f}`;
}
function KeyframePanel() {
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const addKeyframe = useEditorStore((s) => s.addKeyframe);
  const removeKeyframe = useEditorStore((s) => s.removeKeyframe);
  const updateKeyframe = useEditorStore((s) => s.updateKeyframe);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const setSelectedKeyframeId = useEditorStore((s) => s.setSelectedKeyframeId);
  const toggleGraphEditor = useEditorStore((s) => s.toggleGraphEditor);
  const graphEditorVisible = useEditorStore((s) => s.graphEditorVisible);
  const getInterpolatedValue = useEditorStore((s) => s.getInterpolatedValue);
  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;
  if (!selectedClip) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-full gap-2 text-muted-foreground p-4",
        "data-ocid": "keyframe.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Diamond, { className: "w-6 h-6 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-center", children: "Select a clip to view keyframes" })
        ]
      }
    );
  }
  const tracks = selectedClip.keyframeTracks;
  function handleAddKeyframe(prop) {
    if (!selectedClip) return;
    const localTime = playheadPosition - selectedClip.position;
    const currentVal = getInterpolatedValue(selectedClip.id, prop, playheadPosition) ?? defaultValueFor(prop);
    addKeyframe(selectedClip.id, prop, {
      time: localTime,
      value: currentVal,
      easing: "easeInOut"
    });
  }
  function handleAddNewTrack() {
    if (!selectedClip) return;
    const usedProps = new Set(tracks.map((t) => t.propertyName));
    const unused = Object.keys(PROPERTY_LABELS).find(
      (p) => !usedProps.has(p)
    );
    if (!unused) return;
    handleAddKeyframe(unused);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "keyframe.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-foreground/80 uppercase tracking-wider", children: "Keyframes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: cn(
              "h-5 w-5",
              graphEditorVisible && "text-primary bg-primary/10"
            ),
            onClick: toggleGraphEditor,
            title: "Toggle Graph Editor (G)",
            "data-ocid": "keyframe.graph_editor_toggle",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "w-3 h-3" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-5 w-5",
            onClick: handleAddNewTrack,
            title: "Add property track",
            "data-ocid": "keyframe.add_track_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto scrollbar-thin", children: tracks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center h-24 gap-2 text-muted-foreground",
        "data-ocid": "keyframe.tracks_empty_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-center px-3", children: "Press K to add a keyframe at playhead" })
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1", children: tracks.map((track) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-1 bg-muted/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-foreground/70", children: PROPERTY_LABELS[track.propertyName] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-4 w-4 opacity-60 hover:opacity-100",
            onClick: () => handleAddKeyframe(track.propertyName),
            title: "Add keyframe at playhead",
            "data-ocid": `keyframe.add_kf_button.${track.propertyName}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-2.5 h-2.5" })
          }
        )
      ] }),
      track.keyframes.map((kf, i) => {
        const isSelected = selectedKeyframeId === kf.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: cn(
              "w-full flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors",
              isSelected ? "bg-primary/10" : "hover:bg-muted/20"
            ),
            onClick: () => {
              setSelectedKeyframeId(isSelected ? null : kf.id);
              setPlayheadPosition(selectedClip.position + kf.time);
            },
            "data-ocid": `keyframe.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Diamond,
                {
                  className: cn(
                    "w-2.5 h-2.5 shrink-0",
                    isSelected ? "fill-primary text-primary" : "text-muted-foreground"
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-foreground/70 w-14 shrink-0", children: formatTime$3(kf.time) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground flex-1", children: kf.value.toFixed(1) }),
              isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  className: "text-[9px] bg-input border border-border rounded px-1 py-0.5 text-foreground focus:outline-none",
                  value: kf.easing,
                  onChange: (e) => updateKeyframe(
                    selectedClip.id,
                    track.propertyName,
                    kf.id,
                    { easing: e.target.value }
                  ),
                  "data-ocid": `keyframe.easing_select.${i + 1}`,
                  children: EASING_OPTIONS.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: e, children: e }, e))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-4 w-4 shrink-0 opacity-50 hover:opacity-100 hover:text-destructive",
                  onClick: (ev) => {
                    ev.stopPropagation();
                    removeKeyframe(
                      selectedClip.id,
                      track.propertyName,
                      kf.id
                    );
                    if (isSelected) setSelectedKeyframeId(null);
                  },
                  "data-ocid": `keyframe.delete_button.${i + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-2.5 h-2.5" })
                }
              )
            ]
          },
          kf.id
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mx-3" })
    ] }, track.propertyName)) }) })
  ] });
}
function defaultValueFor(prop) {
  switch (prop) {
    case "opacity":
      return 100;
    case "scale_x":
    case "scale_y":
      return 100;
    case "position_x":
    case "position_y":
      return 0;
    case "rotation":
      return 0;
    default:
      return 0;
  }
}
function SaveStatusBadge() {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
  if (saveStatus === "idle") return null;
  if (saveStatus === "saving") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "text-xs text-muted-foreground animate-pulse",
        "data-ocid": "header.save_status",
        children: "Auto-saving…"
      }
    );
  }
  if (saveStatus === "error") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", "data-ocid": "header.save_status", children: "Save failed" });
  }
  if (saveStatus === "saved" && lastSavedAt) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "text-xs text-muted-foreground",
        "data-ocid": "header.save_status",
        children: "Saved"
      }
    );
  }
  return null;
}
function Layout({
  header,
  leftPanel,
  mainArea,
  rightPanel,
  timeline,
  className
}) {
  const { theme, toggleTheme } = useTheme();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground select-none",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex-none h-12 bg-card border-b border-border flex items-center px-3 gap-2 z-20", children: [
          header,
          /* @__PURE__ */ jsxRuntimeExports.jsx(SaveStatusBadge, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: toggleTheme,
              className: "w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth ml-1",
              "aria-label": "Toggle theme",
              "data-ocid": "header.theme_toggle",
              children: theme === "dark" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "aside",
            {
              className: "flex-none w-56 bg-sidebar border-r border-border flex flex-col overflow-hidden",
              "data-ocid": "media_library.panel",
              children: leftPanel
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-col flex-1 overflow-hidden min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "section",
              {
                className: "flex-1 min-h-0 bg-background flex items-center justify-center p-3",
                "data-ocid": "playback.section",
                children: mainArea
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "section",
              {
                className: "flex-none h-56 border-t border-border bg-card overflow-hidden flex flex-col",
                "data-ocid": "timeline.section",
                children: timeline
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "aside",
            {
              className: "flex-none w-60 bg-sidebar border-l border-border flex flex-col overflow-hidden",
              "data-ocid": "properties.panel",
              children: rightPanel
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "flex-none h-6 bg-card border-t border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/50", children: [
          "Built with",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "hover:text-muted-foreground transition-colors",
              children: "caffeine.ai"
            }
          )
        ] }) })
      ]
    }
  );
}
const BUILTIN_EFFECTS = [
  {
    id: "shake",
    name: "Shake",
    type: "shake",
    category: "shake",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }),
    iconBg: "bg-orange-500/20 text-orange-400",
    defaultParams: {
      intensity: 5,
      speed: 5,
      randomness: 0.5,
      axis: 2,
      rotation: 0
    },
    paramDefs: [
      { key: "intensity", label: "Intensity", min: 0, max: 10, step: 0.1 },
      { key: "speed", label: "Speed", min: 0, max: 10, step: 0.1 },
      { key: "randomness", label: "Randomness", min: 0, max: 1, step: 0.01 },
      {
        key: "axis",
        label: "Axis",
        min: 0,
        max: 2,
        step: 1,
        type: "select",
        options: [
          { label: "X", value: 0 },
          { label: "Y", value: 1 },
          { label: "Both", value: 2 }
        ]
      },
      {
        key: "rotation",
        label: "Rotation Shake",
        min: 0,
        max: 1,
        step: 1,
        type: "select",
        options: [
          { label: "Off", value: 0 },
          { label: "On", value: 1 }
        ]
      }
    ]
  },
  {
    id: "blur",
    name: "Blur",
    type: "blur",
    category: "distortion",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wind, { className: "w-4 h-4" }),
    iconBg: "bg-blue-500/20 text-blue-400",
    defaultParams: { radius: 5 },
    paramDefs: [{ key: "radius", label: "Radius", min: 0, max: 20, step: 0.5 }]
  },
  {
    id: "colorShift",
    name: "Color Shift",
    type: "colorShift",
    category: "color",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { className: "w-4 h-4" }),
    iconBg: "bg-violet-500/20 text-violet-400",
    defaultParams: { hueRotate: 0, saturate: 1, brightness: 1 },
    paramDefs: [
      { key: "hueRotate", label: "Hue Rotate", min: -180, max: 180, step: 1 },
      { key: "saturate", label: "Saturate", min: 0, max: 3, step: 0.05 },
      { key: "brightness", label: "Brightness", min: 0.5, max: 2, step: 0.05 }
    ]
  },
  {
    id: "glitch",
    name: "Glitch",
    type: "colorShift",
    category: "stylized",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
    iconBg: "bg-green-500/20 text-green-400",
    defaultParams: { hueRotate: 45, saturate: 2, brightness: 1.2 },
    paramDefs: [
      { key: "hueRotate", label: "Hue Shift", min: -180, max: 180, step: 1 },
      { key: "saturate", label: "Saturate", min: 0, max: 3, step: 0.05 }
    ]
  }
];
const TRANSITION_DEFS = [
  {
    type: "crossfade",
    label: "Fade",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Blend, { className: "w-4 h-4" }),
    iconBg: "bg-blue-500/20 text-blue-400"
  },
  {
    type: "slide",
    label: "Slide Left",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
    iconBg: "bg-cyan-500/20 text-cyan-400"
  },
  {
    type: "slideRight",
    label: "Slide Right",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" }),
    iconBg: "bg-cyan-500/20 text-cyan-400"
  },
  {
    type: "slideUp",
    label: "Slide Up",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-4 h-4" }),
    iconBg: "bg-teal-500/20 text-teal-400"
  },
  {
    type: "slideDown",
    label: "Slide Down",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { className: "w-4 h-4" }),
    iconBg: "bg-teal-500/20 text-teal-400"
  },
  {
    type: "zoom",
    label: "Zoom In",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-4 h-4" }),
    iconBg: "bg-orange-500/20 text-orange-400"
  },
  {
    type: "blur",
    label: "Blur",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4" }),
    iconBg: "bg-indigo-500/20 text-indigo-400"
  },
  {
    type: "spin",
    label: "Spin",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "w-4 h-4" }),
    iconBg: "bg-pink-500/20 text-pink-400"
  },
  {
    type: "glitch",
    label: "Glitch",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
    iconBg: "bg-green-500/20 text-green-400"
  },
  {
    type: "dissolve",
    label: "Dissolve",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4" }),
    iconBg: "bg-purple-500/20 text-purple-400"
  },
  {
    type: "fadeToBlack",
    label: "Fade to Black",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(WandSparkles, { className: "w-4 h-4" }),
    iconBg: "bg-muted text-muted-foreground"
  }
];
function SavePresetModal({ onSave, onClose }) {
  const [name, setName] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center",
      "data-ocid": "save_preset.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute inset-0 bg-background/80 backdrop-blur-sm",
            onClick: onClose,
            "aria-label": "Close dialog"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 bg-card border border-border rounded-xl p-5 w-72 shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Save as Preset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "data-ocid": "save_preset.close_button",
                className: "text-muted-foreground hover:text-foreground transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              placeholder: "Preset name...",
              value: name,
              onChange: (e) => setName(e.target.value),
              className: "w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring mb-3",
              "data-ocid": "save_preset.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "flex-1",
                onClick: onClose,
                "data-ocid": "save_preset.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                className: "flex-1",
                disabled: !name.trim(),
                onClick: () => {
                  if (name.trim()) {
                    onSave(name.trim());
                    onClose();
                  }
                },
                "data-ocid": "save_preset.confirm_button",
                children: "Save"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function EffectCard({ effect, onApply, onSavePreset }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [params, setParams] = reactExports.useState(
    effect.defaultParams
  );
  const [showSaveModal, setShowSaveModal] = reactExports.useState(false);
  const updateParam = (key, value) => setParams((p) => ({ ...p, [key]: value }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "rounded-lg border transition-all",
          expanded ? "border-primary/40 bg-card" : "border-border bg-muted/20 hover:border-border/80"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center gap-2.5 p-2.5 text-left",
              onClick: () => setExpanded(!expanded),
              "data-ocid": `effects.${effect.id}_card`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      effect.iconBg
                    ),
                    children: effect.icon
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: effect.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground capitalize", children: effect.category })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-6 px-2 text-[10px] text-primary hover:bg-primary/10",
                      onClick: (e) => {
                        e.stopPropagation();
                        onApply(effect, params);
                      },
                      "data-ocid": `effects.${effect.id}_apply_button`,
                      children: "Apply"
                    }
                  ),
                  expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground" })
                ] })
              ]
            }
          ),
          expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2.5 pb-2.5 space-y-2.5 border-t border-border/60 pt-2.5", children: [
            effect.paramDefs.map((def) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: def.label }),
                def.type === "select" && def.options ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    className: "bg-input border border-border rounded px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none",
                    value: params[def.key],
                    onChange: (e) => updateParam(def.key, Number(e.target.value)),
                    "data-ocid": `effects.${effect.id}_${def.key}_select`,
                    children: def.options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-foreground/70", children: params[def.key].toFixed(def.step < 1 ? 2 : 0) })
              ] }),
              def.type !== "select" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Slider,
                {
                  value: [params[def.key]],
                  min: def.min,
                  max: def.max,
                  step: def.step,
                  onValueChange: ([v]) => updateParam(def.key, v),
                  "data-ocid": `effects.${effect.id}_${def.key}_slider`
                }
              )
            ] }, def.key)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "mt-1 flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors",
                onClick: () => setShowSaveModal(true),
                "data-ocid": `effects.${effect.id}_save_preset_button`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3 h-3" }),
                  " Save as Preset"
                ]
              }
            )
          ] })
        ]
      }
    ),
    showSaveModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SavePresetModal,
      {
        onSave: (name) => onSavePreset(name, effect, params),
        onClose: () => setShowSaveModal(false)
      }
    )
  ] });
}
function TransitionCard({ def, onApply }) {
  const [duration, setDuration] = reactExports.useState(0.5);
  const baseType = def.type;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/20 hover:border-border/80 transition-all p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            def.iconBg
          ),
          children: def.icon
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: def.label }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          className: "h-6 px-2 text-[10px] text-primary hover:bg-primary/10",
          onClick: () => onApply(baseType, duration),
          "data-ocid": `transitions.${def.type}_apply_button`,
          children: "Apply"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Duration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-foreground/70", children: [
          duration.toFixed(1),
          "s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Slider,
        {
          value: [duration],
          min: 0.1,
          max: 2,
          step: 0.1,
          onValueChange: ([v]) => setDuration(v),
          "data-ocid": `transitions.${def.type}_duration_slider`
        }
      )
    ] })
  ] });
}
function EffectsTab() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const addEffect = useEditorStore((s) => s.addEffect);
  const effectPresets = useEditorStore((s) => s.effectPresets);
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const categories = [
    { id: "all", label: "All" },
    { id: "motion", label: "Motion" },
    { id: "distortion", label: "Distortion" },
    { id: "color", label: "Color" },
    { id: "stylized", label: "Stylized" },
    { id: "shake", label: "Shake" }
  ];
  const filtered = activeCategory === "all" ? BUILTIN_EFFECTS : BUILTIN_EFFECTS.filter((e) => e.category === activeCategory);
  function handleApply(effectDef, params) {
    if (!selectedClipId) return;
    const effect = {
      id: `fx-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      effectType: effectDef.type,
      params,
      keyframeTracks: []
    };
    addEffect(selectedClipId, effect);
  }
  function handleSavePreset(name, effectDef, params) {
    useEditorStore.setState((s) => ({
      effectPresets: [
        ...s.effectPresets,
        {
          id: `preset-${Date.now()}`,
          name,
          effectType: effectDef.type,
          params
        }
      ]
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", children: [
    !selectedClipId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-2 mt-2 mb-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-primary/80", children: "Select a clip on the timeline to apply effects." }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 p-2 overflow-x-auto shrink-0 scrollbar-none", children: categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: cn(
          "px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors",
          activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        ),
        onClick: () => setActiveCategory(cat.id),
        "data-ocid": `effects.${cat.id}_filter`,
        children: cat.label
      },
      cat.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2 min-h-0", children: [
      filtered.map((eff) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        EffectCard,
        {
          effect: eff,
          onApply: handleApply,
          onSavePreset: handleSavePreset
        },
        eff.id
      )),
      effectPresets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground uppercase tracking-wider px-0.5", children: "Saved Presets" }) }),
        effectPresets.map((preset, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-muted/20 p-2.5 flex items-center gap-2.5",
            "data-ocid": `effects.preset.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: preset.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground capitalize", children: preset.effectType })
              ] })
            ]
          },
          preset.id
        ))
      ] })
    ] })
  ] });
}
function TransitionsTab() {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const updateClip = useEditorStore((s) => s.updateClip);
  const clips = useEditorStore((s) => s.clips);
  const selectedClip = clips.find((c) => c.id === selectedClipId) ?? null;
  function handleApply(type, duration) {
    if (!selectedClipId) return;
    updateClip(selectedClipId, { transition: { type, duration } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", children: [
    !selectedClipId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-2 mt-2 mb-1 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-primary/80", children: "Select a clip on the timeline to apply a transition." }) }),
    (selectedClip == null ? void 0 : selectedClip.transition) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-2 mt-2 mb-1 rounded-lg bg-accent/10 border border-accent/20 px-3 py-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-accent/80", children: [
        "Active:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground/80", children: selectedClip.transition.type }),
        " ",
        "(",
        selectedClip.transition.duration.toFixed(1),
        "s)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "text-muted-foreground hover:text-foreground",
          onClick: () => selectedClipId && updateClip(selectedClipId, { transition: null }),
          "data-ocid": "transitions.clear_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2 min-h-0", children: TRANSITION_DEFS.map((def) => /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionCard, { def, onApply: handleApply }, def.type)) })
  ] });
}
function MediaTab({
  fileInputRef,
  musicInputRef,
  onFileImport,
  onMusicFileImport
}) {
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectClip = useEditorStore((s) => s.selectClip);
  const addClip = useEditorStore((s) => s.addClip);
  const musicTrack = useEditorStore((s) => s.musicTrack);
  const setMusicTrack = useEditorStore((s) => s.setMusicTrack);
  const [expanded, setExpanded] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors",
          onClick: () => setExpanded(!expanded),
          "data-ocid": "media_library.toggle",
          children: [
            expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" }),
            "Media Library"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          variant: "ghost",
          className: "h-6 w-6",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          "data-ocid": "media_library.import_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
        }
      )
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin p-2 min-h-0", children: [
      clips.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "w-full h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary/70",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          "data-ocid": "media_library.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-6 h-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Import media" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5", children: clips.map((clip, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: cn(
            "aspect-video rounded border border-border overflow-hidden text-[10px] flex flex-col items-center justify-center gap-1 transition-all",
            clip.clipType === "video" ? "bg-card clip-block-video" : clip.clipType === "audio" ? "bg-card clip-block-audio" : "bg-card clip-block-image",
            selectedClipId === clip.id && "ring-1 ring-primary"
          ),
          onClick: () => selectClip(clip.id),
          onDoubleClick: () => addClip({ ...clip, position: 0 }),
          "data-ocid": `media_library.item.${i + 1}`,
          children: [
            clip.clipType === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-4 h-4 text-primary" }),
            clip.clipType === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4 text-primary" }),
            clip.clipType === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate w-full px-1 text-center text-foreground/70", children: clip.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground", children: [
              clip.duration.toFixed(1),
              "s"
            ] })
          ]
        },
        clip.id
      )) }),
      clips.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "mt-2 w-full py-1.5 rounded border border-dashed border-border hover:border-primary/50 text-xs text-muted-foreground hover:text-primary/70 transition-colors flex items-center justify-center gap-1",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          "data-ocid": "media_library.add_more_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3" }),
            " Import more"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground/80", children: "Music" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "icon",
            variant: "ghost",
            className: "h-6 w-6",
            onClick: () => {
              var _a;
              return (_a = musicInputRef.current) == null ? void 0 : _a.click();
            },
            "data-ocid": "music.import_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
          }
        )
      ] }),
      musicTrack && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 pb-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5 text-primary shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs truncate text-foreground/70 flex-1", children: musicTrack.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "text-muted-foreground hover:text-foreground",
            onClick: () => setMusicTrack({ ...musicTrack, muted: !musicTrack.muted }),
            "data-ocid": "music.mute_toggle",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        multiple: true,
        accept: "video/*,audio/*,image/*",
        className: "hidden",
        onChange: (e) => onFileImport(e.target.files)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: musicInputRef,
        type: "file",
        accept: "audio/*",
        className: "hidden",
        onChange: (e) => onMusicFileImport(e.target.files)
      }
    )
  ] });
}
function MediaLibrary({
  fileInputRef,
  musicInputRef,
  onFileImport,
  onMusicFileImport
}) {
  const [activeTab, setActiveTab] = reactExports.useState("media");
  const tabs = [
    { id: "media", label: "Media", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5" }) },
    {
      id: "effects",
      label: "Effects",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3.5 h-3.5" })
    },
    {
      id: "transitions",
      label: "Transitions",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Blend, { className: "w-3.5 h-3.5" })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "left_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex border-b border-border shrink-0", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: cn(
          "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors",
          activeTab === tab.id ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
        ),
        onClick: () => setActiveTab(tab.id),
        "data-ocid": `left_panel.${tab.id}_tab`,
        children: [
          tab.icon,
          tab.label
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-hidden", children: [
      activeTab === "media" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        MediaTab,
        {
          fileInputRef,
          musicInputRef,
          onFileImport,
          onMusicFileImport
        }
      ),
      activeTab === "effects" && /* @__PURE__ */ jsxRuntimeExports.jsx(EffectsTab, {}),
      activeTab === "transitions" && /* @__PURE__ */ jsxRuntimeExports.jsx(TransitionsTab, {})
    ] })
  ] });
}
function formatTime$2(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  const f = Math.round(secs % 1 * 30).toString().padStart(2, "0");
  return `${m}:${s}:${f}`;
}
function PreviewPlayer({ onImportClick }) {
  const clips = useEditorStore((s) => s.clips);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const getInterpolatedValue = useEditorStore((s) => s.getInterpolatedValue);
  const { totalDuration } = useTimeline();
  const videoRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(null);
  const lastTimeRef = reactExports.useRef(null);
  const activeClips = reactExports.useMemo(
    () => clips.filter((c) => {
      const end = c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
      return playheadPosition >= c.position && playheadPosition < end;
    }),
    [clips, playheadPosition]
  );
  const currentVideoClip = activeClips.find((c) => c.clipType === "video" || c.clipType === "image") ?? null;
  const currentTextClips = activeClips.filter((c) => c.clipType === "text");
  function getClipTransform(clipId, position) {
    const localTime = playheadPosition - position;
    const px = getInterpolatedValue(clipId, "position_x", localTime) ?? 0;
    const py = getInterpolatedValue(clipId, "position_y", localTime) ?? 0;
    const sx = getInterpolatedValue(clipId, "scale_x", localTime) ?? 100;
    const sy = getInterpolatedValue(clipId, "scale_y", localTime) ?? 100;
    const rot = getInterpolatedValue(clipId, "rotation", localTime) ?? 0;
    const op = getInterpolatedValue(clipId, "opacity", localTime) ?? 100;
    return {
      transform: `translate(${px}px, ${py}px) scale(${sx / 100}, ${sy / 100}) rotate(${rot}deg)`,
      opacity: op / 100
    };
  }
  const getClipEffectFilter = reactExports.useCallback(
    (clipId) => {
      const clip = clips.find((c) => c.id === clipId);
      if (!clip) return "";
      const localTime = playheadPosition - clip.position;
      const filters = [];
      for (const effect of clip.effects) {
        if (effect.effectType === "blur") {
          const blurRadius = getInterpolatedValue(clipId, "blur_radius", localTime) ?? effect.params.blurRadius ?? 4;
          filters.push(`blur(${blurRadius}px)`);
        } else if (effect.effectType === "colorShift") {
          const hue = getInterpolatedValue(clipId, "hue_shift", localTime) ?? effect.params.hueShift ?? 0;
          const sat = getInterpolatedValue(clipId, "saturation", localTime) ?? effect.params.saturation ?? 100;
          filters.push(`hue-rotate(${hue}deg) saturate(${sat}%)`);
        } else if (effect.effectType === "shake") {
          const intensity = getInterpolatedValue(clipId, "shake_intensity", localTime) ?? effect.params.intensity ?? 5;
          const speed = getInterpolatedValue(clipId, "shake_speed", localTime) ?? effect.params.speed ?? 10;
          const t = performance.now() / 1e3;
          const xOff = Math.sin(t * speed * 2 * Math.PI) * intensity;
          const yOff = Math.cos(t * speed * 1.7 * Math.PI) * intensity;
          filters.push(`translate(${xOff}px, ${yOff}px)`);
        }
      }
      return filters.join(" ");
    },
    [clips, playheadPosition, getInterpolatedValue]
  );
  const videoFilter = reactExports.useMemo(() => {
    if (!currentVideoClip) return void 0;
    const cf = currentVideoClip.colorFilter;
    const base = [
      `brightness(${cf.brightness}%)`,
      `contrast(${cf.contrast}%)`,
      `saturate(${cf.saturation}%)`,
      `hue-rotate(${cf.hueRotation}deg)`,
      `opacity(${cf.opacity}%)`
    ].join(" ");
    const fx = getClipEffectFilter(currentVideoClip.id);
    return fx ? `${base} ${fx}` : base;
  }, [currentVideoClip, getClipEffectFilter]);
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideoClip || isPlaying) return;
    const localTime = currentVideoClip.trimIn + (playheadPosition - currentVideoClip.position) * currentVideoClip.speed;
    if (Math.abs(video.currentTime - localTime) > 0.05) {
      video.currentTime = localTime;
    }
  }, [playheadPosition, currentVideoClip, isPlaying]);
  const positionRef = reactExports.useRef(playheadPosition);
  positionRef.current = playheadPosition;
  const tick = reactExports.useCallback(
    (timestamp) => {
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1e3;
      lastTimeRef.current = timestamp;
      const next = positionRef.current + delta;
      if (next >= totalDuration) {
        setIsPlaying(false);
        setPlayheadPosition(totalDuration);
      } else {
        setPlayheadPosition(next);
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [totalDuration, setPlayheadPosition, setIsPlaying]
  );
  reactExports.useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, tick]);
  reactExports.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) video.play().catch(() => {
    });
    else video.pause();
  }, [isPlaying]);
  const videoTransform = currentVideoClip ? getClipTransform(currentVideoClip.id, currentVideoClip.position) : {};
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "playback-viewport w-full h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 flex items-center justify-center relative overflow-hidden", children: [
      currentVideoClip ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "video",
        {
          ref: videoRef,
          src: currentVideoClip.objectUrl,
          className: "max-w-full max-h-full object-contain",
          style: { filter: videoFilter, ...videoTransform },
          "data-ocid": "playback.video",
          muted: currentVideoClip.volume === 0,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
        }
      ) : clips.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 text-muted-foreground",
          "data-ocid": "playback.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-12 h-12 opacity-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Import media to start editing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: onImportClick,
                "data-ocid": "playback.import_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5 mr-1.5" }),
                  " Import Media"
                ]
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-64 h-36 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "No video at this position" })
      ] }),
      currentTextClips.map((tc) => {
        const tp = tc.textProps;
        if (!tp) return null;
        const transform = getClipTransform(tc.id, tc.position);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 flex items-center justify-center pointer-events-none",
            style: transform,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontFamily: tp.fontFamily,
                  fontSize: tp.fontSize,
                  color: tp.fontColor,
                  fontWeight: tp.bold ? "bold" : "normal",
                  fontStyle: tp.italic ? "italic" : "normal",
                  textAlign: tp.alignment,
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  maxWidth: "80%",
                  wordBreak: "break-word"
                },
                children: tp.content
              }
            )
          },
          tc.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-1.5 border-t border-border/50 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6",
          onClick: () => setPlayheadPosition(0),
          "data-ocid": "playback.skip_back_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "w-3 h-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "icon",
          className: cn(
            "h-7 w-7 rounded-full",
            isPlaying ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground"
          ),
          onClick: () => setIsPlaying(!isPlaying),
          "data-ocid": "playback.play_pause_button",
          children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6",
          onClick: () => setPlayheadPosition(totalDuration),
          "data-ocid": "playback.skip_forward_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-3 h-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground tabular-nums", children: [
        formatTime$2(playheadPosition),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 mx-0.5", children: "/" }),
        formatTime$2(totalDuration)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "ml-1 text-muted-foreground hover:text-foreground transition-colors",
          title: "Fullscreen",
          onClick: () => {
            var _a, _b;
            return (_b = (_a = videoRef.current) == null ? void 0 : _a.requestFullscreen) == null ? void 0 : _b.call(_a);
          },
          "data-ocid": "playback.fullscreen_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3 h-3" })
        }
      )
    ] })
  ] });
}
function useUndoRedo() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const canUndo = useEditorStore((s) => s.undoStack.length > 0);
  const canRedo = useEditorStore((s) => s.redoStack.length > 0);
  return { undo, redo, canUndo, canRedo };
}
function ClipBlock({
  clip,
  pixelsPerSecond,
  effectiveDuration,
  onPositionChange
}) {
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const selectClip = useEditorStore((s) => s.selectClip);
  const isSelected = selectedClipId === clip.id;
  const width = Math.max(32, effectiveDuration * pixelsPerSecond);
  const left = clip.position * pixelsPerSecond;
  const typeClass = clip.clipType === "video" ? "clip-block-video" : clip.clipType === "audio" ? "clip-block-audio" : clip.clipType === "text" ? "clip-block-text" : "clip-block-image";
  const dragOffsetXRef = reactExports.useRef(0);
  const handleDragStart = (e) => {
    e.dataTransfer.setData("clipId", clip.id);
    dragOffsetXRef.current = e.nativeEvent.offsetX;
  };
  const handleDragEnd = (e) => {
    if (!onPositionChange) return;
    const target = e.currentTarget.closest(
      "[data-track]"
    );
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offsetX = dragOffsetXRef.current;
    const newX = e.clientX - rect.left - offsetX;
    const newPosition = Math.max(0, newX / pixelsPerSecond);
    onPositionChange(clip.id, newPosition);
  };
  const allKfTimes = Array.from(
    new Set(clip.keyframeTracks.flatMap((t) => t.keyframes.map((k) => k.time)))
  ).sort((a, b) => a - b);
  const kfIdsByTime = /* @__PURE__ */ new Map();
  for (const track of clip.keyframeTracks) {
    for (const kf of track.keyframes) {
      const arr = kfIdsByTime.get(kf.time) ?? [];
      arr.push(kf.id);
      kfIdsByTime.set(kf.time, arr);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      draggable: true,
      className: cn(
        "clip-block absolute top-1 flex flex-col items-stretch px-0 text-xs overflow-visible",
        typeClass,
        isSelected && "selected"
      ),
      style: { left, width, bottom: "4px" },
      onClick: (e) => {
        e.stopPropagation();
        selectClip(clip.id);
      },
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      "data-ocid": `timeline.clip.${clip.id}`,
      title: clip.name,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center px-2 flex-1 min-h-0", children: [
          clip.clipType === "video" && /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3 h-3 mr-1 shrink-0 text-primary" }),
          clip.clipType === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-3 h-3 mr-1 shrink-0 text-primary" }),
          clip.clipType === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx(Image$1, { className: "w-3 h-3 mr-1 shrink-0 text-primary" }),
          clip.clipType === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "w-3 h-3 mr-1 shrink-0 text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-foreground/80", children: clip.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[9px] text-muted-foreground shrink-0", children: [
            effectiveDuration.toFixed(1),
            "s"
          ] })
        ] }),
        allKfTimes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-3 shrink-0", "aria-hidden": "true", children: allKfTimes.map((t) => {
          const xPct = width > 0 ? t / effectiveDuration * 100 : 0;
          const ids = kfIdsByTime.get(t) ?? [];
          const isKfSelected = ids.some((id) => id === selectedKeyframeId);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "svg",
            {
              className: "absolute top-0.5 -translate-x-1/2 pointer-events-none",
              style: { left: `${xPct}%` },
              width: 8,
              height: 8,
              viewBox: "0 0 8 8",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "polygon",
                {
                  points: "4,0 8,4 4,8 0,4",
                  fill: isKfSelected ? "white" : "oklch(0.7 0.15 200)",
                  stroke: "none"
                }
              )
            },
            t
          );
        }) })
      ]
    }
  );
}
function WaveformBars() {
  const bars = Array.from({ length: 8 }, (_, i) => i);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-px h-6", children: bars.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "w-0.5 bg-primary/50 rounded-full",
      style: {
        height: `${20 + Math.sin(i * 1.2) * 60}%`,
        animation: `pulse ${0.6 + i * 0.1}s ease-in-out infinite alternate`
      }
    },
    i
  )) });
}
function AudioTrack({
  pixelsPerSecond,
  playheadPosition,
  onAddClip,
  onSeek
}) {
  const clips = useEditorStore((s) => s.clips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);
  const { clipDurations } = useTimeline();
  const audioClips = clips.filter((c) => c.clipType === "audio");
  const handleTrackClick = (e) => {
    if (e.target.closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
    selectClip(null);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const clipId = e.dataTransfer.getData("clipId");
    const offsetX = Number(e.dataTransfer.getData("dragOffsetX")) || 0;
    if (!clipId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - offsetX;
    const newPosition = Math.max(0, newX / pixelsPerSecond);
    updateClip(clipId, { position: newPosition });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-stretch border-b border-border",
      "data-ocid": "timeline.audio_track",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-3 h-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "AUDIO" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            role: "presentation",
            "data-track": "audio",
            className: cn(
              "track-container relative h-10 flex-1",
              audioClips.length > 0 && "track-active"
            ),
            onClick: handleTrackClick,
            onKeyDown: () => {
            },
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            children: [
              audioClips.map((clip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClipBlock,
                {
                  clip,
                  pixelsPerSecond,
                  effectiveDuration: clipDurations[clip.id] ?? 0,
                  onPositionChange: (id, pos) => updateClip(id, { position: pos })
                },
                clip.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none",
                  style: { left: playheadPosition * pixelsPerSecond }
                }
              ),
              audioClips.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-center justify-between px-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WaveformBars, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "h-7 w-7 rounded border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors",
                    onClick: (e) => {
                      e.stopPropagation();
                      onAddClip();
                    },
                    "data-ocid": "timeline.audio_track.add_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" })
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
function MusicTrackRow({
  pixelsPerSecond,
  playheadPosition,
  totalDuration
}) {
  const musicTrack = useEditorStore((s) => s.musicTrack);
  const setMusicTrack = useEditorStore((s) => s.setMusicTrack);
  if (!musicTrack) return null;
  const trackWidth = Math.max(totalDuration * pixelsPerSecond, 200);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-stretch border-b border-border",
      "data-ocid": "timeline.music_track_row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-3 h-3 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "MUSIC" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "track-container relative h-10 flex-1",
            "data-ocid": "timeline.music_track",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "absolute top-1 bottom-1 rounded clip-block-audio flex items-center px-3 gap-2 border border-primary/20",
                  style: {
                    left: 0,
                    width: trackWidth,
                    opacity: musicTrack.muted ? 0.4 : 1,
                    transition: "opacity 0.2s"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Music2, { className: "w-3 h-3 text-primary shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground/70 truncate flex-1", children: musicTrack.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground mr-1", children: [
                      musicTrack.volume,
                      "%"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        className: "h-5 w-5 shrink-0",
                        onClick: () => setMusicTrack({ ...musicTrack, muted: !musicTrack.muted }),
                        "data-ocid": "timeline.music_track.mute_toggle",
                        children: musicTrack.muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-3 h-3" })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none",
                  style: { left: playheadPosition * pixelsPerSecond }
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function TimelineRuler({
  totalDuration,
  pixelsPerSecond,
  playheadPosition,
  onSeek
}) {
  const ticks = Math.ceil(totalDuration) + 10;
  const FPS = 30;
  const showFrameNumbers = pixelsPerSecond >= 120;
  const showSeconds = pixelsPerSecond >= 40;
  const majorInterval = pixelsPerSecond >= 80 ? 1 : pixelsPerSecond >= 30 ? 5 : 10;
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
  };
  function formatTimecode(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    const f = Math.round(secs % 1 * FPS).toString().padStart(2, "0");
    return `${m}:${s}:${f}`;
  }
  const renderFrameTicks = showFrameNumbers && pixelsPerSecond >= 120;
  const framePx = pixelsPerSecond / FPS;
  const totalFrames = Math.ceil(ticks * FPS);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: "presentation",
      className: "relative h-7 border-b border-border bg-muted/30 shrink-0 cursor-pointer select-none",
      style: { minWidth: ticks * pixelsPerSecond },
      onClick: handleClick,
      onKeyDown: () => {
      },
      "data-ocid": "timeline.ruler",
      children: [
        renderFrameTicks && Array.from({ length: totalFrames }, (_, i) => i).map((frame) => {
          const isSec = frame % FPS === 0;
          if (isSec) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-0",
              style: { left: frame * framePx },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-1.5 bg-border/40" })
            },
            `f${frame}`
          );
        }),
        Array.from({ length: ticks }, (_, i) => i).map((second) => {
          const isMajor = second % majorInterval === 0;
          const label = showFrameNumbers ? formatTimecode(second) : `${Math.floor(second / 60).toString().padStart(2, "0")}:${(second % 60).toString().padStart(2, "0")}`;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "absolute top-0 flex flex-col items-center",
              style: { left: second * pixelsPerSecond },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-px bg-border/60 ${isMajor ? "h-4" : "h-2"}` }),
                isMajor && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground mt-0.5 tabular-nums whitespace-nowrap", children: label }),
                !isMajor && showSeconds && pixelsPerSecond >= 60 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] text-muted-foreground/60 mt-0.5 tabular-nums", children: [
                  second,
                  "s"
                ] })
              ]
            },
            second
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "absolute top-0 bottom-0 flex flex-col items-center pointer-events-none z-20",
            style: { left: playheadPosition * pixelsPerSecond },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-0 h-0 border-l-[5px] border-r-[5px] border-t-[7px] border-l-transparent border-r-transparent border-t-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px flex-1 timeline-scrubber" })
            ]
          }
        )
      ]
    }
  );
}
function VideoTrack({
  pixelsPerSecond,
  playheadPosition,
  onAddClip,
  onSeek
}) {
  const clips = useEditorStore((s) => s.clips);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);
  const { clipDurations } = useTimeline();
  const videoClips = clips.filter(
    (c) => c.clipType === "video" || c.clipType === "image"
  );
  const handleTrackClick = (e) => {
    if (e.target.closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
    selectClip(null);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const clipId = e.dataTransfer.getData("clipId");
    const offsetX = Number(e.dataTransfer.getData("dragOffsetX")) || 0;
    if (!clipId) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - offsetX;
    const newPosition = Math.max(0, newX / pixelsPerSecond);
    updateClip(clipId, { position: newPosition });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-stretch border-b border-border",
      "data-ocid": "timeline.video_track",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3 h-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "VIDEO" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            role: "presentation",
            "data-track": "video",
            className: cn(
              "track-container relative h-12 flex-1",
              videoClips.length > 0 && "track-active"
            ),
            onClick: handleTrackClick,
            onKeyDown: () => {
            },
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            children: [
              videoClips.map((clip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClipBlock,
                {
                  clip,
                  pixelsPerSecond,
                  effectiveDuration: clipDurations[clip.id] ?? 0,
                  onPositionChange: (id, pos) => updateClip(id, { position: pos })
                },
                clip.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none",
                  style: { left: playheadPosition * pixelsPerSecond }
                }
              ),
              videoClips.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute top-1 left-1 h-10 w-10 rounded border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors",
                  onClick: (e) => {
                    e.stopPropagation();
                    onAddClip();
                  },
                  "data-ocid": "timeline.video_track.add_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const SNAP_THRESHOLD = 10;
function formatTime$1(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = Math.floor(secs % 60).toString().padStart(2, "0");
  const f = Math.round(secs % 1 * 30).toString().padStart(2, "0");
  return `${m}:${s}:${f}`;
}
function TextTrack({
  pixelsPerSecond,
  playheadPosition,
  onSeek
}) {
  const clips = useEditorStore((s) => s.clips);
  const addClip = useEditorStore((s) => s.addClip);
  const updateClip = useEditorStore((s) => s.updateClip);
  const selectClip = useEditorStore((s) => s.selectClip);
  const { clipDurations } = useTimeline();
  const textClips = clips.filter((c) => c.clipType === "text");
  const handleTrackClick = (e) => {
    if (e.target.closest("button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, x / pixelsPerSecond));
    selectClip(null);
  };
  function addTextClip() {
    const lastPos = clips.reduce((max, c) => {
      const end = c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
      return end > max ? end : max;
    }, playheadPosition);
    const newClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      trackId: "text-1",
      objectUrl: "",
      name: "Text",
      clipType: "text",
      duration: 5,
      trimIn: 0,
      trimOut: 0,
      speed: 1,
      volume: 0,
      colorFilter: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hueRotation: 0,
        opacity: 100
      },
      transition: null,
      position: lastPos,
      keyframeTracks: [],
      effects: [],
      textProps: defaultTextClipProps()
    };
    addClip(newClip);
    selectClip(newClip.id);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-stretch border-b border-border",
      "data-ocid": "timeline.text_track",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-none w-14 bg-muted/20 border-r border-border flex flex-col items-center justify-center gap-1 py-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "w-3 h-3 text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "TEXT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            role: "presentation",
            "data-track": "text",
            className: cn(
              "track-container relative h-10 flex-1",
              textClips.length > 0 && "track-active"
            ),
            onClick: handleTrackClick,
            onKeyDown: () => {
            },
            onDragOver: (e) => e.preventDefault(),
            onDrop: (e) => {
              e.preventDefault();
              const clipId = e.dataTransfer.getData("clipId");
              if (!clipId) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const newX = e.clientX - rect.left;
              const rawPos = Math.max(0, newX / pixelsPerSecond);
              const snap = clips.reduce((best, c) => {
                if (c.id === clipId) return best;
                const end = c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
                const candidates = [c.position, end];
                for (const candidate of candidates) {
                  const diff = Math.abs(candidate * pixelsPerSecond - newX);
                  if (diff < SNAP_THRESHOLD && (best === null || diff < Math.abs(best * pixelsPerSecond - newX))) {
                    return candidate;
                  }
                }
                return best;
              }, null);
              updateClip(clipId, { position: snap !== null ? snap : rawPos });
            },
            children: [
              textClips.map((clip) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ClipBlock,
                {
                  clip,
                  pixelsPerSecond,
                  effectiveDuration: clipDurations[clip.id] ?? 0,
                  onPositionChange: (id, pos) => updateClip(id, { position: pos })
                },
                clip.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute top-0 bottom-0 w-px timeline-scrubber z-10 pointer-events-none",
                  style: { left: playheadPosition * pixelsPerSecond }
                }
              ),
              textClips.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "absolute top-1 left-1 h-8 w-8 rounded border-2 border-dashed border-purple-400/30 hover:border-purple-400/60 flex items-center justify-center text-purple-400/50 hover:text-purple-400 transition-colors",
                  onClick: (e) => {
                    e.stopPropagation();
                    addTextClip();
                  },
                  "data-ocid": "timeline.text_track.add_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function Timeline({
  pixelsPerSecond,
  onAddVideoClip,
  onAddAudioClip
}) {
  const { totalDuration } = useTimeline();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const clips = useEditorStore((s) => s.clips);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const removeClip = useEditorStore((s) => s.removeClip);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const splitClip = useEditorStore((s) => s.splitClip);
  const scrollRef = reactExports.useRef(null);
  const minWidth = (totalDuration + 10) * pixelsPerSecond + 64;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1 border-b border-border bg-muted/20 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6",
          disabled: !selectedClipId,
          onClick: () => selectedClipId && removeClip(selectedClipId),
          "data-ocid": "timeline.delete_button",
          title: "Delete selected clip",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6",
          disabled: !selectedClipId,
          onClick: () => selectedClipId && splitClip(selectedClipId, playheadPosition),
          "data-ocid": "timeline.split_button",
          title: "Split at playhead (S)",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-3 h-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6",
          onClick: undo,
          disabled: !canUndo,
          "data-ocid": "timeline.undo_button",
          title: "Undo (Ctrl+Z)",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "w-3 h-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6",
          onClick: redo,
          disabled: !canRedo,
          "data-ocid": "timeline.redo_button",
          title: "Redo (Ctrl+Y)",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { className: "w-3 h-3" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground ml-1 font-mono tabular-nums", children: [
        formatTime$1(playheadPosition),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40 mx-1", children: "/" }),
        formatTime$1(totalDuration)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground ml-2", children: [
        clips.length,
        " clip",
        clips.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: scrollRef,
        className: "flex-1 overflow-x-auto overflow-y-auto scrollbar-thin",
        "data-ocid": "timeline.track_area",
        children: clips.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "h-full flex items-center justify-center text-muted-foreground gap-2",
            "data-ocid": "timeline.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "w-4 h-4 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Import media or add text to build your timeline" })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-none w-14" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TimelineRuler,
              {
                totalDuration,
                pixelsPerSecond,
                playheadPosition,
                onSeek: setPlayheadPosition
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            VideoTrack,
            {
              pixelsPerSecond,
              playheadPosition,
              onAddClip: onAddVideoClip,
              onSeek: setPlayheadPosition
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AudioTrack,
            {
              pixelsPerSecond,
              playheadPosition,
              onAddClip: onAddAudioClip,
              onSeek: setPlayheadPosition
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TextTrack,
            {
              pixelsPerSecond,
              playheadPosition,
              onSeek: setPlayheadPosition
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MusicTrackRow,
            {
              pixelsPerSecond,
              playheadPosition,
              totalDuration
            }
          )
        ] })
      }
    )
  ] });
}
function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toFixed(2).padStart(5, "0");
  return `${m}:${s}`;
}
function TransportBar({
  zoom,
  onZoomChange,
  onExportClick
}) {
  const { totalDuration, sortedClips } = useTimeline();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const projectName = useEditorStore((s) => s.projectName);
  const setPlayheadPosition = useEditorStore((s) => s.setPlayheadPosition);
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const setProjectName = useEditorStore((s) => s.setProjectName);
  const goToPrevClip = () => {
    const before = sortedClips.filter((c) => c.position < playheadPosition - 0.05).sort((a, b) => b.position - a.position);
    if (before.length > 0) setPlayheadPosition(before[0].position);
    else setPlayheadPosition(0);
  };
  const goToNextClip = () => {
    const after = sortedClips.filter((c) => c.position > playheadPosition + 0.05).sort((a, b) => a.position - b.position);
    if (after.length > 0) setPlayheadPosition(after[0].position);
    else setPlayheadPosition(totalDuration);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mr-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded bg-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Film, { className: "w-3.5 h-3.5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: "ClipCraft" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
        onClick: undo,
        disabled: !canUndo,
        "data-ocid": "header.undo_button",
        title: "Undo (Ctrl+Z)",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "w-4 h-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
        onClick: redo,
        disabled: !canRedo,
        "data-ocid": "header.redo_button",
        title: "Redo (Ctrl+Y)",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Redo2, { className: "w-4 h-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
        onClick: goToPrevClip,
        "data-ocid": "header.prev_clip_button",
        title: "Previous clip",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "w-4 h-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-7 w-7",
        onClick: () => setPlayheadPosition(Math.max(0, playheadPosition - 5)),
        "data-ocid": "header.rewind_5s_button",
        title: "Rewind 5s",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipBack, { className: "w-3.5 h-3.5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        size: "icon",
        className: cn(
          "h-8 w-8 rounded-full",
          isPlaying ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground"
        ),
        onClick: () => setIsPlaying(!isPlaying),
        "data-ocid": "header.play_pause_button",
        children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-7 w-7",
        onClick: () => setPlayheadPosition(Math.min(totalDuration, playheadPosition + 5)),
        "data-ocid": "header.forward_5s_button",
        title: "Forward 5s",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-3.5 h-3.5" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
        onClick: goToNextClip,
        "data-ocid": "header.next_clip_button",
        title: "Next clip",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-4 h-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "font-mono text-xs text-muted-foreground tabular-nums",
        "data-ocid": "header.timecode",
        children: [
          formatTime(playheadPosition),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 mx-0.5", children: "/" }),
          formatTime(totalDuration)
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "bg-transparent text-sm font-display text-center text-foreground/70 hover:text-foreground focus:outline-none focus:text-foreground w-44 truncate",
        value: projectName,
        onChange: (e) => setProjectName(e.target.value),
        "data-ocid": "header.project_name_input"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-7 w-7",
          onClick: () => onZoomChange(Math.max(20, zoom - 20)),
          "data-ocid": "header.zoom_out_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "w-3.5 h-3.5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-10 text-center", children: [
        zoom,
        "px"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-7 w-7",
          onClick: () => onZoomChange(Math.min(300, zoom + 20)),
          "data-ocid": "header.zoom_in_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-3.5 h-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        className: "h-8 bg-primary text-primary-foreground hover:bg-primary/90",
        onClick: onExportClick,
        "data-ocid": "header.export_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 mr-1.5" }),
          " Export"
        ]
      }
    )
  ] });
}
const AUTOSAVE_DELAY = 3e3;
function useAutosave() {
  const { actor, isFetching } = useActor(createActor);
  const clips = useEditorStore((s) => s.clips);
  const musicTrack = useEditorStore((s) => s.musicTrack);
  const currentProjectId = useEditorStore((s) => s.currentProjectId);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);
  const setLastSavedAt = useEditorStore((s) => s.setLastSavedAt);
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!actor || isFetching || !currentProjectId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("saving");
    timerRef.current = setTimeout(async () => {
      try {
        await actor.saveProject(currentProjectId);
        setLastSavedAt(Date.now());
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    }, AUTOSAVE_DELAY);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    clips,
    musicTrack,
    actor,
    isFetching,
    currentProjectId,
    setSaveStatus,
    setLastSavedAt
  ]);
}
function useKeyboardShortcuts() {
  const setIsPlaying = useEditorStore((s) => s.setIsPlaying);
  const isPlaying = useEditorStore((s) => s.isPlaying);
  const removeClip = useEditorStore((s) => s.removeClip);
  const selectedClipId = useEditorStore((s) => s.selectedClipId);
  const playheadPosition = useEditorStore((s) => s.playheadPosition);
  const clips = useEditorStore((s) => s.clips);
  const addKeyframe = useEditorStore((s) => s.addKeyframe);
  const getInterpolatedValue = useEditorStore((s) => s.getInterpolatedValue);
  const splitClip = useEditorStore((s) => s.splitClip);
  const duplicateClip = useEditorStore((s) => s.duplicateClip);
  const toggleGraphEditor = useEditorStore((s) => s.toggleGraphEditor);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  reactExports.useEffect(() => {
    const handler = (e) => {
      var _a;
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
        return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          setIsPlaying(!isPlaying);
          break;
        case "z":
        case "Z":
          if ((e.ctrlKey || e.metaKey) && canUndo) {
            e.preventDefault();
            undo();
          }
          break;
        case "y":
        case "Y":
          if ((e.ctrlKey || e.metaKey) && canRedo) {
            e.preventDefault();
            redo();
          }
          break;
        case "Delete":
        case "Backspace":
          if (selectedClipId) {
            e.preventDefault();
            removeClip(selectedClipId);
          }
          break;
        case "k":
        case "K":
          if (selectedClipId) {
            e.preventDefault();
            const clip = clips.find((c) => c.id === selectedClipId);
            if (!clip) break;
            const localTime = playheadPosition - clip.position;
            const prop = ((_a = clip.keyframeTracks[0]) == null ? void 0 : _a.propertyName) ?? "opacity";
            const currentVal = getInterpolatedValue(selectedClipId, prop, playheadPosition) ?? 100;
            addKeyframe(selectedClipId, prop, {
              time: localTime,
              value: currentVal,
              easing: "easeInOut"
            });
          }
          break;
        case "g":
        case "G":
          e.preventDefault();
          toggleGraphEditor();
          break;
        case "s":
        case "S":
          if (!(e.ctrlKey || e.metaKey) && selectedClipId) {
            e.preventDefault();
            splitClip(selectedClipId, playheadPosition);
          }
          break;
        case "d":
        case "D":
          if ((e.ctrlKey || e.metaKey) && selectedClipId) {
            e.preventDefault();
            duplicateClip(selectedClipId);
          }
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    isPlaying,
    selectedClipId,
    playheadPosition,
    clips,
    canUndo,
    canRedo,
    setIsPlaying,
    removeClip,
    addKeyframe,
    getInterpolatedValue,
    splitClip,
    duplicateClip,
    toggleGraphEditor,
    undo,
    redo
  ]);
}
function RightPanel() {
  const graphEditorVisible = useEditorStore((s) => s.graphEditorVisible);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            height: graphEditorVisible ? "50%" : "100%",
            transition: "height 0.2s",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipPropertiesPanel, {})
        }
      ),
      graphEditorVisible && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "50%", overflow: "hidden" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyframePanel, {}) })
    ] }),
    graphEditorVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(GraphEditor, {})
  ] });
}
function fileToClipType(file) {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}
async function getMediaDuration(file, type) {
  if (type === "image") return 5;
  return new Promise((resolve) => {
    const el = type === "video" ? document.createElement("video") : document.createElement("audio");
    el.src = URL.createObjectURL(file);
    el.onloadedmetadata = () => resolve(el.duration || 5);
    el.onerror = () => resolve(5);
  });
}
function EditorPage() {
  useKeyboardShortcuts();
  useAutosave();
  const clips = useEditorStore((s) => s.clips);
  const addClip = useEditorStore((s) => s.addClip);
  const setMusicTrack = useEditorStore((s) => s.setMusicTrack);
  const [zoom, setZoom] = reactExports.useState(80);
  const [showExport, setShowExport] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const musicInputRef = reactExports.useRef(null);
  const handleFileImport = reactExports.useCallback(
    async (files) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        const clipType = fileToClipType(file);
        const duration = await getMediaDuration(file, clipType);
        const objectUrl = URL.createObjectURL(file);
        const lastPos = clips.reduce((max, c) => {
          const end = c.position + (c.duration - c.trimIn - c.trimOut) / c.speed;
          return end > max ? end : max;
        }, 0);
        const newClip = {
          id: `clip-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          trackId: clipType === "audio" ? "audio-1" : "video-1",
          fileRef: file,
          objectUrl,
          name: file.name.replace(/\.[^.]+$/, ""),
          clipType,
          duration,
          trimIn: 0,
          trimOut: 0,
          speed: 1,
          volume: 100,
          colorFilter: defaultColorFilter(),
          transition: null,
          position: lastPos,
          keyframeTracks: [],
          effects: []
        };
        addClip(newClip);
      }
    },
    [clips, addClip]
  );
  const handleMusicImport = reactExports.useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const objectUrl = URL.createObjectURL(file);
      setMusicTrack({
        fileRef: file,
        objectUrl,
        name: file.name.replace(/\.[^.]+$/, ""),
        volume: 80,
        muted: false
      });
    },
    [setMusicTrack]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Layout,
      {
        header: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TransportBar,
          {
            zoom,
            onZoomChange: setZoom,
            onExportClick: () => setShowExport(true)
          }
        ),
        leftPanel: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MediaLibrary,
          {
            fileInputRef,
            musicInputRef,
            onFileImport: handleFileImport,
            onMusicFileImport: handleMusicImport,
            onMusicImport: () => {
              var _a;
              return (_a = musicInputRef.current) == null ? void 0 : _a.click();
            }
          }
        ),
        mainArea: /* @__PURE__ */ jsxRuntimeExports.jsx(PreviewPlayer, { onImportClick: () => {
          var _a;
          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
        } }),
        rightPanel: /* @__PURE__ */ jsxRuntimeExports.jsx(RightPanel, {}),
        timeline: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Timeline,
          {
            pixelsPerSecond: zoom,
            onAddVideoClip: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            onAddAudioClip: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            }
          }
        )
      }
    ),
    showExport && /* @__PURE__ */ jsxRuntimeExports.jsx(ExportPanel, { onClose: () => setShowExport(false) })
  ] });
}
export {
  EditorPage as default
};
