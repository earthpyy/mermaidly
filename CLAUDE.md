# mermaidly

Mermaid diagram renderer SPA — paste code, see diagrams instantly.

## Tech Stack

- Monorepo: pnpm workspaces (`apps/web`, `apps/api`)
- Frontend: Vue 3.5 + Vite + TailwindCSS v4 + TypeScript
- Rendering: mermaid.js v11
- State: Vue composables (no Pinia, no Vue Router)
- Formatting: Prettier with tailwindcss plugin

## Commands

- `pnpm dev` — start dev server (apps/web)
- `pnpm build` — typecheck + production build
- `pnpm format` — format all files with prettier

## Architecture

- Composables in `apps/web/src/composables/` — useToast, useTheme, useEditor, useDiagram, useZoom, useShare, useExport
- useToast, useTheme, useEditor, useShare use module-level refs (singleton state shared across components)
- Design tokens are CSS custom properties in `apps/web/src/style.css`, toggled via `[data-theme="dark"]` on `<html>`
- Shared button/menu/modal CSS classes (`.btn`, `.menu`, `.modal-backdrop`) live in style.css alongside Tailwind

## Gotchas

- `tsconfig.node.json` needs `"composite": true` and `@types/node` for vite.config.ts to typecheck
- esbuild needs `allow-build=esbuild` in `.npmrc` for pnpm to resolve it without warnings
- Mermaid injects orphan DOM elements on render errors — useDiagram cleans these up manually
