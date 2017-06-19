import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { IqSelect2Component } from './iq-select2/iq-select2.component';
import { IqSelect2ResultsComponent } from './iq-select2-results/iq-select2-results.component';
import { CommonModule } from '@angular/common';
import { IqSelect2TemplateDirective } from './iq-select2-template/iq-select2-template.directive';

@NgModule({
  declarations: [
    IqSelect2Component,
    IqSelect2ResultsComponent,
    IqSelect2TemplateDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  exports: [
    IqSelect2Component,
    IqSelect2ResultsComponent,
    IqSelect2TemplateDirective
  ]
})
export class IqSelect2Module {
}
