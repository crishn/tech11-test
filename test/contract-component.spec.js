import {ContractComponent} from '../src/contract-component.js';
import {DataModel} from '../src/data-model.js';
import {AdministrativeDataComponent} from '../src/administrative-data-component.js';
import {ContractModuleComponent} from '../src/contract-module-component.js';
import {DebugInfoComponent} from '../src/debug-info-component.js';

describe('ContractComponent', () => {

    let component;
    let model;

    beforeEach(() => {
        component = document.createElement('contract-component');
        document.body.appendChild(component);
        model = DataModel.initialModel;
    });

    afterEach(() => {
        document.body.removeChild(component);
        model = undefined;
    });

    it('should instance correctly', () => {
        expect(component).toBeInstanceOf(ContractComponent);
    });

    it('should render data model correctly', () => {
        component.model = model;
        const adminData = component.shadowRoot.querySelector('administrative-data-component');
        expect(adminData).toBeInstanceOf(AdministrativeDataComponent);
        expect(adminData.hasAttribute('valid-from')).toBe(true);
        const contractModules = component.shadowRoot.querySelectorAll('contract-module-component');
        expect(contractModules).toBeTruthy();
        expect(contractModules.length).toBe(2);
        const houseHold = contractModules[0];
        expect(houseHold).toBeInstanceOf(ContractModuleComponent);
        expect(houseHold.hasAttribute('key')).toBe(true);
        expect(houseHold.hasAttribute('name')).toBe(true);
        expect(houseHold.hasAttribute('comments')).toBe(true);
        const bicycle = contractModules[1];
        expect(bicycle).toBeTruthy();
        expect(bicycle.hasAttribute('key')).toBe(true);
        expect(bicycle.hasAttribute('name')).toBe(true);
        expect(bicycle.hasAttribute('comments')).toBe(true);
        const debugInfo = component.shadowRoot.querySelector('debug-info-component');
        expect(debugInfo).toBeInstanceOf(DebugInfoComponent);
        expect(debugInfo.model.debugInfo()).toEqual(model.debugInfo());
    });

    it('should update debug info', () => {
        component.model = model;
        const adminData = component.shadowRoot.querySelector('administrative-data-component');
        const validFrom = adminData.shadowRoot.querySelector('input');
        validFrom.value = '2021-05-01';
        validFrom.dispatchEvent(new Event('input'));
        const contractModules = component.shadowRoot.querySelectorAll('contract-module-component');
        const houseHoldComments = contractModules[0].shadowRoot.querySelector('textarea');
        const bicycleComments = contractModules[1].shadowRoot.querySelector('textarea');
        houseHoldComments.value = 'Just a test';
        houseHoldComments.dispatchEvent(new Event('input'));
        bicycleComments.value = 'Another test';
        bicycleComments.dispatchEvent(new Event('input'));
        const debugInfo = component.shadowRoot.querySelector('debug-info-component');
        const info = debugInfo.shadowRoot.querySelector('pre').innerText;
        expect(info).toMatch(/"2021-05-01"/);
        expect(info).toMatch(/"Just a test"/);
        expect(info).toMatch(/"Another test"/);
    });
});