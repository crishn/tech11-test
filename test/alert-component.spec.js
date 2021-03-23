import {AlertComponent} from '../src/alert-component.js';

describe('AlertComponent', () => {

    let component;

    beforeEach(() => {
        component = document.createElement('alert-component');
        document.body.appendChild(component);
    });

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('should instance correctly', () => {
        expect(component).toBeInstanceOf(AlertComponent);
    });

    it('should display on show()', () => {
        component.show();
        const alert = component.shadowRoot.querySelector('.alert');
        expect(alert.style.display).toBe('block');
        expect(alert.style.opacity).toBe('1');
    });

    it('should hide on hide()', (done) => {
        component.show();
        const closeListener = jasmine.createSpy();
        component.addCloseListener(closeListener);
        component.hide();
        expect(closeListener).toHaveBeenCalled();
        const alert = component.shadowRoot.querySelector('.alert');
        setTimeout(() => {
            expect(alert.style.display).toBe('none');
            expect(alert.style.opacity).toBe('0');
            done();
        }, 500);
    });

    it('should contain a title and code as JSON', () => {
        component.title = 'Title';
        component.code = {test: 'Test'};
        const title = component.shadowRoot.querySelector('#title');
        expect(title.textContent).toBe('Title');
        const code = component.shadowRoot.querySelector('#code');
        expect(code.textContent).toBe(JSON.stringify({test: 'Test'}));
    });

    it('should disappear on clicking close', () => {
        component.show();
        const closeListener = jasmine.createSpy();
        component.addCloseListener(closeListener)
        const closeButton = component.shadowRoot.querySelector('#close');
        closeButton.click();
        expect(closeListener).toHaveBeenCalled();
    });
});