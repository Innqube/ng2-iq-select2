"use strict";
const platform_browser_1 = require('@angular/platform-browser');
const core_1 = require('@angular/core');
const forms_1 = require('@angular/forms');
const http_1 = require('@angular/http');
const forms_2 = require('@angular/forms');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
const iq_select2_component_1 = require('./iq-select2/iq-select2.component');
const iq_select2_results_component_1 = require('./iq-select2-results/iq-select2-results.component');
const iq_select2_selected_component_1 = require('./iq-select2-selected/iq-select2-selected.component');
class IqSelect2Module {
}
IqSelect2Module.decorators = [
    { type: core_1.NgModule, args: [{
                declarations: [
                    iq_select2_component_1.IqSelect2Component,
                    iq_select2_results_component_1.IqSelect2ResultsComponent,
                    iq_select2_selected_component_1.IqSelect2SelectedComponent
                ],
                imports: [
                    platform_browser_1.BrowserModule,
                    forms_1.FormsModule,
                    http_1.HttpModule,
                    forms_2.ReactiveFormsModule
                ],
                exports: [
                    iq_select2_component_1.IqSelect2Component,
                    iq_select2_results_component_1.IqSelect2ResultsComponent,
                    iq_select2_selected_component_1.IqSelect2SelectedComponent
                ]
            },] },
];
IqSelect2Module.ctorParameters = [];
exports.IqSelect2Module = IqSelect2Module;
//# sourceMappingURL=iq-select2.module.js.map