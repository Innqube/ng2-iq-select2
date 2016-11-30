import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { IqSelect2Component } from './iq-select2/iq-select2.component';
import { IqSelect2ResultsComponent } from './iq-select2-results/iq-select2-results.component';
import { IqSelect2SelectedComponent } from './iq-select2-selected/iq-select2-selected.component';

@NgModule({
  declarations: [
    IqSelect2Component,
    IqSelect2ResultsComponent,
    IqSelect2SelectedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  exports: [
    IqSelect2Component,
    IqSelect2ResultsComponent,
    IqSelect2SelectedComponent
  ]
})
export class IqSelect2Module { }
