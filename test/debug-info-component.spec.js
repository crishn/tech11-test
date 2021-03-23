import {DebugInfoComponent} from '../src/debug-info-component.js';
import {DataModel} from '../src/data-model.js';

describe('DebugInfoComponent', () => {

    let component;

    beforeEach(() => {
        component = document.createElement('debug-info-component');
        document.body.appendChild(component);
    });

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('should instance correctly', () => {
        expect(component).toBeInstanceOf(DebugInfoComponent);
    });

    it('should display debug information', () => {
        const model = DataModel.initialModel;
        component.model = model;
        const code = component.shadowRoot.querySelector('pre');
        expect(code.innerText).toBe(model.debugInfo());
    });

});