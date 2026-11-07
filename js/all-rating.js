/**
 * allRating web component. Original project by Dan Dunford.
 * Copyright (c) 2011 http://vantage-technologies.co.uk/
 * Distributed under the MIT license; see LICENSE.web-component.
 */
import { normalizeMax, normalizeValue } from './rating-scale.js';

/** Inline SVG mask sources: keep the icons crisp and avoid image requests. */
const SYMBOL_SVG = {
  star: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12 1.6l3.3 6.7 7.4 1.1-5.4 5.2 1.3 7.4L12 18.5l-6.6 3.5 1.3-7.4L1.3 9.4l7.4-1.1z\"/></svg>",
  medal: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 1.5L10 9 8 12 5 4.5zm10 0L14 9l2 3 3-7.5zM12 9a6 6 0 100 12 6 6 0 000-12zm0 2.6l1.4 2.7 3 .5-2.2 2.1.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.1 3-.5z\"/></svg>"
};
const symbolUrl = svg => "url('data:image/svg+xml," + encodeURIComponent(svg) + "')";

const style = `
  :host { display: inline-block; --rating-active: #a66b00; --rating-inactive: #666;
    --rating-size: 2rem; --rating-gap: .15rem;
    --symbol-star: ${symbolUrl(SYMBOL_SVG.star)}; --symbol-medal: ${symbolUrl(SYMBOL_SVG.medal)}; }
  :host([hidden]) { display: none; }
  .choices { display: inline-flex; gap: var(--rating-gap); align-items: center; }
  button { font: inherit; color: var(--rating-inactive); background: transparent;
    border: 0; padding: .2rem; cursor: pointer; min-width: 2rem; min-height: 2rem; }
  button:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
  [role=radio] { font-size: var(--rating-size); line-height: 1; }
  [data-active] { color: var(--rating-active); }
  button:disabled, [aria-readonly=true] button { cursor: default; }
  [aria-disabled=true] { opacity: .5; }
  .symbol { display: block; background: currentColor;
    mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;
    mask-position: center; -webkit-mask-position: center;
    mask-size: contain; -webkit-mask-size: contain; }
  :host(:not([theme=tinystar])) [role=radio] .symbol { width: var(--rating-size); height: var(--rating-size); }
  [role=radio] .symbol { mask-image: var(--symbol-star); -webkit-mask-image: var(--symbol-star); }
  :host([theme=medal]) [role=radio] .symbol { mask-image: var(--symbol-medal); -webkit-mask-image: var(--symbol-medal); }
  :host([theme=tinystar]) [role=radio] .symbol { width: 1rem; height: 1rem; }
  :host([theme=bar]) [role=radio] .symbol { width: .7rem; height: 1.3rem;
    mask-image: none; -webkit-mask-image: none; }
  .clear { margin-left: .35rem; color: var(--rating-inactive); text-decoration: underline; }
  .status { display: block; font: .85rem/1.5 system-ui, sans-serif; }
  @media (forced-colors: active) {
    [data-active] { color: Highlight; }
    [aria-checked=true] { outline: 2px solid Highlight; }
    [role=radio] .symbol { background: CanvasText; }
    [data-active] .symbol { background: Highlight; }
  }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
`;

/** A form-associated, dependency-free integer rating control. */
export class AllRating extends HTMLElement {
  static formAssociated = true;
  static observedAttributes = ['value', 'max', 'name', 'disabled', 'readonly',
    'required', 'theme', 'labels', 'group'];

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this._value = 0;
    this._dirty = false;
    this._formDisabled = false;
    this._preview = null;
    this.shadowRoot.addEventListener('click', event => {
      const button = event.target.closest('button[data-value]');
      if (button) this._commit(Number(button.dataset.value));
    });
    this.shadowRoot.addEventListener('keydown', event => this._onKey(event));
    this.shadowRoot.addEventListener('pointerover', event => {
      const button = event.target.closest('[role=radio]');
      if (button && this._editable) {
        this._preview = Number(button.dataset.value);
        this._update();
      }
    });
    this.shadowRoot.addEventListener('pointerleave', () => {
      this._preview = null;
      this._update();
    });
  }

  connectedCallback() {
    // Preserve properties assigned before customElements.define() upgrades us.
    for (const key of ['value', 'max', 'name', 'disabled', 'readOnly', 'required']) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = this[key]; delete this[key]; this[key] = value;
      }
    }
    if (!this._dirty) this._value = normalizeValue(this.defaultValue, this.max);
    this._render();
  }

  attributeChangedCallback(name) {
    if (name === 'value' && !this._dirty) this._value = normalizeValue(this.defaultValue, this.max);
    if (name === 'max') this._value = normalizeValue(this._value, this.max);
    if (name === 'group' && this.group) this._syncGroup(this.group);
    this._preview = null;
    if (name === 'max' || !this.shadowRoot.firstChild) this._render();
    else this._update();
  }

  get value() { return this._value; }
  set value(value) {
    this._dirty = true;
    this._value = normalizeValue(value, this.max);
    this._preview = null;
    this._update();
  }
  get defaultValue() { return normalizeValue(this.getAttribute('value'), this.max); }
  set defaultValue(value) { this.setAttribute('value', String(value)); }
  get max() { return normalizeMax(this.getAttribute('max')); }
  set max(value) { this.setAttribute('max', String(value)); }
  get name() { return this.getAttribute('name') || ''; }
  set name(value) { this.setAttribute('name', value); }
  /** Optional shared name: controls with the same group behave as one radio group. */
  get group() { return this.getAttribute('group') || ''; }
  set group(value) { this.setAttribute('group', value); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(value) { this.toggleAttribute('disabled', Boolean(value)); }
  get readOnly() { return this.hasAttribute('readonly'); }
  set readOnly(value) { this.toggleAttribute('readonly', Boolean(value)); }
  get required() { return this.hasAttribute('required'); }
  set required(value) { this.toggleAttribute('required', Boolean(value)); }
  get form() { return this._internals.form; }
  get validity() { return this._internals.validity; }
  get validationMessage() { return this._internals.validationMessage; }
  get willValidate() { return this._internals.willValidate; }
  checkValidity() { return this._internals.checkValidity(); }
  reportValidity() { return this._internals.reportValidity(); }
  get _isDisabled() { return this.disabled || this._formDisabled; }
  get _editable() { return !this._isDisabled && !this.readOnly; }

  formDisabledCallback(disabled) { this._formDisabled = disabled; this._update(); }
  formResetCallback() {
    this._dirty = false;
    this._value = this.defaultValue;
    this._preview = null;
    this._update();
  }
  formStateRestoreCallback(state) { this.value = state; }
  focus(options) {
    this.shadowRoot.querySelector('[role=radio][tabindex="0"]')?.focus(options);
  }

  _render() {
    // Only static markup is inserted as HTML; labels are assigned via textContent.
    this.shadowRoot.innerHTML = '<style></style><div class="choices" part="control" role="radiogroup"></div><button type="button" class="clear" data-value="0" part="clear">Clear</button><span class="status" part="label"></span>';
    this.shadowRoot.querySelector('style').textContent = style;
    const group = this.shadowRoot.querySelector('.choices');
    for (let value = 1; value <= this.max; value++) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('role', 'radio');
      button.dataset.value = String(value);
      button.innerHTML = '<span class="symbol" aria-hidden="true"></span>';
      group.append(button);
    }
    this._update();
  }

  _label(value) {
    let labels;
    const raw = this.getAttribute('labels');
    try { labels = raw ? JSON.parse(raw) : []; } catch { labels = []; }
    return (Array.isArray(labels) && typeof labels[value] === 'string')
      ? labels[value] : value === 0 ? 'Not rated' : value + ' of ' + this.max;
  }

  _name() {
    return this.getAttribute('aria-label') ||
      Array.from(this._internals.labels || [], label => label.textContent.trim())
        .filter(Boolean).join(' ') || 'Rating';
  }

  _peers() {
    if (!this.group) return [];
    const scope = (this.getRootNode() || this);
    return Array.from(scope.querySelectorAll('all-rating'))
      .filter(peer => peer !== this && peer.group === this.group);
  }

  /** Mirror a change to every control sharing this group, without echoing events. */
  _syncGroup(group) {
    for (const peer of this._peers()) {
      peer.value = this.value;
      peer.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
      peer.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  _update() {
    const group = this.shadowRoot.querySelector('.choices');
    if (!group) return;
    const disabled = this._isDisabled;
    // The radiogroup carries the name, the buttons carry only their value.
    group.setAttribute('aria-label', this._name());
    group.setAttribute('aria-disabled', String(disabled));
    group.setAttribute('aria-readonly', String(this.readOnly));
    group.setAttribute('aria-required', String(this.required));
    const active = this._preview ?? this.value;
    for (const button of group.querySelectorAll('[role=radio]')) {
      const value = Number(button.dataset.value);
      button.disabled = disabled;
      button.tabIndex = !disabled && value === (this.value || 1) ? 0 : -1;
      button.setAttribute('aria-checked', String(value === this.value));
      button.setAttribute('aria-label', this._label(value));
      button.setAttribute('part', value <= active ? 'rating active' : 'rating');
      button.toggleAttribute('data-active', value <= active);
    }
    const clear = this.shadowRoot.querySelector('.clear');
    clear.disabled = !this._editable;
    clear.setAttribute('aria-label', 'Clear rating, currently ' + this._label(this.value));
    this.shadowRoot.querySelector('.status').textContent = this._label(active);
    this._internals.setFormValue(disabled ? null : String(this.value), String(this.value));
    const missing = this.required && !this.readOnly && this.value === 0;
    this._internals.setValidity(missing ? { valueMissing: true } : {},
      missing ? 'Please select a rating.' : '', group.querySelector('[role=radio]'));
  }

  _commit(value) {
    if (!this._editable || value === this.value) return;
    this.value = value;
    if (this.group) this._syncGroup(this.group);
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  _onKey(event) {
    if (!event.target.matches('[role=radio]') || !this._editable) return;
    const current = Number(event.target.dataset.value);
    const rtl = getComputedStyle(this).direction === 'rtl';
    let next;
    switch (event.key) {
      case 'ArrowRight': next = current + (rtl ? -1 : 1); break;
      case 'ArrowLeft': next = current + (rtl ? 1 : -1); break;
      case 'ArrowUp': next = current - 1; break;
      case 'ArrowDown': next = current + 1; break;
      case 'Home': next = 1; break;
      case 'End': next = this.max; break;
      case 'Delete': case 'Backspace': next = 0; break;
      default: return;
    }
    event.preventDefault();
    if (next > this.max) next = 1;
    if (next < 0 || (next === 0 && !['Delete', 'Backspace'].includes(event.key))) next = this.max;
    this._commit(next);
    this.focus();
  }
}

if (!customElements.get('all-rating')) customElements.define('all-rating', AllRating);
