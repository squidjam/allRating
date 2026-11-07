# GitHub Pages demo

This branch adds the GitHub Pages landing page for the all-rating web component.

- `web-component.html` is a responsive demo covering every theme, a 10-point scale, required validation, disabled and readonly states, live FormData output, and an attribute reference table.
- `README.md` is refreshed to cover both implementations, the published Pages URLs, and the new API notes.
- `package.json`, `CHANGELOG.md` and `.gitignore` are added so the project has a test script, a version, and a release record.
- `js/all-rating.js` and `tests/web-component.html` are updated: SVG icon masks replace the placeholder glyphs, the Clear button is labelled, the radiogroup keeps the accessible name, an optional `group` attribute syncs multiple controls with one name, and the original jQuery demo's insecure asset loading is replaced.

## Enabling Pages

In repository Settings, open Pages, choose "Deploy from a branch", then select master and the root folder. The demo appears at https://squidjam.github.io/allRating/web-component.html, alongside the original demo at https://squidjam.github.io/allRating/.

## Verification

- PASS: `node --check` on both component files, and `npm test` (4 normalization tests, 0 failures).
- NOT RUN by the author: no browser was available, so rendering, keyboard use and accessibility were not checked visually. The browser test page covers icon masks, themes, dimming, forms, events, validation, reset, grouping, readonly and keyboard; run it in a browser and confirm each control before releasing.

## Follow-up

The icon masks were repaired in a separate `fix/icons` branch after the first merge; see that pull request for the mask-source fix.
