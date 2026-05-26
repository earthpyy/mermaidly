<p align="center">
  <a href="https://mermaidly.app">
    <img src="apps/web/public/favicon.svg" width="80" height="80" alt="mermaidly logo" />
  </a>
</p>

<h3 align="center">mermaidly</h3>

<p align="center">
  Paste Mermaid code, see diagrams instantly.<br />
  <a href="https://mermaidly.app"><strong>mermaidly.app</strong></a>
</p>

<p align="center">
  <a href="https://github.com/earthpyy/mermaidly/blob/main/LICENSE"><img src="https://img.shields.io/github/license/earthpyy/mermaidly" alt="License" /></a>
  <a href="https://github.com/earthpyy/mermaidly/stargazers"><img src="https://img.shields.io/github/stars/earthpyy/mermaidly" alt="Stars" /></a>
  <img src="https://img.shields.io/badge/vue-3.5-42b883" alt="Vue 3.5" />
  <img src="https://img.shields.io/badge/mermaid-11-ff3670" alt="Mermaid 11" />
</p>

<br />

<p align="center">
  <img src="apps/web/public/og-image.png" width="720" alt="mermaidly screenshot — code editor on the left, rendered diagram on the right" />
</p>

---

## Features

- **Instant rendering** — diagrams update as you type, no button to click
- **All Mermaid diagram types** — flowchart, sequence, class, state, ER, Gantt, pie, mindmap, and more
- **Export** — download as PNG, PNG @2x, SVG, or copy SVG code to clipboard
- **Share** — generate a URL with your diagram encoded in it, or a view-only link
- **Dark mode** — automatic system detection with manual toggle
- **Keyboard shortcuts** — `Ctrl/Cmd+S` to save, `Ctrl/Cmd+Shift+C` to share
- **Zoom controls** — pan, zoom in/out, fit to screen, editable zoom level
- **Example gallery** — preloaded examples for quick starts
- **No backend** — everything runs in your browser, nothing is sent to a server

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 9+

### Development

```bash
# Clone the repository
git clone https://github.com/earthpyy/mermaidly.git
cd mermaidly

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

### Build

```bash
pnpm build
```

### Format

```bash
pnpm format
```

## Tech Stack

| Layer     | Technology                                            |
| --------- | ----------------------------------------------------- |
| Framework | [Vue 3.5](https://vuejs.org/) + TypeScript            |
| Rendering | [Mermaid.js 11](https://mermaid.js.org/)              |
| Styling   | [Tailwind CSS 4](https://tailwindcss.com/)            |
| Build     | [Vite 6](https://vite.dev/)                           |
| Hosting   | [Cloudflare Workers](https://workers.cloudflare.com/) |

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the [GPL-3.0 License](LICENSE).

---

<p align="center">
  Made by <a href="https://github.com/earthpyy">@earthpyy</a>
</p>
