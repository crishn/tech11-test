import {html, render} from '../node_modules/lit-html/lit-html.js';

/**
 * Component for rendering a contract module by its attributes.
 */
export class ContractModuleComponent extends HTMLElement {

    /**
     * Gets the observed attributes of the component.
     * @returns {string[]} The attributes.
     */
    static get observedAttributes() {
        return ['key', 'name', 'comments'];
    };

    /**
     * Creates the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    /**
     * Callback function when the component is attached to DOM.
     * Renders the template.
     */
    connectedCallback() {
        this._update();
    }

    /**
     * Callback function when the component is removed from DOM.
     */
    disconnectedCallback() {
    }

    /**
     * Callback function when an observed attribute has changed.
     * @param name Name of the attribute.
     * @param oldValue Old value of the attribute.
     * @param newValue New value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'key':
            case 'name':
            case 'comments':
                this._update();
                break;
        }
    }

    /**
     * Gets the value of observed attribute `key`.
     * @returns {string|null} The value.
     * @private
     */
    get _key() {
        return this.hasAttribute('key') ? this.getAttribute('key') : null;
    }

    /**
     * Gets the value of observed attribute `name`.
     * @returns {string|null} The value.
     * @private
     */
    get _name() {
        return this.hasAttribute('name') ? this.getAttribute('name') : null;
    }

    /**
     * Gets the value of observed attribute `comments`.
     * @returns {string|null} The value.
     * @private
     */
    get _comments() {
        return this.hasAttribute('comments') ? this.getAttribute('comments') : null;
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
     * @returns {TemplateResult} The template.
     * @private
     */
    _template() {
        return html`
            <link href="./src/styles.css" rel="stylesheet"/>
            <section class="contract-part contract-module">
                <h3>${this._name}</h3>
                <form>
                    <label for="comments">Comments</label>
                    <textarea id="comments" required="required" .value="${this._comments}" @input="${this._handler}"></textarea>
                </form>
            </section>
        `;
    }

    /**
     * Handler for changes of a comments textarea.
     * Dispatches a `modelChange` event to notify listeners of a change.
     * @param event Textarea input event.
     * @private
     */
    _handler = (event) => {
        const updated = {key: this._key, name: this._name, comments: this._comments};
        updated.comments = event.target.value;
        this.dispatchEvent(new CustomEvent('modelChange', {detail: updated}));
        event.preventDefault();
        event.stopPropagation();
    };
}

customElements.define('contract-module-component', ContractModuleComponent);