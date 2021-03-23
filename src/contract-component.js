import {html, render, TemplateResult} from '../node_modules/lit-html/lit-html.js';
import {DataModel} from './data-model.js';

/**
 * Contract component. Renders a contract based on a given data model.
 */
export class ContractComponent extends HTMLElement {

    /**
     * Creates the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this._model = new DataModel();
    }

    /**
     * Callback function when component is attached to DOM.
     * Renders the template.
     */
    connectedCallback() {
        this._update();
    }

    /**
     * Callback function when component is removed from DOM.
     * Removes internal listeners.
     */
    disconnectedCallback() {
        const contractModules = this.shadowRoot.querySelectorAll('contract-module-component');
        contractModules.forEach(component => {
            component.removeEventListener('modelChange', this._contractModuleChangeHandler);
        });
        const administrativeData = this.shadowRoot.querySelector('administrative-data-component');
        if(administrativeData) {
            administrativeData.removeEventListener('modelChange', this._validFromChangeHandler);
        }
    }

    /**
     * Sets the data model for the contract to render.
     * @param model The data model.
     */
    set model(model) {
        this._model = model;
        this._update();
        this._updateDebugInfo();
    }

    /**
     * Gets the data model for the contract to render.
     * @returns {DataModel} The data model.
     */
    get model() {
        return this._model;
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
        const validFrom = this.model.contract.administrativeData.validFrom;
        const aHandler = this._validFromChangeHandler;
        const contractModules = this.model.contract.getContractModules();
        const mHandler = this._contractModuleChangeHandler;
        return html`
            <link href="./src/styles.css" rel="stylesheet"/>
            <div class="contract" id="contract">
                <administrative-data-component valid-from="${validFrom}" @modelChange="${aHandler}"></administrative-data-component>
                ${contractModules.map(c => html`
                    <contract-module-component key="${c.key}" name="${c.name}" comments="${c.comments}"
                                     @modelChange="${mHandler}"></contract-module-component>`)}
                <debug-info-component></debug-info-component>
            </div>
        `;
    }

    /**
     * Updates the model for component `debug-info-component`.
     * @private
     */
    _updateDebugInfo() {
        const debugInfo = this.shadowRoot.querySelector('debug-info-component');
        if(debugInfo) {
            debugInfo.model = this.model;
        }
    }

    /**
     * Listens on changes of an internal contract module component and updates the data model.
     * @param event Model change event from contract module component.
     * @private
     */
    _contractModuleChangeHandler = (event) => {
        const change = event.detail;
        this.model.contract.setContractModule(change);
        this._update();
        this._updateDebugInfo();
    };

    /**
     * Listens to changes the internal administrative data component and updates the data model.
     * @param event Model change event from administrative data component.
     * @private
     */
    _validFromChangeHandler = (event) => {
        const change = event.detail;
        this.model.contract.administrativeData = change;
        this._update();
        this._updateDebugInfo();
    };

}

customElements.define('contract-component', ContractComponent);