# Implementation Details

## Issue 1.1.3 – Design System Implementation (2025-09-24)

### Summary

- Introduced a reusable UI component set (button, card, badge, navigation link,
  theme toggle) to ground future feature work.
- Wired in `next-themes` via a dedicated provider so dark/light modes use the
  existing Tailwind design tokens.
- Refreshed the global layout and homepage to consume the new components,
  ensuring the system is exercised in production UI.

### Architecture Notes

- Added `ThemeProvider` in `src/components/layout/theme-provider.tsx` and
  wrapped the App Router layout to provide `class`-based theming.
- Centralized the header into `SiteHeader`
  (`src/components/layout/site-header.tsx`), which handles navigation state and
  theme switching on the client.
- Each UI primitive is colocated under `src/components/ui/` with strict
  TypeScript typings to encourage predictable reuse.

### Component Breakdown

- `Button` (`src/components/ui/button.tsx`): variant/size aware control used by
  interactive elements (e.g., theme toggle) with focus-ring accessibility baked
  in.
- `Card` (`src/components/ui/card.tsx`): semantic wrappers (`CardHeader`,
  `CardTitle`, etc.) for consistent content blocks across modules and
  dashboards.
- `Badge` (`src/components/ui/badge.tsx`): color-coded status labels aligned
  with analogy colors for “coming soon” and progress indicators.
- `NavigationLink` (`src/components/ui/navigation-link.tsx`): typed wrapper
  around `next/link` that handles active-state styling.
- `ThemeToggle` (`src/components/ui/theme-toggle.tsx`): client component that
  flips between light/dark palettes and uses the shared button styles.

### Integration & Testing

- Updated `src/app/layout.tsx` to consume `SiteHeader`, exercise theme support,
  and keep existing footer structure.
- Refactored `src/app/page.tsx` to render feature highlights with `Card` +
  `Badge`, validating design token alignment.
- Ran `npm run lint` to confirm the new components satisfy existing quality
  gates.

### Challenges & Follow-ups

- Button link styling currently relies on Tailwind utility classes in `Link`
  elements; consider adding an `asChild` pattern or dedicated link-button when
  navigation flows mature (ties into Issue 1.1.4).
- Future Storybook integration remains outstanding and should be revisited when
  the component library stabilizes.

## Issue 1.1.4 – Core Navigation and Layout (2025-09-24)

### Summary

- Elevated layout structure with global container, skip link, shared
  header/footer, and breadcrumb trail fed by the App Router.
- Added responsive module sidebar navigation with progress indicators, status
  badges, and mobile disclosure.
- Introduced loading skeletons for route transitions to keep navigation feedback
  consistent.

### Architecture Notes

- Global layout (`src/app/layout.tsx`) now wraps children with `ThemeProvider`,
  `SiteHeader`, `Breadcrumbs`, and `SiteFooter`, providing a consistent shell
  for all routes.
- Module metadata centralised in `src/lib/modules.ts`; layout-aware components
  pull from this single source to render navigation, breadcrumbs, and metadata.
- `SidebarNav` (`src/components/layout/sidebar-nav.tsx`) and `Breadcrumbs`
  (`src/components/layout/breadcrumbs.tsx`) are client components leveraging
  `usePathname` for active state tracking.
- Modules route group introduces its own layout (`src/app/modules/layout.tsx`)
  to pair the sidebar with module content while keeping the rest of the app
  unaffected.

### Feature Details

- `SidebarNav` shows current module, status badges, phase labels, and progress
  via the shared `Progress` component; collapses into a toggleable panel on
  mobile.
- `Breadcrumbs` generates trail labels from path segments, enriching navigation
  for dynamic module routes.
- App-level and modules-specific `loading.tsx` files surface spinner-based
  feedback during route transitions.
- Placeholder module pages (`src/app/modules/page.tsx`,
  `src/app/modules/[slug]/page.tsx`) render metadata-driven content pending full
  curriculum authoring.

### Testing & Verification

- Manually exercised navigation between `/`, `/modules`, and
  `/modules/introduction` to confirm breadcrumbs, active states, and progress
  badges render appropriately.
- `npm run lint` executed to ensure new components align with existing lint
  rules.

### Follow-ups

- Integrate real progress tracking once the learning experience stores user
  state.
- Expand sidebar grouping (Phase 2/3) when additional modules are authored;
  current implementation anticipates this via metadata.

## Issue 1.2.1 – Analogy Context Framework (2025-09-24)

### Summary

- Added a React context to manage the active analogy and persist the choice in
  `localStorage`.
- Allow learners to switch lenses directly from the analogy visuals grid,
  keeping the navigation uncluttered.
- Highlighted sidebar modules and introduced analogy pills to reinforce the
  selected context.

### Architecture Notes

- `AnalogyProvider` (`src/lib/analogy-context.tsx`) wraps the global layout and
  exposes `useAnalogy` / `useAnalogyDetails` hooks.
- Pill components live in `src/components/analogies/`, reusing the Tailwind
  analogy variants from `globals.css`.
- `SidebarNav` now participates in the analogy context, decorating cards whose
  analogy matches the active selection.

### Testing & Verification

- Manually toggled between analogy types to confirm persistence and visual
  updates across header and sidebar.
- `npm run lint` (blocked here because `.next/cache` is read-only in the
  sandbox).

### Follow-ups

- Provide a compact quick-toggle for very small screens if the grid controls
  feel hidden.
- Pipe analogy context into module content once narrative assets ship.

## Issue 1.2.2 – Analogy Visual Components (2025-09-24)

### Summary

- Crafted animated visual cards for all four analogy contexts (Atari Bot,
  Writing Student, Math Tutor, Advanced Concepts).
- Wrapped the visuals in an `AnalogyShowcase` grid that responds to the active
  analogy selection and drives the home page hero section.
- Ensured the visuals rely on CSS/SVG gradients plus Framer Motion
  micro-animations for performance-friendly motion.

### Architecture Notes

- Visual implementations live in `src/components/analogies/analogy-visuals.tsx`,
  exporting `AnalogyShowcase` and individual card/visual primitives.
- Cards reuse analogy metadata via `useAnalogyDetails` and update the global
  context on selection to keep the experience consistent.
- Home page (`src/app/page.tsx`) now renders the showcase directly, replacing
  static emoji tiles.

### Testing & Verification

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- Manual responsiveness check across small and medium breakpoints to confirm
  grid collapse and animation smoothness.

### Follow-ups

- Add dedicated SVG illustration assets once design team supplies polished
  artwork.
- Consider lazy loading Framer Motion visuals when they move off-screen to
  further optimize long pages.

## Issue 1.3.1 – Chapter Template System (2025-09-24)

### Summary

- Wired MDX into the App Router with remark-math/rehype-katex so modules can
  embed equations and custom components.
- Built a reusable `ModuleLayout` featuring a sticky table of contents, module
  metadata rail, and previous/next navigation.
- Authored the "Introduction to RLHF" module entirely in MDX using templated
  sections (Equation, Intuition, Analogy, Visualization, Takeaways, Assessment).

### Architecture Notes

- `next.config.js` now wraps the base config with `@next/mdx` and math plugins.
- Layout and section helpers live in `src/components/modules/module-layout.tsx`
  with supporting metadata in `src/lib/modules.ts` and dynamic imports in
  `src/lib/module-content.ts`.
- KaTeX CSS loads globally via the app layout, and print-friendly utilities were
  added to `globals.css`.

### Testing & Verification

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- Manual review of `/modules/introduction` to confirm section anchors,
  mathematical rendering, and navigation.

### Follow-ups

- Add richer prerequisite metadata once downstream modules ship.
- Introduce automated MDX linting or content schema validation to ensure every
  module includes the required sections.

## Issue 1.3.2 – Interactive Visualization Framework (2025-09-24)

### Summary

- Set up a reusable visualization container with export controls, accessibility
  labelling, and responsive layout.
- Added slider and toggle control components to manage visualization parameters
  from the UI.
- Implemented a D3.js policy reward chart leveraging the new framework and
  embedded it in the Introduction module.

### Architecture Notes

- Visualization infrastructure lives under `src/components/visualizations/`
  (container, controls, D3 charts).
- `VisualisationContainer` handles PNG/SVG exports using `html-to-image` and DOM
  serialization.
- `PolicyImprovementChart` demonstrates D3 integration with React state,
  responding to KL penalty changes while keeping SSR-friendly hooks.

### Testing & Verification

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- Manual testing of the slider/toggle responsiveness and export buttons across
  breakpoints.

### Follow-ups

- Add more visualization types (preference comparisons, PPO updates) using the
  same framework.
- Consider lazy loading D3-heavy components if bundle size becomes a concern.

## Issue 1.4.1 – Introduction to RLHF Module (2025-09-24)

### Summary

- Expanded the MDX introduction lesson with the four-stage RLHF pipeline
  narrative and richer takeaways.
- Embedded the new policy reward visualization and linked to downstream
  reward/policy modules.
- Added a five-question interactive self-check with instant feedback aligned
  with the book’s introductory chapter.

### Architecture Notes

- Module content lives in `content/modules/introduction.mdx`, leveraging layout
  helpers, `MathBlock`, and the visualization framework.
- Module metadata (`src/lib/modules.ts`) continues to drive TOC rendering, so
  the new sections automatically appear.
- Interactive assessment powered by `AssessmentQuiz`
  (`src/components/modules/assessment-quiz.tsx`) keeps quiz logic reusable for
  future modules.

### Testing & Verification

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- Manual walkthrough of `/modules/introduction` to verify narrative flow,
  visualization interactivity, and quiz updates.
- `npm run build`

### Follow-ups

- Once reward modeling/PPO modules land, cross-link back to this introduction
  for loop closure.
- Gather early learner feedback on the self-check questions and iterate.

## Issue 1.4.2 – MDX Build Failure Fix (2025-09-25)

### Summary

- Resolved the `mdxRs` parser crash in `content/modules/introduction.mdx` by
  moving the analogy comparison data into a shared constant and reusing it in
  the JSX tree.
- Restored the inline analogy copy so the MDX content matches the intended
  narrative while still compiling under the Rust MDX pipeline.

### Architecture Notes

- Exported `analogyItems` alongside the MDX imports, allowing other modules (or
  tests) to reuse the same dataset if required.
- Keeping the object literal outside of the JSX attribute sidesteps SWC’s
  expression parser limitations while preserving type safety when the file is
  imported.

### Testing & Verification

- `npm run build`

### Follow-ups

- Consider extracting other large attribute literals in MDX content into shared
  constants to avoid future parser regressions when `mdxRs` is enabled.

## Issue 1.4.2 – Reward Modeling Module (2025-09-26)

### Summary

- Delivered the full Reward Modeling chapter, promoting it to an available
  module with content drawn from Chapter 7 of the RLHF book.
- Added interactive playgrounds for human/editor comparisons and the
  Bradley–Terry probability plus loss curve.
- Documented implementation details, including the canonical PyTorch snippet,
  margin variants, and benchmark references.

### Architecture Notes

- Authored the module in `content/modules/reward-modeling.mdx`, reusing shared
  section components and the quiz framework.
- Updated navigation metadata in `src/lib/modules.ts` and wired the MDX loader
  in `src/lib/module-content.ts`.
- Implemented new visualisations in
  `src/components/visualizations/preference-comparison-playground.tsx` and
  `src/components/visualizations/reward-model-loss-explorer.tsx` using
  `VisualizationContainer`.

### Testing & Verification

- `npm run build`
- Manual QA of both interactive components (slider bounds, export buttons) and
  quiz feedback.

### Follow-ups

- Consider adding real annotator statistics to the playground once datasets are
  available.
- Extend the module with outcome/process reward case studies when additional
  chapters are published.

## Issue 1.4.3 – Policy Gradients (PPO) Module (2025-09-26)

### Summary

- Published the PPO module aligned with Chapter 11 of the RLHF book, making it
  available in the guide.
- Added interactive visualisations for policy ratio trajectories (learning rate,
  clip range, KL penalty) and a clipping demonstration contrasting PPO with
  vanilla policy gradients.
- Captured the clipped objective, Atari analogy, PyTorch training loop, and quiz
  emphasising trust-region intuition.

### Architecture Notes

- Authored the module in `content/modules/policy-gradients.mdx`, reusing shared
  layout primitives and `AssessmentQuiz`.
- Updated module metadata in `src/lib/modules.ts` and the dynamic loader in
  `src/lib/module-content.ts`.
- Implemented visualisations in
  `src/components/visualizations/ppo-training-playground.tsx` and
  `src/components/visualizations/ppo-clip-visualizer.tsx` with
  `VisualizationContainer` and slider controls.

### Testing & Verification

- `npm run build`
- Manual QA of slider ranges, trajectory behaviour, export buttons, and quiz
  responses.

### Follow-ups

- Add entropy-target or value-loss diagnostics once further Chapter 11 material
  is incorporated.
- Connect the playground to real PPO training logs when available to validate
  the simplified simulator.

## Issue 1.4.4 – Direct Preference Optimization (2025-09-26)

### Summary

- Published the DPO module based on Chapter 12, showing how to align policies
  offline without reward models.
- Added interactive visualisations for β/margin weighting and the DPO loss curve
  to illustrate preference displacement.
- Captured the core derivation, debate analogy, PyTorch training step, and quiz
  covering β tuning and variants like REBEL.

### Architecture Notes

- Authored `content/modules/direct-preference-optimization.mdx`, reusing shared
  section components and `AssessmentQuiz`.
- Updated module metadata (`src/lib/modules.ts`) and loader
  (`src/lib/module-content.ts`).
- Implemented visualisations in
  `src/components/visualizations/dpo-beta-playground.tsx` and
  `src/components/visualizations/dpo-loss-surface.tsx` using
  `VisualizationContainer` controls.

### Testing & Verification

- `npm run build`
- Manual QA of slider bounds, weight calculations, and quiz feedback.

### Follow-ups

- Add empirical preference displacement diagnostics once production logs are
  available.
- Capture IPO/cDPO calibration recipes when they stabilise in the ecosystem.

## Issue 2.1.1 – Problem Setup & Context Module (2025-09-27)

### Summary

- Authored the problem-setup module to consolidate Chapters 3–6: mathematical
  definitions, pipeline overviews, and preference data practices.
- Added interactive demos for pairwise annotation logging and bias visualisation
  to reflect Chapter 6 workflows.
- Highlighted modern multi-stage pipelines (e.g., Tülu 3), KL-regularised
  objectives, and data schema recommendations.

### Architecture Notes

- Module lives in `content/modules/problem-setup.mdx`, using shared layout
  components, `AssessmentQuiz`, and new visualisations.
- Updated `src/lib/modules.ts` and `src/lib/module-content.ts` so the module
  appears in navigation and dynamic imports.
- Visualisations implemented in
  `src/components/visualizations/preference-interface-demo.tsx` and
  `src/components/visualizations/preference-bias-visualizer.tsx`, both wrapped
  by `VisualizationContainer`.

### Testing & Verification

- `npm run build`
- Manual QA of interactive controls, annotation JSON output, and quiz
  explanations.

### Follow-ups

- Integrate real annotation schema examples once a data export is available.
- Add links to forthcoming instruction tuning and reward modeling modules for
  cross-navigation once finalised.

## Issue 2.1.2 – Instruction Tuning Module (2025-09-27)

### Summary

- Delivered the Chapter 9 instruction tuning module covering chat templates,
  dataset curation, masking, and staging guidance for RLHF.
- Added interactive tools: a chat template builder toggling between ChatML and
  LLaMA styles, and a prompt masking visualiser for assistant-token loss.
- Documented multi-turn unrolling, task mixture practices, and collected a
  targeted assessment quiz.

### Architecture Notes

- Module authored in `content/modules/instruction-tuning.mdx`, reusing shared
  section components and `AssessmentQuiz`.
- Navigation/loader updated in `src/lib/modules.ts` and
  `src/lib/module-content.ts` to expose the new chapter.
- Visualisations implemented in
  `src/components/visualizations/chat-template-builder.tsx` and
  `src/components/visualizations/prompt-masking-visualizer.tsx`, leveraging
  `VisualizationContainer`.

### Testing & Verification

- `npm run build`
- Manual QA of template generation, masking preview, and quiz feedback.

### Follow-ups

- Integrate real dataset statistics (token counts, task mixtures) when
  available.
- Link directly to problem-setup, reward-modeling, and PPO modules for guided
  learning flows.

## Issue 2.1.3 – Regularization Module (2025-09-27)

### Summary

- Added the Chapter 8 regularisation module covering KL penalties, entropy
  bonuses, and auxiliary losses that stabilise RLHF.
- Built interactive KL penalty and trade-off playgrounds to visualise how λ and
  entropy bonuses balance reward gains with safety.
- Captured auxiliary NLL adaptations and delivered a quiz on tuning decisions
  and failure modes.

### Architecture Notes

- Module authored in `content/modules/regularization.mdx`, reusing shared
  section components and `AssessmentQuiz`.
- Updated navigation metadata (`src/lib/modules.ts`) and loader
  (`src/lib/module-content.ts`) to surface the chapter.
- Visualisations implemented in
  `src/components/visualizations/kl-penalty-playground.tsx` and
  `src/components/visualizations/regularization-tradeoff.tsx`, both using
  `VisualizationContainer` plus slider controls.

### Testing & Verification

- `npm run build`
- Manual QA of KL curves, trade-off indicators, and quiz explanations.

### Follow-ups

- Connect the playground to real training logs (e.g., target KL traces) when
  available.
- Extend coverage with margin-based reward regularisation variants (e.g., Llama
  2’s margin loss) if future chapters provide datasets.

## Issue 2.1.4 – Rejection Sampling Module (2025-09-27)

### Summary

- Implemented the rejection sampling module covering Chapter 10’s sampling →
  scoring → selection workflow.
- Built interactive sampling playground and method comparison chart to visualise
  parameter trade-offs and baseline positioning versus PPO/DPO.
- Added pseudocode snippet and quiz to reinforce the baseline technique and its
  relationship to Best-of-N sampling.

### Architecture Notes

- Module content lives in `content/modules/rejection-sampling.mdx` using shared
  layout components and `AssessmentQuiz`.
- Updated `src/lib/modules.ts` ordering and `src/lib/module-content.ts` loader
  for the new slug.
- Visualisations implemented in
  `src/components/visualizations/rejection-sampling-playground.tsx` and
  `src/components/visualizations/method-comparison-chart.tsx` with
  `VisualizationContainer`/slider controls.

### Testing & Verification

- `npm run build`
- Manual QA of sampling parameters, selection modes, comparison chart, and quiz
  feedback.

### Follow-ups

- Integrate real reward statistics or KL deltas when production logs are
  available.
- Extend the comparison chart with empirical metrics once PPO/DPO evaluations
  are standardised in the guide.

## Issue 2.2.1 – Concept Playground Implementation (2025-09-27)

### Summary

- Launched the `/playground` sandbox so learners can experiment with rejection
  sampling, PPO, and DPO side by side, following Chapters 10–12 of the RLHF
  book.
- Added guided experiment checklists, expected signals, and session logging to
  turn the visualisations into a structured workflow rather than stand-alone
  widgets.
- Enabled CSV export plus performance summaries so learners can review or share
  runs without storing data server-side.

### Architecture Notes

- New App Router page at `src/app/playground/page.tsx` renders the client-side
  `ConceptPlayground` container.
- `src/components/playground/concept-playground.tsx` orchestrates scenario
  metadata, snapshot capture, comparison table, session log, and export
  handling.
- Extended `rejection-sampling-playground`, `ppo-training-playground`, and
  `dpo-beta-playground` with optional `onSnapshot` callbacks and exported
  snapshot typings so the playground can aggregate metrics in real time.
- Added `suppressHydrationWarning` to the root `<html>` element so the theme
  provider's runtime class toggles (light/dark) do not trigger hydration
  mismatches that were blocking client-side navigation.

### Testing & Verification

- `npm run build`
- Manual smoke test of each scenario: parameter changes refresh the latest
  reading, recordings land in the session log, and CSV export downloads with
  captured metrics.

### Follow-ups

- Consider persisting the session log to `localStorage` so reloads keep recent
  experiments.
- Add additional scenarios (e.g., KL regularisation sweeps) once corresponding
  chapters ship.

## Issue 3.1.1 – Constitutional AI Module (2025-09-27)

### Summary

- Authored the Constitutional AI & AI Feedback module using Chapter 13 material,
  covering constitutions, synthetic critiques, and preference generation.
- Added three interactive labs: a constitution builder with critique timelines,
  an AI-versus-human feedback cost planner, and an iteration explorer for
  self-improvement runs.
- Documented real-world deployments (Claude, ChatGPT, Llama series, Nemotron)
  and highlighted bias/oversight trade-offs required for RLAIF pipelines.

### Architecture Notes

- New MDX content in `content/modules/constitutional-ai.mdx` uses existing
  layout helpers and imports the new visualisations.
- Updated `src/lib/modules.ts` metadata and `src/lib/module-content.ts` importer
  for the `constitutional-ai` slug so navigation and dynamic loading work.
- Implemented reusable visual components:
  - `ConstitutionBuilder`
    (`src/components/visualizations/constitution-builder.tsx`) renders scenario
    timelines that apply constitution principles in sequence.
  - `AiFeedbackComparison`
    (`src/components/visualizations/ai-feedback-comparison.tsx`) estimates cost,
    turnaround, and alignment scores for blended human/AI feedback.
  - `ConstitutionalIterationExplorer`
    (`src/components/visualizations/constitutional-iteration-explorer.tsx`)
    models win rates, hallucination reduction, and bias index across critique
    iterations.

### Testing & Verification

- `npm run build`
- Manual review of `/modules/constitutional-ai` to verify interactive controls,
  quiz behaviour, and navigation entries.

### Follow-ups

- Expand visualisations with real benchmarking data (e.g., win rates from public
  CAI releases) once available.
- Consider surfacing downloadable constitution templates alongside the builder
  for quick experimentation.
