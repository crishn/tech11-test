import {DataModel} from "./data-model.js";

export * from './data-model.js';
export {AdministrativeDataComponent} from './administrative-data-component.js';
export {ContractComponent} from './contract-component.js';
export {ContractModuleComponent} from './contract-module-component.js';
export {DebugInfoComponent} from './debug-info-component.js';

const contractComponent = document.querySelector('contract-component');
if (contractComponent) {
    contractComponent.model = DataModel.initialModel;
}