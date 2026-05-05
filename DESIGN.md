# ClipCraft Design System

## Direction
ClipCraft — Professional, free video editor with light/dark mode support. Inspired by CapCut/Premiere Pro but distinctly original. Smooth real-time playback with timeline-optimized UI.

## Tone
Dual-mode: dark-first for post-production eye comfort; light mode for creative workflows. Density-optimized UI prioritizes precision over decoration. Sharp geometric language with smooth transitions.

## Differentiation
Timeline scrubber with neon cyan glow and hover pulse animation. Tracks highlight with left-border accent. Light/dark modes share cyan accent but flip all backgrounds and text — one token set powers both themes via CSS class toggle.

## Color Palette – Light Mode
| Token | OKLCH | Role |
|-------|-------|------|
| Background | 0.98 0.005 260 | Off-white canvas |
| Foreground | 0.15 0.01 260 | Text |
| Card | 0.96 0.008 260 | Elevated surfaces |
| Primary | 0.55 0.18 200 | Cyan accent, CTAs |
| Border | 0.9 0.008 260 | Dividers |
| Destructive | 0.55 0.22 25 | Delete, warnings |

## Color Palette – Dark Mode
| Token | OKLCH | Role |
|-------|-------|------|
| Background | 0.12 0 0 | Deep black canvas |
| Foreground | 0.93 0.01 220 | Light text |
| Card | 0.17 0.005 240 | Charcoal surfaces |
| Primary | 0.7 0.15 200 | Neon cyan accent |
| Border | 0.28 0.02 240 | Dividers |
| Destructive | 0.6 0.2 30 | Delete, warnings |

## Typography
- Display: Space Grotesk — headers, clip labels, transport controls
- Body: General Sans — UI labels, descriptions, properties
- Mono: GeistMono — timecode, numeric inputs, duration values
- Scale: hero `text-2xl md:text-3xl font-bold`, label `text-sm font-semibold uppercase`, body `text-base`

## Elevation & Depth
Layered opacity (cards on background, popover on card). Subtle shadows in light (0.08 alpha); stronger in dark (0.4 alpha). Glow effects on timeline elements only.

## Structural Zones
| Zone | Light Bg | Dark Bg | Border | Notes |
|------|----------|---------|--------|-------|
| Header | 0.96 card | 0.17 card | top none | Active buttons: cyan |
| Sidebar | 0.94 sidebar | 0.15 sidebar | right border | Tab navigation |
| Preview | 0.95 viewport | 0.06 viewport | 1px | Filmstrip edge |
| Timeline | 0.98 bg | 0.12 bg | track borders | Hover lift |
| Properties | 0.96 card | 0.17 card | left border | Sliders, keyframes |

## Spacing & Rhythm
Timeline: compact 4–8px gaps; panels: generous 16–24px. Card padding: 12px tight, 16px default. Baseline 4px grid.

## Component Patterns
- Tracks: 3px left border (transparent→cyan). No radius. Hover: elevation.
- Scrubber: Cyan + glow. Hover: enhanced glow (0.2s transition).
- Buttons: Icon+text, flat. Primary cyan, secondary muted, danger red.
- Sliders: Cyan thumb, muted track. Labels: mono, left-aligned.
- Clips: Gradients (video blue, audio purple, image orange). Selected: cyan border + glow.

## Motion
- Fade-in: 0.4s ease-out (panels, modals)
- Hover: transition-smooth 0.2s (buttons, tracks, scrubber)
- Timeline-pulse: 2s infinite on scrubber hover
- Playback: 60fps canvas render

## Constraints
- 5 colors max (cyan, grey, red, lime, black)
- WCAG AA+ contrast (light fg 0.15–0.18, dark fg 0.93+)
- Timeline sharp edges (0px); panels subtle (6–8px)
- Density: compact timeline, generous properties
- No full-page gradients; depth via opacity + shadow
- Font stack only; no system fallbacks

## Signature Detail
Cyan scrubber with 12px neon glow. Track left-border (3px) activates on select. Light/dark toggle switches all tokens — no component rewrites needed.

## Exports
**index.css**: OKLCH tokens (:root light, .dark dark). Font-face + utilities (timeline-scrubber, clip-block, scrollbar-thin).
**tailwind.config.js**: boxShadow (card-light/dark, scrubber-glow), keyframes (timeline-pulse).
**File count**: 3 system files; typography + design tokens power all components.
