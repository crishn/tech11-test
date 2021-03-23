import {html, render, TemplateResult} from '../node_modules/lit-html/lit-html.js';
import {PostDirektService} from './post-direkt-service.js';
import {AlertComponent} from "./alert-component.js";

/**
 * Address component. Defines a field set (as part of a form) to enter an address.
 * Prefills a city on a valid zip code and suggests streets based on zip code and city.
 */
export class AddressComponent extends HTMLElement {

    /**
     * Creates the component.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this._service = new PostDirektService();
    }

    /**
     * Web component callback when component is added to DOM.
     */
    connectedCallback() {
        render(this._template(), this.shadowRoot, {eventContext: this});
        this._zipListener = (event) => {
            const zip = event.target.value;
            if (zip && zip.match(/\d{5}/g)) {
                this._service.getCities(zip).then(cities => {
                    this._cities.textContent = '';
                    this._createDataListOptions(this._cities, cities);
                    this._city.value = cities.length > 0 ? cities[0] : null;
                });
            }
        }
        this._streetsListener = (event) => {
            const city = this._city.value
            const zip = this._zip.value;
            if (city && zip) {
                this._service.getStreets(zip, city).then(streets => {
                    this._createDataListOptions(this._streets, streets);
                });
            }
        }
        this._infoListener = (event) => {
            event.preventDefault();
            this._info.disabled = true;
            this._alert.title = 'Info';
            this._alert.code = this.state;
            this._alert.show();
        };
        this.closeListener = (event) => {
            this._info.disabled = false;
            event.preventDefault();
        }
        this._zip.addEventListener('input', this._zipListener);
        this._street.addEventListener('focus', this._streetsListener);
        this._info.addEventListener('click', this._infoListener);
        this._alert.addCloseListener(this.closeListener);
    }

    /**
     * Web component callback when component is removed from DOM.
     */
    disconnectedCallback() {
        this._zip.removeEventListener('input', this._zipListener);
        this._street.removeEventListener('focus', this._streetsListener);
        this._info.removeEventListener('click', this._infoListener);
        this._alert.removeCloseListener(this.closeListener);
        this._service.dispose();
    }

    /**
     * Gets the component state (representing the inout element values).
     * @returns {{zip: (null|string), country: (null|string), city: (null|string), street: (null|string), houseNumber: (null|string)}}
     */
    get state() {
        return {
            zip: this._validatedValue(this._zip),
            city: this._validatedValue(this._city),
            street: this._validatedValue(this._street),
            houseNumber: this._validatedValue(this._houseNumber),
            country: this._validatedValue(this._country)
        }
    }

    /**
     * Gets the zip code input field.
     * @returns {HTMLInputElement} The HTML input element.
     * @private
     */
    get _zip() {
        return this._query('#zip');
    }

    /**
     * Gets the city input field.
     * @returns {HTMLInputElement} The HTML input element.
     * @private
     */
    get _city() {
        return this._query('#city');
    }

    /**
     * Gets the data list element for cities.
     * @returns {HTMLDataListElement} The HTML data list element.
     * @private
     */
    get _cities() {
        return this._query('#cities');
    }

    /**
     * Gets the street input field.
     * @returns {HTMLInputElement} The HTML input element.
     * @private
     */
    get _street() {
        return this._query('#street');
    }

    /**
     * Gets the data list element for streets.
     * @returns {HTMLInputElement} The HTML data list element.
     * @private
     */
    get _streets() {
        return this._query('#streets');
    }

    /**
     * Gets the house number input field.
     * @returns {HTMLInputElement} The HTML input element.
     * @private
     */
    get _houseNumber() {
        return this._query('#houseNumber');
    }

    /**
     * Gets the country selection field.
     * @returns {HTMLSelectElement} The HTML select element.
     * @private
     */
    get _country() {
        return this._query('#country');
    }

    /**
     * Gets the value of an input element if valid, `null` otherwise.
     * @param input {HTMLInputElement}
     * @private
     */
    _validatedValue(input) {
        return input.checkValidity() ? input.value : null;
    }

    /**
     * Gets the info button.
     * @returns {HTMLButtonElement}
     * @private
     */
    get _info() {
        return this._query('#info');
    }

    /**
     * Gets the internal alert component.
     * @returns {AlertComponent}
     * @private
     */
    get _alert() {
        return this._query('alert-component');
    }

    /**
     * Queries a specific input field.
     * @param selector The selector to query for.
     * @returns {HTMLElement} The form element.
     * @private
     */
    _query(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    /**
     * Creates options for a data list.
     * @param parent {HTMLDataListElement} The data list.
     * @param list {string[]} List of options.
     * @private
     */
    _createDataListOptions(parent, list) {
        parent.textContent = '';
        for (const value of list) {
            const option = document.createElement('option');
            option.setAttribute('value', value);
            parent.appendChild(option);
        }
    }

    /**
     * Gets the template to render.
     * @returns {TemplateResult}
     * @private
     */
    _template() {
        return html`
            <link href="./src/styles.css" rel="stylesheet"/>
            <fieldset class="address">
                <legend class="title">Adresse</legend>
                <div class="form-group">
                    <div class="row">
                        <label for="zip">PLZ</label>
                        <input id="zip" class="input" type="text" pattern="[0-9]{5}" required="required"/>
                        <label for="city">Stadt</label>
                        <input id="city" list="cities" type="text" required="required"/>
                        <datalist id="cities"></datalist>
                    </div>
                    <div class="row">
                        <label for="street">Straße</label>
                        <input id="street" list="streets" type="text" required="required"/>
                        <datalist id="streets"></datalist>
                        <label for="houseNumber">Hausnummer</label>
                        <input id="houseNumber" type="text" required="required"/>
                    </div>
                    <div class="row">
                        <label for="country">Land</label>
                        <select id="country" required="required" disabled="disabled">
                            <option value="de" selected="selected">Deutschland</option>
                        </select>
                    </div>
                </div>
                <div class="info">
                    <alert-component></alert-component>
                    <button type="button" id="info">Info</button>
                </div>
            </fieldset>
        `;
    }
}

customElements.define('address-component', AddressComponent);

