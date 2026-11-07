# GitHub Pages demo

This branch adds the GitHub Pages landing page for the all-rating web component.

- web-component.html is a responsive demo covering every theme, a 10-point scale, required validation, disabled and readonly states, live FormData output, and an attribute reference table.
- README.md is refreshed to point at both implementations, the new component demo and the original jQuery demo, and to record the published Pages URLs.

The component source (js/all-rating.js, js/rating-scale.js), the original jQuery plugin, and the tests are unchanged on this branch.

## Enabling Pages

In repository Settings, open Pages, choose "Deploy from a branch", select master and the root folder. The demo then appears at https://squidjam.github.io/allRating/web-component.html, alongside the original demo at https://squidjam.github.io/allRating/.

## Verification

- PASS: the demo page and refreshed README were generated and inspected as text; no component code changed, so the merged Node tests still apply.
- NOT RUN: no browser was available, so rendering, keyboard use, and accessibility were not checked visually. Load the page in a browser and try each control before relying on it, particularly the required validation message and the Reset button.

Keep this PR in draft until the page has been loaded in a browser.
