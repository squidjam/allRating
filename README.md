# allRating

A dependency-free, form-associated rating web component (version 1.0.0) with nothing else attached: no jQuery, no image sprites, no build step, no global CSS.

The [live demo](index.html) is the home page of this repository's GitHub Pages site and shows every theme and state.

## Usage

Serve the repository over HTTP (for example `npm run serve`, or `python3 -m http.server 8000`), then load the ES module. Because the component is an ES module, opening the page from the filesystem will not work — the demo needs an HTTP server:

```html
<script type="module" src="js/all-rating.js"></script>
<form>
  <label for="quality">Quality</label>
  <all-rating id="quality" name="quality" value="3" required></all-rating>
  <button>Submit</button>
</form>
```

No package installation, bundler, jQuery, image sprites, or external CSS is required. Deploy both js/all-rating.js and js/rating-scale.js. This implementation requires custom elements, Shadow DOM, and form-associated custom elements (ElementInternals); it does not include a legacy-browser fallback.

## API

- value: the default integer rating in markup, initially 0. The value property holds the live numeric value. Assigning the property is silent and does not change the reset default.
- max: integer from 1 to 100, default 5. Values are rounded and clamped to 0..max. Invalid scales fall back to 5.
- name: key used by native form submission and FormData. Zero is submitted as "0"; an unnamed control is not submitted.
- group: optional name shared by several controls that should behave as one radio group. Controls with the same group share a value, sync on change, and submit a single form entry.
- disabled: prevents editing and submission, including disabled parent fieldsets.
- readonly: prevents editing but preserves submission. The corresponding property is readOnly.
- required: a nonzero rating is required unless readonly.
- theme: star (default), tinystar, bar, or medal, drawn as inline SVG mask icons.
- labels: JSON array indexed by rating, including index 0 for the unrated label. Labels are always inserted as text, and a malformed value falls back to "N of max".
- aria-label: explicit accessible name; otherwise associated label text is used, with "Rating" as fallback.

Boolean attributes use normal HTML semantics: disabled="false" still means disabled. Use removeAttribute or set the property to false to enable a control. defaultValue controls the reset default. The form, validity, validationMessage, willValidate, checkValidity(), and reportValidity() APIs delegate to ElementInternals.

## Events and keyboard

User changes emit bubbling, composed input then change events. Read event.target.value and event.target.name. Programmatic updates, form reset, and state restoration do not emit change events. Use arrow keys to select (horizontal direction respects RTL), Home/End for the first/last rating, and Delete/Backspace to clear. Space/Enter activate the focused button. One radio is in the tab order, alongside a separate Clear button. Form reset restores the markup default; Clear explicitly sets 0.

```js
document.querySelector('all-rating').addEventListener('change', event => {
  console.log(event.target.name, event.target.value);
});
```

Network submission is left to the application. The component never posts ratings automatically.

## Styling

Set --rating-active, --rating-inactive, --rating-size, and --rating-gap on all-rating. The icon masks are exposed as --symbol-star and --symbol-medal if you want to swap the artwork. Shadow parts are control, rating, active, clear, and label. There is no global stylesheet or host-page reset.

## Tests

```sh
npm test
```

That runs the dependency-free normalization tests in tests/rating-scale.test.mjs, plus `npm run check` for syntax. Serve the repository and open tests/web-component.html in a browser supporting ElementInternals for the integration checks: forms, labels, events, validation, reset, grouping, disabled fieldsets, readonly, keyboard controls, icon rendering, custom labels, state restoration, and reconnection. It reports PASS/FAIL on the page and exposes window.testResults for automation. These browser tests must be run in a real browser; the Node suite does not test DOM behaviour. Also check Tab/Space/Enter, touch, screen readers, forced colors, and RTL by hand before releasing.

## Project files

- `js/all-rating.js`, `js/rating-scale.js`: the component.
- `index.html`: the demo, served as the site home page; `web-component.html`: a redirect to the home page.
- `tests/`: Node and browser tests.
- `CHANGELOG.md`, `LICENSE.web-component`, `package.json`.

## Attribution

Based on the original allRating concept and source by Dan Dunford, copyright 2011 Vantage Technologies. The original source carried MIT/GPL licensing notices; this rewrite is distributed under the MIT permission in that source, see LICENSE.web-component.
