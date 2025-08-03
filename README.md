# Luca Becker's Personal Website

This is the source code for my personal website and blog, built with Astro, TypeScript, and Tailwind CSS. The site is automatically deployed to GitHub Pages.

🌐 **Live Site:** [luca-becker.me](https://luca-becker.me)

## About This Repository

This repository contains the complete source code for my personal website. While the code is publicly visible for transparency and educational purposes, please note that all content, design, and code are protected by copyright (see LICENSE file).

## 🚀 Project Structure

The project is organized as follows:

```
/
├── public/
│   ├── assets
│   │   ├── fonts
|   |   └── images
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── home/
|   |   └── general/
|   |       ├── Header.astro
|   |       ├── Footer.astro
|   |       └── ...
│   ├── data/
│   ├── layouts/
│   |   |── Layout.astro
│   |   └── ...
│   ├── pages/
│   |   ├── projects.astro
│   |   ├── index.astro
│   ├── styles/
│   |   |── custom-styles.css
│   |   |── fonts.css
│   |   └── styles.css
│   ├── types/
│   ├── utils/
├── package.json
└── ...
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/assets` directory.

Personal data and content are managed in the `src/data` and `src/content` directories.

## 🚀 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. **Triggers:** Automatically on every push to the `main` branch
2. **Build Process:** Uses Node.js version from `.nvmrc`, installs dependencies, and builds the static site
3. **Deployment:** Deploys the built site to GitHub Pages with custom domain support
4. **Live Site:** Available at [luca-becker.me](https://luca-becker.me)

## 🧞 Development Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:4321`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## 🛠️ Tech Stack

- **Framework:** [Astro](https://astro.build) - Static Site Generator
- **Styling:** [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Language:** TypeScript - Type-safe JavaScript
- **Content:** MDX - Markdown with JSX components
- **Hosting:** GitHub Pages - Static site hosting
- **Deployment:** GitHub Actions - Automated CI/CD

## 📄 License

All rights reserved. See [LICENSE](./LICENSE) file for details.
