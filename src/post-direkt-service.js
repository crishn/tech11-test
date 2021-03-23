/**
 * Service for querying address data via Postdirekt.
 */
export class PostDirektService {

    /**
     * Creates the service.
     */
    constructor() {
    }

    /**
     * Readonly base URL for service requests.
     * @returns {string}
     */
    get baseUrl() {
        return 'https://cors-anywhere.herokuapp.com/https://www.postdirekt.de/plzserver/PlzAjaxServlet';
    }

    /**
     * Gets cities by a given zip code.
     * @param zipCode {string} The zip code.
     * @returns {Promise<string[]>} Matching cities as unique list.
     */
    async getCities(zipCode) {
        const url = this._citiesRequestUrl(zipCode);
        return await this._cachedValidatedQuery(url, row => row.city);
    }

    /**
     * Gets streets by a given zip code and city.
     * @param zipCode {string} The zip code.
     * @param city {string} The city.
     * @returns {Promise<string[]>} Streets as unique list.
     */
    async getStreets(zipCode, city) {
        const url = this._streetsRequestUrl(zipCode, city);
        return await this._cachedValidatedQuery(url, row => row.street);
    }

    /**
     * Disposes the service (clears cache).
     */
    dispose() {
        window.sessionStorage.clear();
    }

    /**
     * Map function to filter query results.
     * @see Array.map
     * @callback filterResponse
     * @param value Current value (optional).
     * @param index Current index (optional).
     * @param array Array that is mapped (optional)
     */
    /**
     * Queries the service and validates the response.
     * In addition valid responses are cached to reduce service requests.
     * @param url {string} URL to query.
     * @param filterResponseFn {filterResponse} Callback function to filter the response.
     * @returns {Promise<string[]>} Filtered response as list.
     * @private
     */
    async _cachedValidatedQuery(url, filterResponseFn) {
        const cached = this._cached(url);
        if (cached) {
            return cached;
        }
        try {
            const json = await this._query(url);
            if (json.count > 0 && json.success === true) {
                const filtered = [...new Set(json.rows.map(filterResponseFn))];
                this._cache(url, filtered);
                return filtered;
            }
            return [];
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    /**
     * Creates a proper Postdirekt request URL for querying cities by given query parameters..
     * @param zipCode {string} The zip code to look for.
     * @param lang {string} The language to use. Optional, defaults to 'de_DE'.
     * @returns {string} The base url including query parameters.
     * @private
     */
    _citiesRequestUrl(zipCode, lang = 'de_DE') {
        const url = new URL(this.baseUrl);
        url.search = `finda=city&city=${zipCode}&lang=${lang}`;
        return url.toString();
    }

    /**
     * Creates a proper Postdirekt request URL for querying streets by given query parameters..
     * @param zipCode {string} The zip code to look for.
     * @param city {string} The city to look for.
     * @param lang {string} The language to use. Optional, defaults to 'de_DE'.
     * @returns {string} The base url including query parameters.
     * @private
     */
    _streetsRequestUrl(zipCode, city, lang = 'de_DE') {
        const url = new URL(this.baseUrl);
        url.search = `finda=streets&plz_plz=${zipCode}&plz_city=${city}&lang=${lang}`;
        return url.toString();
    }

    /**
     * Queries the Postdirekt service by a given URL.
     * @param url {string} The URL.
     * @returns {Promise<any>} Response as JSON.
     * @private
     */
    async _query(url) {
        try {
            const method = 'GET';
            const headers = new Headers();
            headers.append('Accept', 'application/json');
            const request = new Request(url, {method, headers});
            const response = await fetch(request);
            if (response.status === 200) {
                const content = await response.json();
                return content;
            }
            return Promise.reject(`${url} returned ${response.status} - "${response.statusText}".`);
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    }

    /**
     * Caches a value by its key (in session storage).
     * @param key {string} The key.
     * @param value {any} Value to cache.
     * @private
     */
    _cache(key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * Gets a cached value by its key.
     * @param key {string} The key.
     * @returns {any | null} The cached value.
     * @private
     */
    _cached(key) {
        const value = window.sessionStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
}
