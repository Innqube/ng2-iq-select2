/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed, inject, fakeAsync, tick} from '@angular/core/testing';
import {IqSelect2ResultsComponent} from '../iq-select2-results/iq-select2-results.component';
import {ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import {IqSelect2Component} from './iq-select2.component';
import {DataService, Country} from '../data.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Component, ViewChild, OnInit} from '@angular/core';

describe('IqSelect2Component', () => {
    let component: IqSelect2Component<Country>;
    let fixture: ComponentFixture<IqSelect2Component<Country>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqSelect2Component, IqSelect2ResultsComponent, TestHostComponent],
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
                },]
        })
            .compileComponents();
    }));

    let adapter = function () {
        return (entity: any) => {
            return {
                id: entity.id,
                text: entity.name,
                entity: entity
            };
        };
    };

    beforeEach(inject([DataService], (service: DataService) => {
        fixture = TestBed.createComponent(IqSelect2Component);
        component = fixture.componentInstance;
        component.dataSourceProvider = (term: string) => service.listData(term);
        component.iqSelect2ItemAdapter = adapter();
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not show results at the beggining', () => {
        expect(component.resultsVisible).toBe(false);
    });

    it('should show results after entering text', fakeAsync((service: DataService) => {
        component.term.setValue('arg');
        tick(250);
        expect(component.resultsVisible).toBe(true);
    }));

    it('should focus input clicking on the container', () => {
        let ul = fixture.nativeElement.querySelector('.select2-container ul');
        let input = fixture.nativeElement.querySelector('input');
        ul.dispatchEvent(new Event('click'));
        expect(document.activeElement).toBe(input);
    });

    it('single mode with id reference should export only an id', () => {
        spyOn(component, 'onChangeCallback');

        component.multiple = false;
        component.referenceMode = 'id'
        component.onItemSelected({
            id: '1',
            text: 'etiqueta'
        })

        expect(component.onChangeCallback).toHaveBeenCalledWith('1');
    });

    it('multiple mode with id reference should export an array of ids', fakeAsync(() => {
        spyOn(component, 'onChangeCallback');

        component.multiple = true;
        component.referenceMode = 'id';
        component.term.setValue('arg');
        tick(250);

        component.onItemSelected({
            id: '8',
            text: 'Argentina'
        });

        tick(250);

        expect(component.onChangeCallback).toHaveBeenCalledWith(['8']);
    }));

    it('single mode with entity reference should export the entire entity', () => {
        spyOn(component, 'onChangeCallback');

        let entity = {
            id: '1',
            text: 'etiqueta',
            another: 'another'
        };

        component.multiple = false;
        component.referenceMode = 'entity';
        component.onItemSelected({
            id: '1',
            text: 'etiqueta',
            entity: entity
        })

        expect(component.onChangeCallback).toHaveBeenCalledWith(entity);
    });

    it('multiple mode with entity reference should export an array of entities', fakeAsync(() => {
        spyOn(component, 'onChangeCallback');

        let entity = {
            id: '1',
            text: 'etiqueta',
            another: 'another'
        };

        component.multiple = true;
        component.referenceMode = 'entity';
        component.term.setValue('arg');
        tick(250);

        component.onItemSelected({
            id: '1',
            text: 'etiqueta',
            entity: entity
        });

        tick(250);

        expect(component.onChangeCallback).toHaveBeenCalledWith([entity]);
    }));

    it('should add item when clicking on it', fakeAsync(() => {
        spyOn(component, 'onChangeCallback');

        component.term.setValue('arg');
        tick(250);
        fixture.detectChanges();

        let lis = fixture.nativeElement.querySelectorAll('.select2-result');
        lis[0].click();
        tick(250);

        expect(component.onChangeCallback).toHaveBeenCalledWith('16');
    }));

    it('should remove item when clicking on it', fakeAsync(() => {
        spyOn(component, 'onChangeCallback');

        component.multiple = false;
        component.referenceMode = 'id';
        component.onItemSelected({
            id: '1',
            text: 'etiqueta'
        })
        tick(250);
        expect(component.onChangeCallback).toHaveBeenCalledWith('1');
        fixture.detectChanges();

        fixture.nativeElement.querySelector('.select2-selection-remove').click();

        expect(component.onChangeCallback).toHaveBeenCalledWith(null);
    }));

    it('should not show the input if the component is disabled in single mode', fakeAsync(() => {
        component.multiple = false;
        component.disabled = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input')).toBeNull();
    }));

    it('should not show the input if the component is disabled in multiple mode', fakeAsync(() => {
        component.multiple = true;
        component.disabled = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input')).toBeNull();
    }));

    it('should not show the button to remove if the component is disabled in single mode', fakeAsync(() => {
        component.multiple = false;
        component.onItemSelected({
            id: '1',
            text: 'etiqueta'
        });
        component.disabled = true;
        fixture.detectChanges();
        tick(250);
        expect(fixture.nativeElement.querySelectorAll('.select2-selection-remove').length).toBe(0);
    }));

    it('should not show the button to remove if the component is disabled in multiple mode', fakeAsync(() => {
        component.multiple = true;
        component.term.setValue('arg');
        tick(250);

        component.onItemSelected({
            id: '8',
            text: 'Argentina'
        });
        component.disabled = true;
        fixture.detectChanges();
        tick(250);
        expect(fixture.nativeElement.querySelectorAll('.select2-selection-remove').length).toBe(0);
    }));

    it('should only make one request to service with minimumInputLength === 0', inject([DataService], fakeAsync((service: DataService) => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        parent.detectChanges();

        spyOn(hostComponent.childComponent, 'dataSourceProvider').and.returnValue({
            subscribe: () => {
            }
        });

        hostComponent.childComponent.ngAfterViewInit();

        hostComponent.childComponent.term.setValue('arg');
        tick(250);

        hostComponent.childComponent.term.setValue('arge');
        tick(250);

        expect(hostComponent.childComponent.dataSourceProvider).toHaveBeenCalledTimes(1);
    })));

    it('should not repeat same request', fakeAsync(() => {
        spyOn(component, 'dataSourceProvider').and.returnValue({
            subscribe: () => {
            }
        });

        component.term.setValue('arg');
        tick(250);

        component.term.setValue('arg');
        tick(250);

        expect(component.dataSourceProvider).toHaveBeenCalledTimes(1);
    }));

    it('should make another request after change', fakeAsync(() => {
        spyOn(component, 'dataSourceProvider').and.returnValue({
            subscribe: () => {
            }
        });
        ;

        component.term.setValue('arg');
        tick(250);

        component.term.setValue('arge');
        tick(250);

        expect(component.dataSourceProvider).toHaveBeenCalledTimes(2);
    }));

    it('should export selected values - referenceMode: id, single', inject([DataService], fakeAsync((service: DataService) => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'id';
        hostComponent.childComponent.multiple = false;
        parent.detectChanges();

        hostComponent.fg.patchValue({country: '8'});
        parent.detectChanges();
        tick(250);

        expect(JSON.stringify(hostComponent.fg.value)).toBe('{"country":"8"}');
    })));

    it('should export selected values - referenceMode: id, multiple', inject([DataService], fakeAsync((service: DataService) => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'id';
        hostComponent.childComponent.multiple = true;
        parent.detectChanges();

        hostComponent.fg.patchValue({country: ['8']});
        parent.detectChanges();
        tick(250);

        expect(JSON.stringify(hostComponent.fg.value)).toBe('{"country":["8"]}');
    })));

    it('should export selected values - referenceMode: entity, single', inject([DataService], fakeAsync((service: DataService) => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'entity';
        hostComponent.childComponent.multiple = false;
        parent.detectChanges();

        let item = {
            id: '8',
            text: 'Argentina',
            entity: {
                id: '8',
                name: 'Argentina',
                money: 'ARS'
            }
        };

        hostComponent.fg.patchValue({country: item});
        parent.detectChanges();
        tick(250);

        expect(JSON.stringify(hostComponent.fg.value)).toBe('{"country":' + JSON.stringify(item) + '}');
    })));

    it('should export selected values - referenceMode: entity, multiple', inject([DataService], fakeAsync((service: DataService) => {
        let parent = TestBed.createComponent(TestHostComponent);
        let hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'entity';
        hostComponent.childComponent.multiple = true;
        parent.detectChanges();

        let item = {
            id: '8',
            text: 'Argentina',
            entity: {
                id: '8',
                name: 'Argentina',
                money: 'ARS'
            }
        };

        hostComponent.fg.patchValue({country: [item]});
        parent.detectChanges();
        tick(250);

        expect(JSON.stringify(hostComponent.fg.value)).toBe('{"country":[' + JSON.stringify(item) + ']}');
    })));

    it('should hide input on disabled', fakeAsync(() => {
        expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
        component.disabled = true;
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input')).toBeFalsy();
    }));

    it('should hide input on disabled - ControlValueAccessor', fakeAsync(() => {
        component.setDisabledState(true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('input')).toBeFalsy();
    }));

    it('multiple mode with minimumInputLength 0 should not show the form default values in the initial dropdown',
            inject([DataService], fakeAsync((service: DataService) => {
        component.selectedProvider = (ids: string[]) => service.getItems(ids);
        component.minimumInputLength = 0;
        component.multiple = true;
        component.referenceMode = 'id';
        component.writeValue(['1']);
        component.ngAfterViewInit();
        expect(component.listData.find(x => x.id === '1')).toBeUndefined();
    })));

});

@Component({
    template: `
        <form [formGroup]="fg">
            <iq-select2 formControlName="country" [minimumInputLength]="0"></iq-select2>
        </form>
    `
})
class TestHostComponent implements OnInit {

    @ViewChild(IqSelect2Component)
    childComponent: IqSelect2Component<Country>;
    fg: FormGroup;

    constructor(private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.fg = this.formBuilder.group({
            country: null
        });
    }

}
