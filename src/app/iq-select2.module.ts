import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {IqSelect2Component} from './iq-select2/iq-select2.component';
import {IqSelect2ResultsComponent} from './iq-select2-results/iq-select2-results.component';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        IqSelect2Component,
        IqSelect2ResultsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule
    ],
    exports: [
        IqSelect2Component,
        IqSelect2ResultsComponent
    ]
})
export class IqSelect2Module {
}
