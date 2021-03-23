import {DataModel} from '../src/data-model.js';

describe('DataModel', () => {

    let model;

    beforeEach(() => {
        model = DataModel.initialModel;
    });

    it('should return initial data model correctly', () => {
        const reference = JSON.stringify({
            contract: {
                administrativeData: {
                    validFrom: '2021-01-01',
                }, contractModules: {
                    HOUSEHOLD: {
                        key: 'HOUSEHOLD',
                        name: 'Household Contents',
                        comments: 'The flat of the policy holder is 100 square meters'
                    }, BICYCLE: {
                        key: 'BICYCLE',
                        name: 'Bicycle',
                        comments: 'The policyholder is happy to insure his new E-Bike also within the contract'
                    }
                }
            }
        }, null, 2);
        expect(model.debugInfo()).toBe(reference);
    });

    it('should return contract modules', () => {
        const modules = model.contract.getContractModules();
        expect(modules).toBeTruthy();
        expect(modules.length).toBe(2);
        const household = modules[0];
        const bicycle = modules[1];
        expect(household.key).toBe('HOUSEHOLD');
        expect(household.name).toBe('Household Contents');
        expect(household.comments).toBe('The flat of the policy holder is 100 square meters');
        expect(bicycle.key).toBe('BICYCLE');
        expect(bicycle.name).toBe('Bicycle');
        expect(bicycle.comments).toBe('The policyholder is happy to insure his new E-Bike also within the contract');
    });
});