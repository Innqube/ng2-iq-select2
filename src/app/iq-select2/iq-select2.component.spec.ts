/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IqSelect2ResultsComponent } from '../iq-select2-results/iq-select2-results.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';

import { IqSelect2Component } from './iq-select2.component';

describe('IqSelect2Component', () => {
  let component: IqSelect2Component;
  let fixture: ComponentFixture<IqSelect2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IqSelect2Component, IqSelect2ResultsComponent],
      imports: [
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqSelect2Component);
    component = fixture.componentInstance;
    component.inputData = Observable.of([
      {
        'id': 1, 'text': 'Argentina', 'entity': {
          'id': 1,
          'name': 'Argentina',
          'money': 'ARS'
        }
      }, {
        'id': 2, 'text': 'Chile', 'entity': {
          'id': 2,
          'name': 'Chile',
          'money': 'CLP'
        }
      }, {
        'id': 3, 'text': 'Brazil', 'entity': {
          'id': 3,
          'name': 'Brazil',
          'money': 'BRL'
        }
      }
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
