import {ContractModuleComponent} from '../src/contract-module-component.js';
import {DataModel} from '../src/data-model.js';

describe('ContractModuleComponent', () => {

    let component;
    let model;

    beforeEach(() => {
        component = document.createElement('contract-module-component');
        document.body.appendChild(component);
        model = DataModel.initialModel.contract.getContractModules()[0];
    });

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('should instance correctly', () => {
        expect(component).toBeInstanceOf(ContractModuleComponent);
    });

    it('should render a contract module by its attributes', () => {
        applyAttributes();
        const name = component.shadowRoot.querySelector('h3');
        expect(name.innerText).toBe(model.name);
        const comments = component.shadowRoot.querySelector('textarea');
        expect(comments.value).toBe(model.comments);
    });

    it('should update model on changing comments', (done) => {
        applyAttributes();
        const listener = (event) => {
            expect(event.detail).toEqual({
                key: model.key,
                name: model.name,
                comments: 'test'
            });
            done();
        };
        component.addEventListener('modelChange', listener);
        const comments = component.shadowRoot.querySelector('textarea');
        comments.value = 'test';
        comments.dispatchEvent(new Event('input'));
    });

    function applyAttributes() {
        component.setAttribute('key', model.key);
        component.setAttribute('name', model.name);
        component.setAttribute('comments', model.comments);
    }
});