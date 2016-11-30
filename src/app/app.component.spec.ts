/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IqSelect2Component } from './iq-select2/iq-select2.component';
import { IqSelect2ResultsComponent } from './iq-select2-results/iq-select2-results.component';
import { IqSelect2SelectedComponent } from './iq-select2-selected/iq-select2-selected.component';
import { DataService } from './data.service';
import { HttpModule } from '@angular/http';

describe('App: IqSelect2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, IqSelect2Component, IqSelect2ResultsComponent, IqSelect2SelectedComponent
      ],
      imports: [
        ReactiveFormsModule, HttpModule
      ],
      providers: [
        DataService
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
