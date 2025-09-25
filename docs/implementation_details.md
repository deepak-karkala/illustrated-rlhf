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
