# Interactive alcove experiment

The homepage alcove now explains treatment through interaction while preserving the warm, quiet hero. Explore Products and Book a Consultation remain the main actions.

## Try it locally

Open the existing dev server at <http://localhost:8080/>. If it is stopped, run `npm run dev` once.

- **The space:** drag the desktop model, choose Angle / Front / Inside, or reset the view.
- **The layers:** separate the construction and highlight the timber, acoustic backing or mounting space. Each explanation links to a relevant product range.
- **Sound paths:** switch between a bare shell and treatment, then send a visual pulse. Bare surfaces show longer reflection trails; treatment shows a shorter trail that fades. This is an illustration, not measured performance or an acoustic solver. No audio plays and no microphone is used.
- Choose Oak, Walnut or Smoked Ebony, then **Use this finish in a room** to carry the finish into the room builder.

Pause stops ambient motion and shows static sound paths while the controls continue to work. Reduced-motion preferences disable animation and WebGL. Phones and tablets use the interactive SVG fallback without downloading Three.js; view presets replace dragging there. Mode tabs support arrow keys, Home and End.

## Compare or return to the previous version

The previous site was committed before editing:

- Checkpoint commit: `71e8ff7`
- Checkpoint tag: `checkpoint/alcove-before-2026-11-12`
- Previous-version branch: `design-v2`
- Experiment branch: `experiment/alcove-interactions-20261112`

All experiment changes are committed on the experiment branch. With no subsequent uncommitted edits, switch versions and reload the browser:

```powershell
git switch design-v2
```

Return to this experiment:

```powershell
git switch experiment/alcove-interactions-20261112
```

These are local branches. Nothing has been pushed or deployed.

## Review images

- [Previous desktop hero](../wireframe-review/desktop.png)
- [New desktop hero](desktop-space.png)
- [Construction layers](desktop-layers.png) and [mounting-space highlight](desktop-gap.png)
- [Bare-surface pulse](desktop-bare-pulse.png) and [treated-surface pulse](desktop-treated-pulse.png)
- [Mobile layers](mobile-layers.png) and [mobile sound paths](mobile-sound.png)

## Validation

- All 15 tests pass, including keyboard tab navigation, relevant layer links, pulse replay and paused comparison controls.
- Strict TypeScript, ESLint on changed source and production build pass. The build retains existing large-chunk and tsconfig-paths plugin warnings.
- Headless Edge at 1440px: WebGL renders; physical pointer dragging changes the rendered view; presets work while paused; a paused scene is pixel-stable; pulse frames change; Walnut arrives selected in the room builder.
- Reduced-motion initial load makes no Three.js request. Changing that preference live removes the WebGL canvas and restores the SVG.
- At 768, 390 and 320px: no horizontal overflow, no Three.js request, and working layer controls. Mobile controls have 44px minimum touch heights.
- No browser console errors or uncaught exceptions were observed. The existing React dependency check passes against the dev server.

The alcove is a concept illustration independent of catalogue product geometry. Final product construction and performance require approved client data.
