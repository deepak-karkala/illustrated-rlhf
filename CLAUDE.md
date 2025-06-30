# CLAUDE.md - Coding Guidelines for RLHF Illustrated Guide

## 🎯 Project Overview

This is an interactive educational platform for RLHF (Reinforcement Learning
from Human Feedback) built with Next.js, TypeScript, and Tailwind CSS. The
project focuses on making complex RLHF concepts accessible through visual
learning and interactive elements.

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Visualizations**: D3.js with React integration
- **Math Rendering**: KaTeX
- **Content**: MDX for rich content
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Testing**: Jest + React Testing Library + Playwright

## 📋 Development Commands

### Setup & Development

```bash
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # Run TypeScript checks
npm run test            # Run Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run Playwright E2E tests
```

### Quality Checks (Run before committing)

```bash
npm run lint && npm run type-check && npm run test
```

## 🎨 Coding Style Guidelines

### TypeScript

- **Strict Mode**: Always use TypeScript strict mode
- **No Any Types**: Avoid `any` - use proper typing or `unknown`
- **Interface Over Type**: Prefer `interface` over `type` for object shapes
- **Explicit Return Types**: Always specify return types for functions
- **Null Safety**: Handle null/undefined explicitly

```typescript
// ✅ Good
interface ModuleProps {
  title: string;
  content: string;
  isActive?: boolean;
}

function renderModule(props: ModuleProps): JSX.Element {
  return <div>{props.title}</div>;
}

// ❌ Bad
function renderModule(props: any) {
  return <div>{props.title}</div>;
}
```

### React Components

- **Function Components**: Use function components with hooks
- **TypeScript Props**: Always type component props
- **Prop Destructuring**: Destructure props for cleaner code
- **Component Naming**: Use PascalCase for components
- **File Naming**: Use kebab-case for files, PascalCase for components

```typescript
// ✅ Good - components/analogy-selector.tsx
interface AnalogyTypeProps {
  currentAnalogy: string;
  onAnalogyChange: (analogy: string) => void;
}

export function AnalogySelector({
  currentAnalogy,
  onAnalogyChange,
}: AnalogyTypeProps): JSX.Element {
  // Component logic here
}

// ❌ Bad
export default function AnalogySelector(props) {
  // Component logic here
}
```

### Next.js Conventions

- **App Router**: Use Next.js 14+ App Router structure
- **Server Components**: Use Server Components by default, Client Components
  when needed
- **Dynamic Routes**: Use proper folder structure for dynamic routes
- **Metadata**: Always include proper metadata for SEO

```typescript
// ✅ Good - app/modules/[slug]/page.tsx
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `RLHF Module: ${params.slug}`,
    description: 'Interactive RLHF learning module',
  };
}

export default function ModulePage({ params }: PageProps): JSX.Element {
  return <div>Module: {params.slug}</div>;
}
```

### CSS/Tailwind

- **Tailwind First**: Use Tailwind classes, avoid custom CSS when possible
- **Component Classes**: Create component-specific classes in CSS modules when
  needed
- **Responsive Design**: Always implement mobile-first responsive design
- **Design Tokens**: Use design system colors and spacing

```typescript
// ✅ Good
<div className="bg-blue-50 p-4 rounded-lg shadow-sm md:p-6 lg:p-8">
  <h2 className="text-xl font-semibold text-blue-900 mb-4">
    Module Title
  </h2>
</div>

// ❌ Bad - avoid inline styles
<div style={{ backgroundColor: '#eff6ff', padding: '16px' }}>
  <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
    Module Title
  </h2>
</div>
```

## 🔧 Architecture Guidelines

### Folder Structure

```
app/                    # Next.js App Router
├── globals.css        # Global styles
├── layout.tsx         # Root layout
├── page.tsx          # Home page
├── modules/          # Module pages
│   └── [slug]/       # Dynamic module routes
├── playground/       # Interactive playground
└── api/             # API routes (if needed)

components/            # Reusable components
├── ui/               # Basic UI components
├── visualizations/   # D3.js visualizations
├── analogies/        # Analogy-specific components
└── layout/          # Layout components

lib/                  # Utility libraries
├── utils.ts         # General utilities
├── constants.ts     # App constants
├── types.ts         # TypeScript types
└── validations.ts   # Data validation

content/             # MDX content files
├── modules/         # Module content
└── assets/         # Images, diagrams
```

### Component Organization

```typescript
// Component file structure
interface ComponentProps {
  // Props interface first
}

const COMPONENT_CONSTANTS = {
  // Constants if needed
};

export function Component({ prop1, prop2 }: ComponentProps): JSX.Element {
  // Hooks at the top
  const [state, setState] = useState();

  // Event handlers
  const handleEvent = useCallback(() => {
    // Handler logic
  }, []);

  // Early returns
  if (!prop1) return null;

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## 🧪 Testing Guidelines

### Unit Testing (Jest + React Testing Library)

- **Test Behavior**: Test what the component does, not how it does it
- **User-Centric**: Test from user's perspective
- **Descriptive Names**: Use descriptive test names
- **Arrange-Act-Assert**: Follow AAA pattern

```typescript
// ✅ Good
import { render, screen, fireEvent } from '@testing-library/react';
import { AnalogySelector } from './analogy-selector';

describe('AnalogySelector', () => {
  it('should call onAnalogyChange when user selects different analogy', () => {
    const mockOnChange = jest.fn();
    render(
      <AnalogySelector
        currentAnalogy="atari"
        onAnalogyChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Creative Writing'));

    expect(mockOnChange).toHaveBeenCalledWith('writing');
  });
});
```

### E2E Testing (Playwright)

- **User Journeys**: Test complete user workflows
- **Critical Paths**: Focus on main user interactions
- **Cross-Browser**: Test on multiple browsers

```typescript
// ✅ Good - tests/e2e/module-navigation.spec.ts
import { test, expect } from '@playwright/test';

test('user can navigate through RLHF modules', async ({ page }) => {
  await page.goto('/');

  await page.click('text=Introduction to RLHF');
  await expect(page).toHaveURL(/\/modules\/introduction/);

  await page.click('text=Next Module');
  await expect(page).toHaveURL(/\/modules\/reward-modeling/);
});
```

### Testing Commands

```bash
npm run test                    # Run all tests
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage
npm run test:e2e              # E2E tests
npm run test:e2e:headed       # E2E with browser UI
```

## 🔒 Security Guidelines

### General Security

- **No Secrets in Code**: Never commit API keys, passwords, or secrets
- **Environment Variables**: Use `.env.local` for sensitive data
- **Input Validation**: Validate all user inputs
- **XSS Prevention**: Sanitize user content
- **CSP Headers**: Implement Content Security Policy

```typescript
// ✅ Good - Environment variables
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// ❌ Bad - Hardcoded secrets
const API_KEY = 'sk-1234567890abcdef';
```

### Next.js Security

- **Server Actions**: Use proper validation for server actions
- **API Routes**: Implement proper authentication/authorization
- **Headers**: Set security headers in `next.config.js`

```javascript
// ✅ Good - next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

### Dependencies

- **Regular Updates**: Keep dependencies updated
- **Audit**: Run `npm audit` regularly
- **Minimal Dependencies**: Only install necessary packages

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Add ARIA labels for complex interactions
- **Keyboard Navigation**: Ensure full keyboard accessibility
- **Color Contrast**: Maintain 4.5:1 contrast ratio minimum
- **Focus Management**: Proper focus indicators and order

```typescript
// ✅ Good
<button
  aria-label="Select Atari Game Bot analogy"
  onClick={handleAnalogyChange}
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  🎮 Atari Game Bot
</button>

// ❌ Bad
<div onClick={handleAnalogyChange}>
  🎮 Atari Game Bot
</div>
```

### Testing Accessibility

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/react

# Test with screen readers
# Use NVDA (Windows), VoiceOver (Mac), or ORCA (Linux)
```

## 🎨 Design System Guidelines

### Colors (Tailwind Classes)

```typescript
// Color system based on analogies
const COLORS = {
  // Blue: Core RL concepts (Atari analogy)
  atari: 'bg-blue-50 text-blue-900 border-blue-200',

  // Green: Preference learning (Writing analogy)
  writing: 'bg-green-50 text-green-900 border-green-200',

  // Orange: Reasoning (Math Tutor analogy)
  reasoning: 'bg-orange-50 text-orange-900 border-orange-200',

  // Purple: Advanced concepts
  advanced: 'bg-purple-50 text-purple-900 border-purple-200',
};
```

### Typography

```css
/* Typography hierarchy */
.heading-1 {
  @apply text-4xl font-bold leading-tight;
}
.heading-2 {
  @apply text-3xl font-semibold leading-tight;
}
.heading-3 {
  @apply text-2xl font-semibold leading-relaxed;
}
.body-large {
  @apply text-lg leading-relaxed;
}
.body {
  @apply text-base leading-relaxed;
}
.caption {
  @apply text-sm text-gray-600;
}
```

## 📊 Performance Guidelines

### Core Web Vitals Targets

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Strategies

```typescript
// ✅ Good - Image optimization
import Image from 'next/image';

<Image
  src="/module-diagram.svg"
  alt="RLHF process diagram"
  width={800}
  height={600}
  priority // For above-fold images
/>

// ✅ Good - Dynamic imports for heavy components
const HeavyVisualization = dynamic(
  () => import('./heavy-visualization'),
  {
    loading: () => <div>Loading visualization...</div>,
    ssr: false // If component doesn't work with SSR
  }
);
```

## 🔄 Git Guidelines

### Commit Messages

Use conventional commits format:

```
type(scope): description

feat(analogy): add creative writing analogy selector
fix(visualization): resolve D3.js rendering issue
docs(readme): update installation instructions
test(components): add tests for module navigation
```

### Branch Naming

```
feature/analogy-toolbox-system
fix/visualization-performance
docs/component-documentation
test/e2e-module-navigation
```

### Pre-commit Checklist

- [ ] Code passes `npm run lint`
- [ ] TypeScript passes `npm run type-check`
- [ ] Tests pass `npm run test`
- [ ] No console.log statements in production code
- [ ] Accessibility guidelines followed
- [ ] Performance implications considered

## 🚨 Common Pitfalls to Avoid

### Next.js Specific

- **Don't**: Use `useEffect` for data fetching in Server Components
- **Don't**: Import client-only libraries in Server Components
- **Don't**: Forget to handle loading and error states
- **Don't**: Use `any` type - be explicit with types

### React/TypeScript

- **Don't**: Mutate props or state directly
- **Don't**: Use array index as key in dynamic lists
- **Don't**: Forget to memoize expensive calculations
- **Don't**: Create components inside render functions

### Performance

- **Don't**: Import entire libraries when you need specific functions
- **Don't**: Use large images without optimization
- **Don't**: Create unnecessary re-renders
- **Don't**: Block the main thread with heavy computations

## 📚 Learning Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [D3.js Documentation](https://d3js.org/)

### Testing

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)

### Accessibility

- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Last Updated**: Created for RLHF Illustrated Guide project  
**Review Cycle**: Update monthly or when tech stack changes  
**Questions**: Create GitHub issue with `question` label
