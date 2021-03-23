import {html, render} from '../node_modules/lit-html/lit-html.js';
import {AdministrativeData} from './data-model.js';

/**
 * Administrative data web component as part of contract component.
 * Renders a date field.
 */
export class AdministrativeDataComponent extends HTMLElement {

    /**
     * Gets the observed attributes of the component.
     * @returns {string[]} The observed attributes.
     */
    static get observedAttributes() {
        return ['valid-from'];
    }

    /**
     * Creates the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /**
     * Callback function when component is attached to DOM.
     */
    connectedCallback() {
        this._update();
    }

    /**
     * Callback function when component is detached from DOM.
     */
    disconnectedCallback() {
    }

    /**
     * Callback function when an observed attribute changes.
     * @param name Name of the attribute.
     * @param oldValue Old value of the attribute.
     * @param newValue New value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'valid-from':
                this._update();
                break;
        }
    }

    /**
     * Gets the attribute value for observed attribute `valid-from`.
     * @returns {string}
     * @private
     */
    get _validFrom() {
        return this.getAttribute('valid-from');
    }

    /**
     * Updates (re-renders) the component.
     * @private
     */
    _update() {
        render(this._template(), this.shadowRoot, {eventContext: this});
    }

    /**
     * Gets the template to render.
     * @returns {TemplateResult}
     * @private
     */
    _template() {
        return html`
            <link href="./src/styles.css" rel="stylesheet"/>
            <section class="contract-part administrative-data">
                <h3>Administrative data</h3>
                <form>
                    <label for="validFrom">Valid from</label>
                    <input id="validFrom" type="date" required="required" .value="${this._validFrom}"
                           @input="${this._inputHandler}"/>
                </form>
            </section>
        `;
    }

    /**
     * Input handler for entering a date.
     * Dispatches a `modelChange` event to inform listeners about a change.
     * @param event The input event.
     * @private
     */
    _inputHandler = (event) => {
        const updated = new AdministrativeData();
        updated.validFrom = event.target.value;
        this.dispatchEvent(new CustomEvent('modelChange', {detail: updated}));
        event.preventDefault();
        event.stopPropagation();
    };

}

customElements.define('administrative-data-component', AdministrativeDataComponent);