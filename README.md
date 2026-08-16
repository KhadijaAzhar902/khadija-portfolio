# Khadija Azhar — Personal Portfolio

A custom dark-feminine, executive-tech portfolio built with **HTML5, CSS3 and vanilla JavaScript**. No framework, package manager or build step is required.

## Run locally

The simplest option is to open `index.html` in your browser.

For the most deployment-like local test, use VS Code **Live Server**, or run a tiny local server from this folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Folder structure

```text
khadija-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/
    │   └── khadija-portrait.png
    └── documents/
        └── Khadija-Azhar-CV.pdf
```

## Main customizations

### Change social links
Search `index.html` for:
- `github.com/KhadijaAzhar902`
- `linkedin.com/in/khadija-a-13b826409`

### Replace your photo
Replace `assets/images/khadija-portrait.png` while keeping the same filename, or update the image path in the hero portrait `<picture>` elements.

### Replace your CV
Replace `assets/documents/Khadija-Azhar-CV.pdf` and keep the same filename. The hero and navigation download buttons will continue to work automatically.

### Edit typewriter phrases
Open `script.js` and find the `phrases` array near the top.

### Edit colors
Open `style.css` and change the CSS variables inside `:root`, especially:
- `--bg`
- `--surface`
- `--plum`
- `--violet`
- `--violet-bright`
- `--violet-soft`
- `--champagne`

## Boss Mode interaction

The hero portrait uses the **same real photograph** in two visual layers. JavaScript tracks cursor position and CSS creates a local futuristic reveal with violet relighting, scanning lines, HUD geometry, grid effects and subtle 3D tilt. On touch devices, tap the portrait to toggle Boss Mode.

## Contact form

The contact form intentionally has no backend. Submitting it opens the visitor's default email client with a pre-filled draft addressed to `khadijaceo90@gmail.com`.

## Deployment

### Netlify
Drag this entire folder into Netlify's manual deploy area, or connect the GitHub repository containing these files. There is no build command.

### GitHub Pages
Push the folder contents to a repository, then enable **Settings → Pages → Deploy from a branch** and select your branch/root folder.

## Accessibility

The site respects `prefers-reduced-motion`, has keyboard support for the Boss Mode portrait, uses semantic sections and preserves visible focus states.
