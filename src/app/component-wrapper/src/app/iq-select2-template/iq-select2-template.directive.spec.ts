/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {IqSelect2ResultsComponent} from '../iq-select2-results/iq-select2-results.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DataService} from '../../../../data.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Component, OnInit, ViewChild} from '@angular/core';
import {IqSelect2Component} from '../iq-select2/iq-select2.component';
import {IqSelect2TemplateDirective} from './iq-select2-template.directive';

describe('IqSelect2TemplateDirective', () => {
    let component: IqSelect2Component;
    let parentFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqSelect2Component, IqSelect2TemplateDirective, IqSelect2ResultsComponent, TestHostComponent],
            imports: [ReactiveFormsModule],
            providers: [
                DataService,
                MockBackend,
                BaseRequestOptions, {
                    provide: Http,
                    useFactory: (mockBackend, options) => {
                        return new Http(mockBackend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }]
        })
            .compileComponents();
    }));

    const adapter = function () {
        return (entity: any) => {
            return {
                id: entity.id,
                text: entity.name,
                entity: entity
            };
        };
    };

    beforeEach(inject([DataService], (service: DataService) => {
        parentFixture = TestBed.createComponent(TestHostComponent);
        const parentComponent = parentFixture.componentInstance;
        component = parentComponent.childComponent;
        component.dataSourceProvider = (term: string) => service.listData(term);
        component.iqSelect2ItemAdapter = adapter();
        parentFixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display custom result template', inject([DataService], fakeAsync(() => {
        component.searchFocused = true;
        component.term.setValue('tunisia');
        tick(250);
        parentFixture.detectChanges();
        const container: NodeSelector = parentFixture.nativeElement.querySelector('.select2-result.active');
        // query dom based on class from custom template
        expect(container.querySelector('.color').innerHTML).toBe('#fcd217');
        expect(container.querySelector('.code').innerHTML).toBe('TN');
    })));
});

@Component({
    template: `
        <form [formGroup]="fg">
            <iq-select2 [minimumInputLength]="0">
                <div *iq-select2-template="let item = $entity; let i = $index">
                    ({{i}}) <span class="code">{{item.code}}</span> - <span class="color">{{item.color}}</span>
                </div>
            </iq-select2>
        </form>
    `
})
class TestHostComponent implements OnInit {

    @ViewChild(IqSelect2Component)
    childComponent: IqSelect2Component;
    fg: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.fg = this.formBuilder.group({
            country: null
        });
    }
}
