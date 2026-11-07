# Changelog

## 1.0.0

First release of the all-rating web component.

### Added

- `<all-rating>`: a form-associated custom element with native submission, FormData, required validation, reset, state restoration, disabled fieldsets and readonly support.
- Integer values from 0 to max (default 5), rounded and clamped.
- Themes: star (default), tinystar, bar and medal, drawn as inline SVG mask icons with no image requests.
- An optional `group` attribute so several controls with one name behave as a single radio group.
- CSS custom properties `--rating-active`, `--rating-inactive`, `--rating-size`, `--rating-gap`, and `--symbol-star` / `--symbol-medal` for custom artwork, plus shadow parts `control`, `rating`, `active`, `clear` and `label`.
- Radio-group keyboard support: arrow keys (RTL aware), Home, End, Delete/Backspace; one tab stop plus a labelled Clear button.
- Standard bubbling, composed `input` and `change` events.
- A demo served as the site home page.

### Removed

- The original jQuery plugin, its demo page, its stylesheets and its image sprites. The web component supersedes them and needs none of those files.

### Known limitations

- Integer-only values; arbitrary select/radio option values are not supported.
- No automatic upgrade of existing `<select>` or radio markup.
- Requires Shadow DOM and `ElementInternals`; no legacy-browser fallback.
- No built-in network submission.
