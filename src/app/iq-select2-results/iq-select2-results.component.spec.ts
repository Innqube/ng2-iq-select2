/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IqSelect2ResultsComponent } from './iq-select2-results.component';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';

describe('IqSelect2ResultsComponent', () => {
  let component: IqSelect2ResultsComponent;
  let fixture: ComponentFixture<IqSelect2ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqSelect2ResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqSelect2ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
