# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200 (ng serve)
npm run build      # production build to dist/
npm run watch      # incremental dev build (watch mode)
npm test           # run unit tests with Vitest via ng test
```

Generate code with the Angular CLI:

```bash
ng generate component src/app/my-component
ng generate service src/app/my-service
ng generate guard src/app/my-guard
```

## Architecture

Angular 21 standalone-components app (no NgModules). Entry point is `src/main.ts`, which bootstraps `App` using `appConfig`.

- **`src/app/app.ts`** — root component; uses Angular signals (`signal()`) for reactive state
- **`src/app/app.config.ts`** — application-level providers (`provideRouter`, `provideBrowserGlobalErrorListeners`)
- **`src/app/app.routes.ts`** — top-level route definitions; add lazy-loaded feature routes here
- **`src/styles.css`** — global styles
- **`public/`** — static assets copied verbatim to the build output

### Key conventions

- All components are standalone (`imports: [...]` directly on the decorator, no shared NgModule).
- Prefer Angular signals over RxJS `BehaviorSubject` for local component state.
- Prettier is configured in `package.json` (100-char line width, single quotes, Angular HTML parser).
- Test files use the `.spec.ts` suffix and run under Vitest (not Karma/Jasmine).
