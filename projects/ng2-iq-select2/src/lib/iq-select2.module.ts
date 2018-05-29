import {NgModule} from '@angular/core';
import {IqSelect2Component} from './iq-select2/iq-select2.component';
import {IqSelect2TemplateDirective} from './iq-select2-template/iq-select2-template.directive';
import {IqSelect2ResultsComponent} from './iq-select2-results/iq-select2-results.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  declarations: [
    IqSelect2Component,
    IqSelect2ResultsComponent,
    IqSelect2TemplateDirective
  ],
  exports: [
    IqSelect2Component,
    IqSelect2ResultsComponent,
    IqSelect2TemplateDirective
  ]
})
export class IqSelect2Module { }
