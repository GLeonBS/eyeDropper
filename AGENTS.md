# AGENTS.md

Repository guidance for coding agents working in `eyeDropper`.

## 1) Project Scope and Structure
- Primary app is at repository root (`src/`, `vite.config.ts`, root `package.json`).
- Legacy app exists in `old/` with its own toolchain; only touch it when requested.
- Prefer root app changes by default.
- Root stack: React 19 + TypeScript + Vite + Tailwind CSS v4.
- ESLint uses flat config in `eslint.config.js`.
- TypeScript uses project references in `tsconfig.json`.

## 2) Source of Truth Files
- `package.json` for scripts and dependency versions.
- `eslint.config.js` for lint behavior.
- `tsconfig.app.json` and `tsconfig.node.json` for strictness and module rules.
- `vite.config.ts` for Vite plugins and deploy base path.
- `src/theme.css` and `src/index.css` for tokens/global styles/animations.

## 3) Setup and Common Commands (Root App)
Run commands from repository root unless noted.

### Install
- `npm install`

### Development
- `npm run dev` - start Vite dev server.
- `npm run preview` - preview production build.

### Build
- `npm run build` - runs `tsc -b && vite build`.

### Lint
- `npm run lint` - lint entire repo with `eslint .`.
- `npm run lint -- src/App.tsx` - lint one file.
- `npm run lint -- src/components/Button/ButtonED.tsx` - lint one component.

### Deploy
- `npm run deploy` - publishes `dist/` via `gh-pages`.
- Deploy assumes a successful `npm run build`.

## 4) Test Commands and Single-Test Guidance
Current test status:
- No test framework is configured in the root app.
- No `test` script exists in root `package.json`.
- No `*.test.*` or `*.spec.*` files are present.

Verification right now:
- Use `npm run lint` + `npm run build` as required validation.
- For targeted checks, use `npm run lint -- <file>`.

If tests are added later (recommended default: Vitest):
- Add scripts: `"test": "vitest"`, `"test:run": "vitest run"`, `"test:watch": "vitest --watch"`.
- Single test file: `npm run test:run -- src/path/to/file.test.ts`.
- Single test name: `npm run test:run -- -t "test name"`.

## 5) Legacy `old/` App Commands
Use only when task explicitly targets legacy code.
- `npm --prefix old install`
- `npm --prefix old run dev`
- `npm --prefix old run build`
- `npm --prefix old run preview`
Notes:
- `old/` has no lint or test scripts.
- `old/` uses older TypeScript/Vite versions than the root app.

## 6) Code Style and Conventions
### TypeScript and Types
- Keep compatibility with `strict: true`.
- Avoid `any` unless unavoidable and justified.
- Prefer explicit interfaces/types for props and structured state.
- Keep public prop types close to component definitions.
- Use unions for constrained variants (for example button variant values).

### Imports
- Order imports: external packages, then local modules, then styles.
- Remove unused imports immediately (`noUnusedLocals` is enabled).
- Prefer `import type` for type-only imports.
- Keep relative import style consistent with nearby files.
- Do not add path aliases unless TS/Vite config is updated together.

### React Patterns
- Use function components and hooks.
- Keep state updates immutable and explicit.
- Keep browser side effects inside `useEffect`.
- Guard browser-only APIs with feature detection.
- Prefer small focused components under `src/components/*`.

### Naming
- Components/files: `PascalCase` (for example `MobileMenu.tsx`).
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` only for true constants.
- Prefer `XProps` for new prop interfaces.
- Boolean names should read clearly (`isOpen`, `showColors`, `isAnimatedBackground`).

### Formatting
- No Prettier is configured; do not assume auto-formatting.
- Follow the local file style (quotes, semicolons, wrapping) when editing.
- Keep lines readable; wrap long JSX className strings/props.
- Use trailing commas only where local style already uses them.
- Keep JSX indentation and spacing consistent within a component.

### Error Handling
- Wrap async browser API usage (like `EyeDropper.open`) in `try/catch`.
- Set user-facing error state/message when operations fail.
- Prefer actionable error text over generic failures.
- Do not silently swallow errors unless UX intentionally requires it.
- Preserve behavior for unsupported browsers with feature checks first.

### Storage and Browser APIs
- Gate feature usage with checks like `"EyeDropper" in window`.
- Keep existing `localStorage` keys stable unless a migration is implemented.
- Read persisted values on startup when possible.
- Keep storage writes/removals consistent with state transitions.

### Styling and UI
- Tailwind utility classes are the default styling approach.
- Reuse `src/theme.css` tokens before introducing raw color values.
- Put app-wide styles/animations in `src/index.css`.
- Preserve responsive behavior (`md:` patterns are common).
- Keep accessibility attributes (`aria-label`, `role`, `aria-live`) intact.

### Accessibility and UX
- Interactive controls must remain keyboard accessible.
- Keep explicit button `type` values.
- Keep labels meaningful for selected colors and status text.
- Maintain contrast/legibility in both background modes.

## 7) Lint and Type Constraints from Config
TypeScript guardrails currently enabled:
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedSideEffectImports: true`
ESLint guardrails currently enabled:
- `@eslint/js` recommended base rules.
- `typescript-eslint` recommended rules.
- `eslint-plugin-react-hooks` `recommended-latest` rules.
- `eslint-plugin-react-refresh` Vite rules.

## 8) Cursor and Copilot Rules
Checked locations:
- `.cursorrules`
- `.cursor/rules/`
- `.github/copilot-instructions.md`
Result:
- No Cursor/Copilot rule files currently exist in this repository.
- If added later, treat them as higher-priority repository instructions.

## 9) Change Validation Checklist (for agents)
Before finishing most root-app changes:
1. `npm run lint`
2. `npm run build`
For small targeted edits:
1. `npm run lint -- <changed-file>`
2. `npm run build` (still preferred when TS/React logic changes)
When changing `old/`:
- `npm --prefix old run build`
