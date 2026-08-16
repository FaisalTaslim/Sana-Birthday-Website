# Happy Birthday, Sana 🎂

A small, interactive birthday site. No build step, no framework —
just HTML/CSS/JS, so you can open the folder in VS Code and edit
directly. Open `index.html` in a browser (or use the VS Code "Live
Server" extension for auto-reload while you edit) to view it.

## Where everything lives

```
sana-birthday/
├── index.html                     ← page structure (sections, IDs)
├── css/
│   ├── variables.css              ← ⭐ colors, fonts, spacing tokens — re-theme from here
│   ├── base.css                   ← reset + global type + scroll-reveal utility
│   ├── nav-hero.css               ← nav bar + hero section + countdown
│   ├── envelope.css                ← the "open the letter" interaction
│   ├── notes-timeline-gallery.css  ← notes pinboard, memory timeline, photo gallery
│   └── cake-guestbook-footer.css   ← candles/wish, guestbook, footer, sound button
├── js/
│   ├── data.js                    ← ⭐ ALL personal content — start here
│   └── main.js                    ← behavior/interactions (shouldn't need much editing)
└── assets/
    ├── images/                    ← drop photo files here (see naming below)
    └── audio/                     ← optional — see "Using real music" below
```

## The one file you actually need to edit: `js/data.js`

Everything personal — the letter, the "notes I never said" cards,
the timeline captions, gallery captions, the birthday date, the
wish message — lives in this one file as a plain JS object. Open
it, replace the placeholder strings, save, refresh the page.

## Adding real photos

The gallery and memory timeline reference filenames like
`memory-01.jpg` and `gallery-01.jpg` inside `js/data.js`. Just
drop image files with those exact names into `assets/images/` —
the site automatically detects the file and swaps out the
placeholder frame for the real photo. No HTML/CSS editing needed.
Want more or fewer photos? Add/remove entries in the `timeline`
and `gallery` arrays in `data.js` — the layout adjusts on its own.

Recommended: JPGs around 1200px wide, roughly 4:3 for timeline
photos and square for gallery photos (they get cropped to fit via
`object-fit: cover`, so exact dimensions aren't critical).

## Using real music instead of the procedural chime

Right now the little sound-toggle button (bottom-right corner)
plays a short original tune generated in-browser via the Web Audio
API — no file needed. If you'd rather use a real audio file:

1. Drop an mp3 into `assets/audio/` (e.g. `theme.mp3`).
2. In `index.html`, add before `</body>`:
   `<audio id="bgAudio" src="assets/audio/theme.mp3" loop></audio>`
3. In `js/main.js`, inside `initSoundToggle()`, swap the call to
   `playChime()` for toggling `document.getElementById('bgAudio').play()`.

## Adjusting the design

All colors, fonts, spacing, and motion timing are tokens in
`css/variables.css`. Change `--color-amber` / `--color-coral` for
a different accent pairing, or the two `--font-*` values to swap
typefaces (update the Google Fonts `<link>` in `index.html` to
match).

## Notes on the sections

- **Hero** — headline + a live countdown to the date set in
  `birthdayISO`.
- **Letter** — click/tap the envelope to open a full birthday
  message.
- **Notes board** — the signature bit: short, specific lines,
  styled like pinned index cards. Keep these concrete and personal
  — specificity is what makes it not feel generic.
- **Memory lane** — a short timeline, photo + caption per entry.
- **Gallery** — a simple photo grid with a lightbox on click.
- **Make a wish** — click each candle to "blow it out"; once all
  are out, a message reveals with a confetti burst.
- **Guestbook** — a lightweight message board saved to
  `localStorage` in the visitor's browser (per-device, not shared
  across visitors unless you wire up a backend — fine for a single
  shared link opened on one device, e.g. handing Sana your phone).

Everything respects `prefers-reduced-motion` and is responsive
down to small phone widths.
