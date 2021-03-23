import {html, render} from '../node_modules/lit-html/lit-html.js';

/**
 * Web component for displaying an alert.
 * An alert might have a title and a code (formatted as JSON).
 */
export class AlertComponent extends HTMLElement {

    /**
     * Creates the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._closeButtonListener = (event) => {
            this.hide();
            event.preventDefault();
        };
        this._closeEvent = document.createEvent('Event');
        this._closeEvent.initEvent('close', true, true);
    }

    /**
     * Callback function when component is attached to DOM.
     */
    connectedCallback() {
        render(this._template(), this.shadowRoot, {eventContext: this});
        this._closeButton.addEventListener('click', this._closeButtonListener);
    }

    /**
     * Callback function when component is detached from DOM.
     * Renders the alert.
     */
    disconnectedCallBack() {
        this._closeButton.removeEventListener('click', this._closeButtonListener);
    }

    /**
     * Sets a title for the alert.
     * @param title Title to set.
     */
    set title(title) {
        this.shadowRoot.querySelector('#title').textContent = title;
    }

    /**
     * Gets the title of the alert.
     * @returns {string} The title.
     */
    get title() {
        return this.shadowRoot.querySelector('#title').textContent.trim();
    }

    /**
     * Sets a code for the alert.
     * @param code {any}
     */
    set code(code) {
        this.shadowRoot.querySelector('#code').textContent = JSON.stringify(code);
    }

    /**
     * Gets the code of the alert.
     * @returns {any}
     */
    get code() {
        const text = this.shadowRoot.querySelector('#code').textContent.trim();
        return JSON.parse(text);
    }

    /**
     * Adds a close listener that is notified when the alert is closed.
     * @param listener The listener to add.
     */
    addCloseListener(listener) {
        this.shadowRoot.addEventListener('close', listener);;
    }

    /**
     * Removes a close listener.
     * @param listener The listener to remove.
     */
    removeCloseListener(listener) {
        this.shadowRoot.removeEventListener('close', listener);
    }

    /**
     * Shows the alert.
     */
    show() {
        const alert = this.shadowRoot.querySelector('.alert');
        alert.style.display = 'block';
        alert.style.opacity = '1';
    }

    /**
     * Hides the alert.
     */
    hide() {
        this.shadowRoot.dispatchEvent(this._closeEvent);
        const alert = this.shadowRoot.querySelector('.alert');
        alert.style.opacity = '0';
        setTimeout(() => alert.style.display = 'none', 500);
    }

    /**
     * Gets the internal close button.
     * @returns {HTMLButtonElement} The close button.
     * @private
     */
    get _closeButton() {
        return this.shadowRoot.querySelector('#close');
    }

    /**
     * Gets the template to render.
     * @returns {TemplateResult} The template.
     * @private
     */
    _template() {
        return html`
            <link href="./src/styles.css" rel="stylesheet">
            <div class="alert" role="alert" style="display: none">
                <strong id="title"></strong>
                <code class="data" id="code"></code>
                <button type="button" class="close" id="close" aria-label="Schließen" title="Schließen">&times;</button>
            </div>
        `
    }
}

customElements.define('alert-component', AlertComponent);