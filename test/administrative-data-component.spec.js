import {AdministrativeDataComponent} from '../src/administrative-data-component.js';
import {AdministrativeData} from '../src/data-model.js';

describe('AdministrativeDataComponent', () => {

    let component;

    beforeEach(() => {
        component = document.createElement('administrative-data-component');
        document.body.appendChild(component);
    });

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('should instance correctly', () => {
        expect(component).toBeInstanceOf(AdministrativeDataComponent);
    });

    it('should handle entering a date', (done) => {
        const listener = (event) => {
            expect(event.detail).toBeInstanceOf(AdministrativeData);
            expect(event.detail.validFrom).toBe('2021-01-01');
            done();
        };
        component.addEventListener('modelChange', listener);
        const input = component.shadowRoot.querySelector('#validFrom');
        input.value = '2021-01-01';
        input.dispatchEvent(new Event('input'));
    });

    it('should render a date by its attribute', () => {
        component.setAttribute('valid-from', '2021-01-31');
        const input = component.shadowRoot.querySelector('#validFrom');
        expect(input.value).toBe('2021-01-31');
    });
});