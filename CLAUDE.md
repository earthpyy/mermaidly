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
- `pnpm dev:api` — start the short-link API worker locally (`wrangler dev`, port 8787)
- `pnpm build` — typecheck + production build
- `pnpm deploy:web` / `pnpm deploy:api` — deploy each worker to Cloudflare
- `pnpm format` — format all files with prettier

## Architecture

- Composables in `apps/web/src/composables/` — useToast, useTheme, useEditor, useDiagram, useZoom, useShare, useExport
- useToast, useTheme, useEditor, useShare use module-level refs (singleton state shared across components)
- Design tokens are CSS custom properties in `apps/web/src/style.css`, toggled via `[data-theme="dark"]` on `<html>`
- Shared button/menu/modal CSS classes (`.btn`, `.menu`, `.modal-backdrop`) live in style.css alongside Tailwind
- `apps/api` is a standalone Cloudflare Worker (`src/index.ts`) for short links: `POST /shorten` stores `{code, viewOnly}` in a KV namespace (binding `LINKS`) and returns a random 7-char id; `GET /s/:id` resolves it and rewrites the value to refresh a sliding 90-day TTL. Share links shorten by default to `#s=<id>`; useShare falls back to the inline `#code=`/`#view=` base64 link on opt-out or API failure
- The web app reads the API base from `VITE_API_BASE` (see `apps/web/.env.example`); useShare defaults to `http://localhost:8787` in dev. The KV namespace id must be filled into `apps/api/wrangler.jsonc` before deploy (`wrangler kv namespace create LINKS`)

## Gotchas

- `tsconfig.node.json` needs `"composite": true` and `@types/node` for vite.config.ts to typecheck
- esbuild needs `allow-build=esbuild` in `.npmrc` for pnpm to resolve it without warnings
- Mermaid injects orphan DOM elements on render errors — useDiagram cleans these up manually
- Fonts are self-hosted via `@fontsource-variable/geist` (imported in `main.ts`), not Google Fonts. The CSS family names are `'Geist Variable'` and `'Geist Mono Variable'` — never plain `'Geist'`/`'Geist Mono'`
