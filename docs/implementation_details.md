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
- Surface a global analogy switcher bar beneath the site header so learners can
  change lenses without crowding the navigation.
- Highlighted sidebar modules and introduced analogy pills to reinforce the
  selected context.

### Architecture Notes

- `AnalogyProvider` (`src/lib/analogy-context.tsx`) wraps the global layout and
  exposes `useAnalogy` / `useAnalogyDetails` hooks.
- Switcher and pill components live in `src/components/analogies/`, reusing the
  Tailwind analogy variants from `globals.css`.
- `SidebarNav` now participates in the analogy context, decorating cards whose
  analogy matches the active selection.

### Testing & Verification

- Manually toggled between analogy types to confirm persistence and visual
  updates across header and sidebar.
- `npm run lint` (blocked here because `.next/cache` is read-only in the
  sandbox).

### Follow-ups

- Add a mobile-friendly selector presentation (current control stacks nicely but
  could use affordances on very small screens).
- Pipe analogy context into module content once narrative assets ship.
