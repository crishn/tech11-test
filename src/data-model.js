/**
 * Contract model.
 * @property {Map<string, ContractModule>} contractModules - Contract modules as map.
 * @property administrativeData {AdministrativeData}
 */
export class Contract {
    administrativeData;
    contractModules;

    /**
     * Creates the contract model.
     */
    constructor() {
        this.administrativeData = new AdministrativeData();
        this.contractModules = new Map();
    }

    /**
     * Sets a contract module.
     * @param contractModule {ContractModule} The contract module.
     */
    setContractModule(contractModule) {
        this.contractModules.set(contractModule.key, contractModule);
    }

    /**
     * Gets the contract modules.
     * @returns {ContractModule[]} The modules.
     */
    getContractModules() {
        return Array.from(this.contractModules).map(([_, value]) => value);
    }

    /**
     * Sets a valid from date for administrative data.
     * @param validFrom {string} The date as string.
     */
    setValidFrom(validFrom) {
        this.administrativeData.validFrom = validFrom;
    }
}

/**
 * Administrative data model.
 * @property {string} validFrom - Date since the contract is valid.
 */
export class AdministrativeData {
    validFrom;

    constructor() {
    }
}

/**
 * Contract module model.
 * @property {string} key Key for identifying the module.
 * @property {string} name Module name.
 * @property {string} comments Comments on the module.
 */
export class ContractModule {
    key;
    name;
    comments;

    constructor() {
    }
}

/**
 * Data model for second challenge.
 * @property contract {ContractModel} The contract.
 */
export class DataModel {

    contract;

    /**
     * Creates the data model.
     */
    constructor() {
        this.contract = new Contract();
    }

    /**
     * Gets debug information of the model.
     * @returns {string} The model as JSON representation.
     */
    debugInfo() {
        const replacer = (key, value) => {
            if (value instanceof Map) {
                const object = {};
                value.forEach((v, k) => {
                    object[k] = v;
                });
                return object;
            }
            return value;
        }
        return JSON.stringify(this, replacer, 2);
    }

    /**
     * Gets the data model as described in challenge two.
     * @returns {DataModel}
     */
    static get initialModel() {
        const contract = new Contract();
        contract.setValidFrom('2021-01-01');
        const houseHoldModule = new ContractModule();
        Object.assign(houseHoldModule, {
            key: 'HOUSEHOLD',
            name: 'Household Contents',
            comments: 'The flat of the policy holder is 100 square meters'
        })
        const bicycleModule = new ContractModule();
        Object.assign(bicycleModule, {
            key: 'BICYCLE',
            name: 'Bicycle',
            comments: 'The policyholder is happy to insure his new E-Bike also within the contract'
        })
        contract.setContractModule(houseHoldModule);
        contract.setContractModule(bicycleModule);
        const model = new DataModel();
        model.contract = contract;
        return model;
    }

}