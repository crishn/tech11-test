import {AddressComponent} from "../src/address-component.js";

describe('AddressComponent', () => {

    let component;

    beforeEach(() => {
        component = document.createElement('address-component');
        document.body.appendChild(component);
        const service = jasmine.createSpyObj('PostDirektService', ['getCities', 'getStreets', 'dispose']);
        service.getCities.and.returnValue(Promise.resolve(['Würzburg']));
        service.getStreets.and.returnValue(Promise.resolve(['Gneisenaustr.', 'Werner-von-Siemens-Str.']));
        component._service = service;
    });

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('should instance correctly', () => {
        expect(component).toBeInstanceOf(AddressComponent);
    });

    it('should prefill a city on entering a zip code', (done) => {
        const zip = component.shadowRoot.querySelector('#zip');
        zip.value = '97074';
        zip.dispatchEvent(new Event('input'));
        setTimeout(() => {
            expect(component._service.getCities).toHaveBeenCalled();
            const city = component.shadowRoot.querySelector('#city');
            expect(city.value).toBe('Würzburg');
            done();
        }, 1000);
    });

    it('should suggest streets on focussing', (done) => {
        const zip = component.shadowRoot.querySelector('#zip');
        zip.value = '97074';
        zip.dispatchEvent(new Event('input'));
        const city = component.shadowRoot.querySelector('#city');
        city.value = 'Würzburg';
        city.dispatchEvent(new Event('input'));
        const street = component.shadowRoot.querySelector('#street');
        street.focus();
        setTimeout(() => {
            expect(component._service.getStreets).toHaveBeenCalled();
            const streets = component.shadowRoot.querySelector('#streets');
            const options = streets.querySelectorAll('option');
            expect(options.length).toBeGreaterThan(0);
            done();
        }, 1000);
    });

    it('should have a representing state', () => {
        const zip = component.shadowRoot.querySelector('#zip');
        zip.value = '97074';
        zip.dispatchEvent(new Event('input'));
        const city = component.shadowRoot.querySelector('#city');
        city.value = 'Würzburg';
        city.dispatchEvent(new Event('input'));
        const street = component.shadowRoot.querySelector('#street');
        street.value = 'Gneisenaustr.';
        street.dispatchEvent(new Event('input'));
        const houseNumber = component.shadowRoot.querySelector('#houseNumber');
        houseNumber.value = '11';
        houseNumber.dispatchEvent(new Event('input'));
        expect(component.state).toEqual({
            zip: '97074',
            city: 'Würzburg',
            street: 'Gneisenaustr.',
            houseNumber: '11',
            country: 'de'
        });
    });

    it('should have an info button', () => {
        const zip = component.shadowRoot.querySelector('#zip');
        zip.value = '97074';
        zip.dispatchEvent(new Event('input'));
        const city = component.shadowRoot.querySelector('#city');
        city.value = 'Würzburg';
        city.dispatchEvent(new Event('input'));
        const street = component.shadowRoot.querySelector('#street');
        street.value = 'Gneisenaustr.';
        street.dispatchEvent(new Event('input'));
        const houseNumber = component.shadowRoot.querySelector('#houseNumber');
        houseNumber.value = '11';
        houseNumber.dispatchEvent(new Event('input'));
        const info = component.shadowRoot.querySelector('button');
        info.click();
        const alert = component.shadowRoot.querySelector('alert-component');
        expect(alert).toBeTruthy();
        const code = alert.shadowRoot.querySelector('#code');
        expect(code.innerText).toBe(JSON.stringify({
            zip: '97074',
            city: 'Würzburg',
            street: 'Gneisenaustr.',
            houseNumber: '11',
            country: 'de'
        }));
    });
});
