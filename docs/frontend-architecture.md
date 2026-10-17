# Frontend architecture

## Scope

The site is one Hugo homepage with three visible stages: Spark, Discovery, and
Blueprint. Generation is an intermediate busy state. The approved mockup remains
the visual reference. The implementation uses HTML partials, layered CSS, and
local ES modules; it has no component registry, client framework, or copy-data system.

## Templates and assets

| Source | Owns |
| --- | --- |
| `site/layouts/baseof.html` | Document, language/theme metadata, header, footer definition, asset inclusion |
| `site/layouts/home.html` | Section composition and footer placement within the creative stage |
| `site/layouts/partials/home/spark.html` | Spark field, voice controls, beginning action |
| `site/layouts/partials/home/discovery.html` | Seven questions and generation action |
| `site/layouts/partials/home/system-diagram.html` | Native optional system disclosure |
| `site/layouts/partials/home/blueprint.html` | Document surface and export/edit controls |
| `site/layouts/partials/assets.html` | Explicit ordered CSS resource list, JS entry point, build policy |

Homepage wording and accessible labels live beside their HTML. Dynamic prompts,
status messages, and generated document prose live in the feature that uses them.
The footer is defined by the shell and placed by home inside the creative stage,
preserving its visibility and spacing across stages.

Hugo concatenates styles in a deliberate order; there are no CSS `@import`s.
`js.Build` bundles local ES modules into one module entry. The optional remote
Three.js dynamic import stays external. Production builds minify both bundles,
fingerprint them with SHA-384, and emit integrity attributes. Development uses
readable bundles. Generated files in `site/public/` are not source files.

## CSS ownership

`assets/css/main.css` declares the cascade order:

```css
@layer reset, tokens, themes, base, layout, components, features, utilities;
```

Every file in `layers/` owns its corresponding layer block. Supporting files in
`components/` and `features/` explicitly wrap their rules in those layers too.

- `reset`: box sizing, margins, inherited form typography.
- `tokens`: reference palette/font values and shared semantic roles.
- `themes`: Blue Studio semantic roles, selected by the shell's `data-theme`.
- `base`: document typography, selection and focus defaults.
- `layout`: page shell, header/footer placement and responsive page widths.
- `components`: identity/labels, buttons, fields, disclosures, document material.
- `features`: Spark/Discovery transitions, system diagram, Blueprint layout, voice meter and atmosphere visibility.
- `utilities`: hidden/screen-reader content and reduced-motion guarantees.

Reference tokens (`--ref-*`) name values; semantic tokens (`--accent`, `--line`,
`--field-bg`, `--paper-ink`, etc.) name uses. Components consume semantic roles.
Add or change a theme role before duplicating palette literals across components.
Material-specific paper effects stay with the document surface.

The former mockup override stack has been folded into each rule's owning file.
Responsive rules live with their owner. Preserve effective responsive dimensions
when refactoring; changing the layout is a separate design decision. Utilities
use `!important` only for explicit visibility/accessibility guarantees.

## JavaScript contracts

| Module under `site/assets/js/` | Owns / contract |
| --- | --- |
| `main.js` | Stage, current Blueprint, workflow events, focus/scroll, lifecycle coordination |
| `components/autosize-textarea.js` | Height adjustment for a visible field using its CSS maximum |
| `features/discovery.js` | Field listeners, captured state, contextual prompt lists, profile snapshots |
| `features/blueprint/generate.js` | Pure local synthesis plus asynchronous generation boundary |
| `features/blueprint/render.js` | Safe text-node rendering inside the Blueprint subtree |
| `features/blueprint/export.js` | Markdown serialization, clipboard fallback, download nodes/URLs |
| `features/voice.js` | Recognition session, voice UI, optional audio meter, media cleanup |
| `features/atmosphere.js` | Lazy import, renderer, geometry/material, RAF and renderer listeners |

### State and data

- Editable field values are the source of truth. Switching stages hides the
  creative section; it never replaces or clears the fields.
- Discovery returns `{ spark, answers }`, with trimmed strings keyed by the seven
  `data-answer` values. All answers are optional; the Spark is required.
- The coordinator snapshots that profile when generation begins and prevents
  duplicate generation while busy. It retains only the current generated document.
- A Blueprint has `title`, `description`, `createdISO`, `opening`, `sections`,
  `openThreads`, `remainingOpen`, and its source `profile`.
- Each section has `heading`, `paragraphs`, `quotations` (`label`, `text`), and
  `boxed`. Rendering and Markdown export consume the same document.
- User input reaches the document through `textContent`/text nodes. Export retains
  the original source material and uses JSON string quoting for YAML strings.
- The generation boundary is the future integration seam. No speculative API,
  authentication, registry, or extra discovery schema is defined today.

### DOM and lifecycle

- IDs address unique controls. `data-answer`, `data-key`, and `data-prompts` join
  question controls and contextual prompts. Do not select behavior by style classes.
- `body[data-stage]` is the coordinator's visual state contract. `hidden` controls
  stage visibility; ARIA busy/pressed/live states describe interaction status.
- `has-answer`, `is-listening`, and `is-error` are explicit visual states written
  by their owning features, not selectors used to discover controls.
- Discovery autosizes after fields become visible. Focus moves to the discovery
  introduction or generated title without unexpectedly scrolling the field.
- Voice stops before workflow transitions and on `pagehide`. Session identifiers
  reject late recognition/media callbacks; late streams are stopped immediately.
  Ending a session closes its AudioContext, stops tracks, and cancels meter RAF.
- Atmosphere imports only after leaving Spark, unless reduced motion is active.
  A failed import is not retried on every stage. Hidden documents pause animation;
  `pagehide` disposes rendering resources; `pageshow` supports cached-page return.
  Changes to reduced-motion preference dispose/restart the optional enhancement.
- Export removes temporary clipboard nodes even on failure and restores focus.
  Download object URLs are revoked after the browser has started the download.
- DOM listeners are attached once per document. Resource listeners are released
  by the feature that creates them; there is no global resource bag.

## Verification workflow

1. Build from the repository root: `hugo --source site`.
2. Preview: `hugo server --source site --bind 127.0.0.1 --port 1313 --disableFastRender`.
3. Capture desktop/mobile baseline views before structural changes. Compare Spark,
   open system disclosure, Discovery, and Blueprint at 1440, 768, 375, and 320 px.
   Use reduced motion and wait for staggered animation delays to settle.
4. Exercise empty-Spark validation, keyboard disclosures, contextual prompts,
   optional/all answers, generation busy state, edit/regeneration, copy, download,
   source preservation, focus, autosize, and horizontal overflow.
5. Exercise unsupported/denied speech, late media cleanup, blocked CDN/WebGL,
   reduced motion, and JavaScript-disabled theme rendering as affected. Mock speech
   events for deterministic automation; verify real speech separately in a supported browser.
6. Check production asset URLs/integrity and module loading, then leave preview
   running for review. Never stage generated output or local test artifacts.
