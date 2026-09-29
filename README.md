# Ishani Kathuria - Research Portfolio

A personal portfolio website showcasing research publications, projects, and professional experience in Artificial Intelligence and Machine Learning.

## Tech Stack

Built with a modern frontend stack focusing on performance and interactivity:

- **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Type**: Fraunces, Inter, IBM Plex Mono (Google Fonts)

## Features

- **Human / machine twin**: the home page pairs prose with the same facts as JSON, and a small agent cursor reads the hero on load. A full Machine view (with copy-as-text) and a WebMCP tool layer make the site readable by AI agents.
- **Interactive project diagrams**: every project and paper has its own diagram you can play with (query router, red-team loop, in-browser vs server inference, fuzzy menu, and more), built from that item's real mechanism.
- **Real product screenshots and hackathon tiles**: framed, populated captures of the live demos; hackathons as a color-tile grid.
- **Live build tracker** (`#dashboard`): every public repo with push recency and `PLAN.md` progress, pulled from the GitHub API.
- **`/ir` career-fair page**: a standalone, framework-free landing page for QR/NFC use, with vCard, résumé, and analytics.
- **Accessible and responsive**: WCAG AA contrast, keyboard focus, 44px targets, reduced-motion support.

## Design

The visual system (paper and ink, one highlighter accent, Fraunces / Inter / IBM Plex Mono, stickers, hard-offset shadows) is documented in **[BRAND.md](BRAND.md)**: tokens, contrast ratios, voice, components, motion, accessibility rules, and the release checklist. Tokens live in [`index.css`](index.css).

## Run Locally

To run this project on your local machine:

1.  **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/) installed.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Deployment

This project is configured for deployment on [GitHub Pages](https://pages.github.com/).

To deploy a new version:
```bash
npm run deploy
```

## License

This project is licensed under the Apache License 2.0.
