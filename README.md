# Cupid Moolchandani — Portfolio

A creative, interactive personal portfolio built as a static site (HTML/CSS/JS) so it can be hosted **for free on GitHub Pages**.

## ✨ Features
- Animated neural-network canvas background
- Typing role rotator + gradient hero
- Dark / light theme (persisted)
- Scroll-reveal animations & 3D-tilt project cards
- **Neural Playground** — live single-neuron & tiny MLP visualizer with sliders
- Contact form (opens your email client)
- Fully responsive, no build step, no dependencies

## 📁 Structure
```
.
├── index.html      # page markup
├── styles.css      # all styles + themes
├── script.js       # interactions + playground
├── config.js       # <-- edit this to personalize
├── .nojekyll       # disables Jekyll on GitHub Pages
└── README.md
```

## 🛠️ Personalize
Open `config.js` and update `name`, `email`, `links`, `about`, `education`, `experience`, `skills`, `projects`, `funFacts`. That's the only file you need to touch for content.

## 🚀 Deploy to GitHub Pages (free)
1. Create a GitHub repo. For a user site at `https://<username>.github.io`, name it `<username>.github.io`. For a project site, any name works (served at `https://<username>.github.io/<repo>`).
2. Push this folder to the repo's `main` branch.
3. In the repo → **Settings → Pages → Source**: choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait ~1 minute. Your site is live. 🎉

> This site uses only relative paths and a `.nojekyll` file, so it works on both user and project pages without changes.

## 🧪 Run locally
**Easiest (macOS):** double-click `start.command` — it starts a local server and opens the site in your browser.

Or serve it manually:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

> Note: opening `index.html` directly via `file://` may not load fonts/styles reliably in some browsers. Using the local server (above) is recommended.

## 📝 License
MIT — feel free to fork and adapt.
