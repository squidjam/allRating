# allRating web component

A dependency-free rewrite of the original allRating jQuery plugin as a form-associated custom element. The original plugin and its demo remain unchanged. Open web-component.html for the new demo.

## Usage

Serve the repository over HTTP (for example: python3 -m http.server 8000), then load the ES module:

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
- disabled: prevents editing and submission, including disabled parent fieldsets.
- readonly: prevents editing but preserves submission. The corresponding property is readOnly.
- required: a nonzero rating is required unless readonly.
- theme: star (default), tinystar, bar, or medal. These are new CSS/text treatments, not pixel-identical versions of the original sprites.
- labels: JSON array indexed by rating, including index 0 for the unrated label. Labels are always inserted as text.
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

Set --rating-active, --rating-inactive, --rating-size, and --rating-gap on all-rating. Shadow parts are control, rating, active, clear, and label. There is no global stylesheet or host-page reset.

## Migration

Replace each select or radio group enhanced by .allRating() with an all-rating element, carrying over its name, selected numeric value, disabled state, and theme. Convert option descriptions into the labels array. Replace onClickEvent callbacks with standard change listeners. This initial component API supports integer scales rather than arbitrary select/radio option values, and does not automatically upgrade old inputs. Do not keep the old named input alongside the new component or the form will submit duplicate fields. Existing pages may continue to use the original plugin independently.

The old cancel action restored the initial selection; the new Clear action sets 0. Use form.reset() to restore defaults. There is no automatic AJAX submission, showHover setting, existingRatingOnEdit setting, or legacy CSS class configuration.

## Tests

Run dependency-free normalization tests with Node:

```sh
node --test tests/rating-scale.test.mjs
```

Serve the repository and open tests/web-component.html in a browser supporting ElementInternals to run integration checks for forms, labels, events, validation, reset, disabled fieldsets, readonly, keyboard controls, custom labels, state restoration, and reconnection. It displays PASS/FAIL and exposes window.testResults for browser automation. These browser tests must be run in a real browser; the Node suite does not test DOM behavior. Also manually check actual Tab/Space/Enter behavior, touch, focus visibility, screen readers, forced colors, and RTL before releasing.

## Attribution

Based on allRating by Dan Dunford, copyright 2011 Vantage Technologies. The original source includes MIT/GPL licensing notices. This rewrite is distributed under the MIT permission in that source; see LICENSE.web-component. Original source notices are retained in the untouched legacy files.
