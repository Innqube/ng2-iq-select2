/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IqSelect2SelectedComponent } from './iq-select2-selected.component';

describe('IqSelect2SelectedComponent', () => {
  let component: IqSelect2SelectedComponent;
  let fixture: ComponentFixture<IqSelect2SelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IqSelect2SelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IqSelect2SelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
