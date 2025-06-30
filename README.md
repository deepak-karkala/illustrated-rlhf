# RLHF Illustrated Guide

An interactive visual guide to Reinforcement Learning from Human Feedback (RLHF)
that makes complex concepts accessible through intuitive analogies and hands-on
visualizations.

## 🎯 Overview

This project transforms Nathan Lambert's RLHF book content into an engaging,
interactive learning experience featuring:

- **Analogy Toolbox**: Three consistent analogies (Atari Game Bot, Creative
  Writing Student, Math Tutor Bot)
- **Interactive Visualizations**: D3.js-powered diagrams for each concept
- **Modular Content**: Standalone, interconnected modules following a proven
  template
- **Progressive Learning**: From basic concepts to advanced topics like
  Constitutional AI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/deepak-karkala/illustrated-rlhf.git
cd illustrated-rlhf
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript checks
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run E2E tests

### Quality Checks

Before committing, ensure all quality checks pass:

```bash
npm run lint && npm run type-check && npm run test
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **Visualizations**: D3.js with React integration
- **Math Rendering**: KaTeX
- **Content**: MDX for rich content
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

### Folder Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable components
│   ├── ui/             # Basic UI components
│   ├── visualizations/ # D3.js visualizations
│   ├── analogies/      # Analogy-specific components
│   └── layout/         # Layout components
├── lib/                # Utilities and types
└── utils/              # Helper functions

content/
├── modules/            # Module content (MDX)
└── assets/            # Images and diagrams
```

### Design System

The project uses a consistent color-coded analogy system:

- **Blue (Atari)**: Core RL concepts
- **Green (Writing)**: Preference learning
- **Orange (Reasoning)**: Reasoning and verification
- **Purple (Advanced)**: Advanced topics

## 📚 Content Structure

### Module Template

Each module follows a standardized template:

- 📀 **Equation**: Mathematical formulation
- 🧠 **Intuition**: Plain English explanation
- 🎮/✍️/🧮 **Analogy**: Relevant analogy example
- 🖼️ **Visualization**: Interactive diagram
- 💡 **Key Takeaways**: Summary points
- 🔗 **Connections**: Links to related concepts

### Learning Path

**Phase 1 (MVP)**:

1. Introduction to RLHF
2. Reward Modeling
3. Policy Gradients (PPO)
4. Direct Preference Optimization (DPO)

**Phase 2**: 5. Problem Setup & Context 6. Instruction Tuning 7.
Regularization 8. Rejection Sampling

**Phase 3**: 9. Constitutional AI 10. Reasoning Training 11. Tool Use & Function
Calling 12. Advanced Topics

## 🎨 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow the established naming conventions
- Write descriptive component and function names
- Include proper TypeScript interfaces
- Follow accessibility best practices

### Component Development

```typescript
// Example component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export function Component({ title, onAction }: ComponentProps): JSX.Element {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="heading-2">{title}</h2>
      <button onClick={onAction} className="btn-primary">
        Action
      </button>
    </div>
  );
}
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: add new feature"`
3. Push and create PR: `git push origin feature/your-feature`

Commit messages follow conventional commits format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `test:` for tests

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Accessibility Testing

The project maintains WCAG 2.1 AA compliance:

- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management

## 📊 Performance

### Targets

- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Page Load**: <3s on 3G connection
- **Visualization Rendering**: <500ms
- **Mobile Performance**: 60fps animations

### Monitoring

Performance is monitored through:

- Vercel Analytics
- Core Web Vitals tracking
- Bundle size analysis

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Read the [CLAUDE.md](./CLAUDE.md) development guidelines
2. Check existing issues or create a new one
3. Fork the repository
4. Create a feature branch
5. Make your changes
6. Add tests if applicable
7. Ensure all quality checks pass
8. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Nathan Lambert for the original RLHF book content
- The RLHF research community for advancing the field
- Contributors and maintainers of this educational resource

## 📞 Support

- 📧 Issues:
  [GitHub Issues](https://github.com/deepak-karkala/illustrated-rlhf/issues)
- 💬 Discussions:
  [GitHub Discussions](https://github.com/deepak-karkala/illustrated-rlhf/discussions)
- 📖 Documentation:
  [Project Wiki](https://github.com/deepak-karkala/illustrated-rlhf/wiki)

---

**Built with ❤️ for the ML education community**
