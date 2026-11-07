# GitHub Pages

The repository is served as a static site from the master branch root:

- The home page is the web component demo.
- `tests/web-component.html` reports the browser integration test results on the page itself.

## Enabling Pages

In repository Settings, open Pages, choose "Deploy from a branch", then select master and the root folder.

## Verification

- PASS: the component source and every style rule were read back from master after merging, including the icon mask rules and the `group` support.
- PASS: `node --test tests/rating-scale.test.mjs` (4 tests, 0 failures) and `node --check` on both component files.
- NOT RUN: no browser was available, so rendering, keyboard use and accessibility were not checked visually. Run `tests/web-component.html` in a browser before releasing.
