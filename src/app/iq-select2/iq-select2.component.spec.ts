/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {IqSelect2ResultsComponent} from '../iq-select2-results/iq-select2-results.component';
import {ReactiveFormsModule} from '@angular/forms';
import {IqSelect2Component} from './iq-select2.component';
import {DataService} from '../data.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

describe('IqSelect2Component', () => {
    let component: IqSelect2Component;
    let fixture: ComponentFixture<IqSelect2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqSelect2Component, IqSelect2ResultsComponent],
            imports: [ReactiveFormsModule],
            providers: [DataService, MockBackend,
                BaseRequestOptions, {
                    provide: Http,
                    useFactory: (mockBackend, options) => {
                        return new Http(mockBackend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqSelect2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show results', inject([DataService], fakeAsync((service: DataService) => {
        component.dataSourceProvider = (term: string) => service.listData(term);
        component.term.setValue('arg');
        fixture.nativeElement.dispatchEvent(new Event('input'));
        tick(250);
        fixture.detectChanges();
        expect(component.resultsVisible).toBe(true);
    })));
});
