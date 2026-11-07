# Changelog

## 1.0.0

First release of the all-rating web component, alongside the untouched jQuery plugin.

### Added

- `<all-rating>`: a form-associated custom element with native submission, FormData, required validation, reset, state restoration, disabled fieldsets and readonly support.
- Integer values from 0 to max (default 5), rounded and clamped.
- Themes: star (default), tinystar, bar and medal, drawn as inline SVG mask icons with no image requests.
- An optional `group` attribute so several controls with one name behave as a single radio group.
- CSS custom properties `--rating-active`, `--rating-inactive`, `--rating-size`, `--rating-gap`, plus shadow parts `control`, `rating`, `active`, `clear` and `label`.
- Radio-group keyboard support: arrow keys (RTL aware), Home, End, Delete/Backspace; one tab stop plus a labelled Clear button.
- Standard bubbling, composed `input` and `change` events.
- Demo pages: `web-component.html` for the component and the original `index.html` demos.

### Changed

- The original jQuery demo no longer loads its assets or ads over plain HTTP, so it renders on an HTTPS host.

### Known limitations

- Integer-only values; arbitrary select/radio option values are not supported.
- No automatic upgrade of existing `<select>` or radio markup.
- Requires Shadow DOM and `ElementInternals`; no legacy-browser fallback.
- No built-in network submission.
