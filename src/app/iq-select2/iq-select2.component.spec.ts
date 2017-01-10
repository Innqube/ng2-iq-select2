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

    beforeEach(inject([DataService], (service: DataService) => {
        fixture = TestBed.createComponent(IqSelect2Component);
        component = fixture.componentInstance;
        component.dataSourceProvider = (term: string) => service.listData(term);
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
        spyOn(component, 'propagateChange');

        component.multiple = false;
        component.referenceMode = 'id';
        component.onItemSelected({
            id: '1',
            text: 'etiqueta'
        })

        expect(component.propagateChange).toHaveBeenCalledWith('1');
    });

    it('multiple mode with id reference should export an array of ids', fakeAsync(() => {
        spyOn(component, 'propagateChange');

        component.multiple = true;
        component.referenceMode = 'id';
        component.term.setValue('arg');
        tick(250);

        component.onItemSelected({
            id: '8',
            text: 'Argentina'
        });

        tick(250);

        expect(component.propagateChange).toHaveBeenCalledWith(['8']);
    }));

    it('single mode with entity reference should export the entire entity', () => {
        spyOn(component, 'propagateChange');

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

        expect(component.propagateChange).toHaveBeenCalledWith(entity);
    });

    it('multiple mode with entity reference should export an array of entities', fakeAsync(() => {
        spyOn(component, 'propagateChange');

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

        expect(component.propagateChange).toHaveBeenCalledWith([entity]);
    }));

    it('should add item when clicking on it', fakeAsync(() => {
        spyOn(component, 'propagateChange');

        component.term.setValue('arg');
        tick(250);
        fixture.detectChanges();

        let lis = fixture.nativeElement.querySelectorAll('.select2-result');
        lis[0].click();
        tick(250);

        expect(component.propagateChange).toHaveBeenCalledWith('8');
    }));

    it('should remove item when clicking on it', fakeAsync(() => {
        spyOn(component, 'propagateChange');

        component.multiple = false;
        component.referenceMode = 'id';
        component.onItemSelected({
            id: '1',
            text: 'etiqueta'
        })
        tick(250);
        expect(component.propagateChange).toHaveBeenCalledWith('1');
        fixture.detectChanges();

        fixture.nativeElement.querySelector('.select2-selection-remove').click();

        expect(component.propagateChange).toHaveBeenCalledWith(null);
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
        tick(250);
        fixture.detectChanges();
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

        tick(250);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.select2-selection-remove').length).toBe(0);
    }));
});
