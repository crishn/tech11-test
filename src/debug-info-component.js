import {DataModel} from './data-model.js';
import {html, render} from '../node_modules/lit-html/lit-html.js';

/**
 * Component to display debug information.
 */
export class DebugInfoComponent extends HTMLElement{

    /**
     * Creates the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._model = new DataModel();
    }

    /**
     * Sets the data model to render the debug information for.
     * @param model {DataModel} The data model.
     */
    set model(model) {
        this._model = model;
        this._update();
    }

    /**
     * Gets the data model to render the debug information for.
     * @returns {DataModel} The data model.
     */
    get model() {
        return this._model;
    }

    /**
     * Callback function when the component is attached to DOM.
     * Renders the component.
     */
    connectedCallback() {
        this._update();
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
        const json = this.model.debugInfo();
        return html`
            <link href="./src/styles.css" rel="stylesheet"/>
            <section class="contract-part debug-info">
                <h3>Debug Info</h3>
                <pre>${json}</pre>
            </section>
        `;
    }
}

customElements.define('debug-info-component', DebugInfoComponent);