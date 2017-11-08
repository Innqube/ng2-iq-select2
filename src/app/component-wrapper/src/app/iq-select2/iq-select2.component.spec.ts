/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {IqSelect2ResultsComponent} from '../iq-select2-results/iq-select2-results.component';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {IqSelect2Component} from './iq-select2.component';
import {DataService} from '../../../../data.service';
import {BaseRequestOptions, Http} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

describe('IqSelect2Component', () => {
    let component: IqSelect2Component;
    let fixture: ComponentFixture<IqSelect2Component>;

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
                },
            ]
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

    it('should show results after entering text', fakeAsync(() => {
        component.searchFocused = true;
        component.term.setValue('arg');
        tick(250);
        expect(component.resultsVisible).toBe(true);
    }));

    it('should show results when clicking on caret (minimumInputLength === 0)', fakeAsync(() => {
        component.searchFocused = true;
        component.minimumInputLength = 0;
        fixture.detectChanges();
        fixture.nativeElement.querySelector('.caret').click();
        expect(component.resultsVisible).toBe(true);
    }));

    it('should not show results when clicking on caret (minimumInputLength !== 0)', fakeAsync(() => {
        component.searchFocused = true;
        component.minimumInputLength = 1;
        fixture.detectChanges();
        fixture.nativeElement.querySelector('.caret').click();
        expect(component.resultsVisible).toBe(false);
    }));

    it('should still show results after deleting text, when minimumInputLength === 0',
        inject([DataService], fakeAsync((service: DataService) => {
            const parent = TestBed.createComponent(TestHostComponent);
            const hostComponent: TestHostComponent = parent.componentInstance;
            hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
            hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
            parent.detectChanges();

            hostComponent.childComponent.ngAfterViewInit();
            hostComponent.childComponent.focusInput();

            hostComponent.childComponent.term.setValue('arg');
            tick(255);
            hostComponent.childComponent.term.setValue('');
            tick(255);
            expect(hostComponent.childComponent.resultsVisible).toBe(true);
        })));

    it('should not show results after blur',
        inject([DataService], fakeAsync((service: DataService) => {
            component.term.setValue('arg');
            tick(250);
            component.onBlur();
            expect(component.resultsVisible).toBe(false);
        })));

    it('should not show results when term.length < minimumInputLength', fakeAsync(() => {
        component.minimumInputLength = 4;
        component.term.setValue('arg');
        tick(250);
        expect(component.resultsVisible).toBeFalsy();
    }));

    it('should show results when term.length === minimumInputLength', fakeAsync(() => {
        component.minimumInputLength = 3;
        component.searchFocused = true;
        component.term.setValue('arg');
        tick(250);
        expect(component.resultsVisible).toBeTruthy();
    }));

    it('should show results when term.length > minimumInputLength', fakeAsync(() => {
        component.minimumInputLength = 2;
        component.searchFocused = true;
        component.term.setValue('arg');
        tick(250);
        expect(component.resultsVisible).toBeTruthy();
    }));

    it('should hide results after deleting text, when term.length < minimumInputLength', fakeAsync(() => {
        component.term.setValue('arg');
        tick(255);
        component.term.setValue('a');
        tick(255);
        expect(component.resultsVisible).toBeFalsy();
    }));

    it('should focus input clicking on the container', () => {
        const ul = fixture.nativeElement.querySelector('.select2-container ul');
        const input = fixture.nativeElement.querySelector('input');
        ul.dispatchEvent(new Event('click'));
        expect(document.activeElement).toBe(input);
    });

    it('single mode with id reference should export only an id', () => {
        spyOn(component, 'onChangeCallback');

        component.multiple = false;
        component.referenceMode = 'id';
        component.onItemSelected({
            id: '1',
            text: 'etiqueta'
        });

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

        const entity = {
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
        });

        expect(component.onChangeCallback).toHaveBeenCalledWith(entity);
    });

    it('multiple mode with entity reference should export an array of entities', fakeAsync(() => {
        spyOn(component, 'onChangeCallback');

        const entity = {
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

        component.searchFocused = true;
        component.term.setValue('arg');
        tick(250);
        fixture.detectChanges();

        const lis = fixture.nativeElement.querySelectorAll('.select2-result');
        lis[0].dispatchEvent(new Event('mousedown'));
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
        });
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

    it('should not repeat same request', fakeAsync(() => {
        spyOn(component, 'dataSourceProvider').and.returnValue(of({
            map: () => empty()
        }));

        component.term.setValue('arg');
        tick(250);

        component.term.setValue('arg');
        tick(250);

        expect(component.dataSourceProvider).toHaveBeenCalledTimes(1);
    }));

    it('should make another request after change', fakeAsync(() => {
        spyOn(component, 'dataSourceProvider').and.returnValue(of({
            map: () => empty()
        }));

        component.term.setValue('arg');
        tick(250);

        component.term.setValue('arge');
        tick(250);

        expect(component.dataSourceProvider).toHaveBeenCalledTimes(2);
    }));

    it('should not make a request if term.length < minimumInputLength', inject([DataService], fakeAsync((service: DataService) => {
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        parent.detectChanges();

        spyOn(hostComponent.childComponent, 'dataSourceProvider').and.returnValue({
            subscribe: () => {
            }
        });

        hostComponent.childComponent.minimumInputLength = 2;
        hostComponent.childComponent.ngAfterViewInit();

        hostComponent.childComponent.term.setValue('a');
        tick(250);

        expect(hostComponent.childComponent.dataSourceProvider).toHaveBeenCalledTimes(0);
    })));

    it('should export selected values - referenceMode: id, single', inject([DataService], fakeAsync((service: DataService) => {
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
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
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
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
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'entity';
        hostComponent.childComponent.multiple = false;
        parent.detectChanges();

        const item = {
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
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'entity';
        hostComponent.childComponent.multiple = true;
        parent.detectChanges();

        const item = {
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

    it('should show selected value on single mode',
        inject([DataService], fakeAsync((service: DataService) => {
            component.selectedProvider = (ids: string[]) => service.getItems(ids);
            component.minimumInputLength = 0;
            component.multiple = false;
            component.referenceMode = 'id';
            fixture.detectChanges();
            component.writeValue('1');
            component.focusInput();
            component.term.setValue('');
            tick(255);
            expect(component.listData.filter(item => item.id === '1').length).toBe(1);
        })));

    it('multiple mode with minimumInputLength 0 should not show the loaded values in the initial dropdown',
        inject([DataService], fakeAsync((service: DataService) => {
            component.selectedProvider = (ids: string[]) => service.getItems(ids);
            component.minimumInputLength = 0;
            component.multiple = true;
            component.referenceMode = 'id';
            fixture.detectChanges();
            component.writeValue(['1']);
            component.focusInput();
            component.term.setValue('');
            tick(255);
            expect(component.listData.filter(x => x.id === '1').length).toBe(0);
        })));

    it('should not load duplicate results - id referenceMode', inject([DataService], fakeAsync((service: DataService) => {
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'id';
        hostComponent.childComponent.multiple = true;
        parent.detectChanges();

        hostComponent.fg.patchValue({
            country: ['8', '8']
        });

        expect(hostComponent.childComponent.selectedItems.length).toBe(1);
    })));

    it('should not load duplicate results - entity referenceMode', inject([DataService], fakeAsync((service: DataService) => {
        const parent = TestBed.createComponent(TestHostComponent);
        const hostComponent: TestHostComponent = parent.componentInstance;
        hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
        hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
        hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
        hostComponent.childComponent.referenceMode = 'entity';
        hostComponent.childComponent.multiple = true;
        parent.detectChanges();

        hostComponent.fg.patchValue({
            country: [{
                id: '16',
                name: 'Argentina'
            }, {
                id: '16',
                name: 'Argentina'
            }]
        });

        expect(hostComponent.childComponent.selectedItems.length).toBe(1);
    })));

    it('should select focused item when tab key is pressed', () => {
        component.minimumInputLength = 0;
        component.resultsVisible = true;
        component.listData = [{
            id: '1',
            text: 'test'
        }];
        fixture.detectChanges();
        component.onKeyDown({keyCode: 9});
        expect(component.selectedItems.length).toBe(1);
    });

    it('should select next item when down arrow is pressed', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.resultsVisible = true;
        fixture.detectChanges();
        spyOn(component.results, 'activeNext');
        component.onKeyUp({keyCode: 40});
        tick(1);
        expect(component.results.activeNext).toHaveBeenCalled();
    }));

    it('should select previous item when up arrow is pressed', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.resultsVisible = true;
        fixture.detectChanges();
        spyOn(component.results, 'activePrevious');
        component.onKeyUp({keyCode: 38});
        tick(1);
        expect(component.results.activePrevious).toHaveBeenCalled();
    }));

    it('should select current item when enter is pressed', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.resultsVisible = true;
        fixture.detectChanges();
        spyOn(component.results, 'selectCurrentItem');
        component.onKeyUp({keyCode: 13});
        tick(1);
        expect(component.results.selectCurrentItem).toHaveBeenCalled();
    }));

    it('should focus input when enter is pressed with minimumInputLength === 0 and no results visible', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.resultsVisible = false;
        fixture.detectChanges();
        spyOn(component, 'focusInputAndShowResults');
        component.onKeyUp({keyCode: 13});
        tick(1);
        expect(component.focusInputAndShowResults).toHaveBeenCalled();
    }));

    it('should focus input when down arrow is pressed with minimumInputLength === 0 and no results visible', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.resultsVisible = false;
        fixture.detectChanges();
        spyOn(component, 'focusInputAndShowResults');
        component.onKeyUp({keyCode: 40});
        tick(1);
        expect(component.focusInputAndShowResults).toHaveBeenCalled();
    }));

    it('should delete selected item when delete is pressed', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.results = undefined;
        component.selectedItems = [{
            id: '1',
            text: 'test'
        }];
        fixture.detectChanges();
        spyOn(component, 'removeItem');
        component.onKeyDown({keyCode: 8});
        tick(1);
        expect(component.removeItem).toHaveBeenCalled();
    }));

    it('should not delete selected item when delete is pressed and there is text entered', () => {
        component.minimumInputLength = 0;
        component.results = undefined;
        component.selectedItems = [{
            id: '1',
            text: 'test'
        }];
        component.term.setValue('arg');
        fixture.detectChanges();
        spyOn(component, 'removeItem');
        component.onKeyDown({keyCode: 8});
        expect(component.removeItem).toHaveBeenCalledTimes(0);
    });

    it('should delete selected item when delete is pressed and remove it from the list of selected items', fakeAsync(() => {
        component.minimumInputLength = 0;
        component.ngAfterViewInit();
        component.selectedItems = [{
            id: '1',
            text: 'test'
        }];
        fixture.detectChanges();
        component.onKeyDown({keyCode: 8});
        tick(1);
        expect(component.selectedItems.length).toBe(0);
    }));

    it('should be able to set placeholder value with referenceMode === "id" and multiple === false',
        inject([DataService], (service: DataService) => {
            const parent = TestBed.createComponent(TestHostComponent);
            const hostComponent: TestHostComponent = parent.componentInstance;
            hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
            hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
            hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
            hostComponent.childComponent.referenceMode = 'id';
            hostComponent.childComponent.multiple = false;
            parent.detectChanges();

            hostComponent.fg.patchValue({
                country: '16'
            });
            hostComponent.childComponent.focus();
            parent.detectChanges();

            expect(parent.nativeElement.querySelector('input').placeholder).toBe('Argentina');
        }));

    it('should be able to set placeholder value with referenceMode === "entity" and multiple === false',
        inject([DataService], (service: DataService) => {
            const parent = TestBed.createComponent(TestHostComponent);
            const hostComponent: TestHostComponent = parent.componentInstance;
            hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
            hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
            hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
            hostComponent.childComponent.referenceMode = 'entity';
            hostComponent.childComponent.multiple = false;
            parent.detectChanges();

            hostComponent.fg.patchValue({
                country: {
                    id: '16',
                    name: 'Argentina',
                    code: 'AR',
                    color: '#c1ee5b'
                }
            });
            hostComponent.childComponent.focus();
            parent.detectChanges();

            expect(parent.nativeElement.querySelector('input').placeholder).toBe('Argentina');
        }));

    it('should not show moreResultsAvailable message if resultsCount is not set', () => {
        component.resultsVisible = true;
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelectorAll('span.results-msg');
        expect(mra.length).toBe(0);
    });

    it('should show moreResultsAvailable message if number of results < resultsCount', () => {
        component.resultsCount = 2;
        component.listData = [{
            id: '1',
            text: 'test'
        }];
        component.resultsVisible = true;
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelectorAll('span.results-msg');
        expect(mra.length).toBe(1);
    });

    it('should not show moreResultsAvailable message if results are not visible', () => {
        component.resultsVisible = false;
        component.resultsCount = 1;
        component.listData = [{
            id: '1',
            text: 'test'
        }, {
            id: '1',
            text: 'test'
        }];
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelectorAll('span.results-msg');
        expect(mra.length).toBe(0);
    });


    it('should not show moreResultsAvailable message if resultsShown = resultsCount', () => {
        component.resultsCount = 1;
        component.listData = [{
            id: '1',
            text: 'test'
        }];
        component.resultsVisible = true;
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelectorAll('span.results-msg');
        expect(mra.length).toBe(0);
    });

    it('should not show noResultsAvailable message when resultList.length >== 0', () => {
        component.listData = [{
            id: '1',
            text: 'test'
        }];
        component.resultsVisible = true;
        fixture.detectChanges();

        const nra = fixture.nativeElement.querySelectorAll('span.no-results-msg');
        expect(nra.length).toBe(0);
    });

    it('should show noResultsAvailable message when resultList.length === 0', () => {
        component.listData = [];
        component.resultsVisible = true;
        component.searchFocused = true;
        fixture.detectChanges();

        const nra = fixture.nativeElement.querySelectorAll('span.no-results-msg');
        expect(nra.length).toBe(1);
    });

    // https://github.com/Innqube/ng2-iq-select2/issues/27
    it('should delete selected items when multiple === true and resultsVisible',
        inject([DataService], fakeAsync((service: DataService) => {
            component.minimumInputLength = 0;
            component.selectedItems = [{id: '1', text: 'test'}];
            component.resultsVisible = true;
            fixture.detectChanges();
            component.onKeyDown({keyCode: 8});
            tick(1);
            expect(component.selectedItems.length).toBe(0);
        }))
    );

    it('should replace count variables with value', () => {
        component.resultsCount = 2;
        component.listData = [{id: '1', text: 'test'}];
        component.resultsVisible = true;
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelector('span.results-msg');
        expect(mra.innerHTML.trim()).toContain('Showing 1 of 2 results');
    });

    it('should not introduce variables value', () => {
        component.resultsCount = 2;
        component.listData = [{id: '1', text: 'test'}];
        component.resultsVisible = true;
        component.messages = {
            moreResultsAvailableMsg: 'Another message'
        };
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelector('span.results-msg');
        expect(mra.innerHTML.trim().indexOf('1')).toBe(-1);
        expect(mra.innerHTML.trim().indexOf('2')).toBe(-1);
    });

    it('should replace message', () => {
        component.resultsCount = 2;
        component.listData = [{id: '1', text: 'test'}];
        component.resultsVisible = true;
        component.messages = {
            moreResultsAvailableMsg: 'Another message'
        };
        fixture.detectChanges();

        const mra = fixture.nativeElement.querySelector('span.results-msg');
        expect(mra.innerHTML.trim()).toBe('Another message');
    });

    it('should not call dataProvider multiple times when clientMode === true', inject([DataService], fakeAsync((service) => {
        component.clientMode = true;

        spyOn(component, 'dataSourceProvider').and.returnValue(of([{
            id: '1',
            name: 'test'
        }]));

        component.term.setValue('arg');
        tick(250);

        component.term.setValue('arge');
        tick(250);

        expect(component.dataSourceProvider).toHaveBeenCalledTimes(1);
    })));

    it('should not exclude from results if value is previously selected and then selection is removed with clientMode === true and multiple === true', () => {
        const selectedItem = {
            id: '16',
            text: 'Argentina',
            entity: {
                id: '16',
                name: 'Argentina',
                code: 'AR',
                color: '#c1ee5b'
            }
        };
        component.minimumInputLength = 0;
        component.clientMode = true;
        component.multiple = true;
        component.selectedItems = [selectedItem];
        component.focusInputAndShowResults();
        fixture.detectChanges();

        component.removeItem(selectedItem);
        component.focusInputAndShowResults();
        fixture.detectChanges();

        expect(component.fullDataList.map(item => item.id).indexOf('16')).toBeGreaterThanOrEqual(0);
    });

    it('multiple mode with entity reference should only set the given values as selected, when writeValue ist called', () => {
        const itemToBeRemoved = {
            id: '1',
            name: 'item 1',
        };
        const itemToStay = {
            id: '2',
            name: 'item 2',
        };
        const itemToBeAdded = {
            id: '3',
            name: 'item 3',
        };

        const iqSelect2ItemAdapter = adapter();
        component.multiple = true;
        component.referenceMode = 'entity';
        component.iqSelect2ItemAdapter = iqSelect2ItemAdapter;
        component.selectedItems = [itemToBeRemoved, itemToStay].map(iqSelect2ItemAdapter);

        component.writeValue([itemToStay, itemToBeAdded]);

        expect(component.selectedItems.length).toBe(2);
        const selectedEntities = component.selectedItems.map(x => x.entity);
        expect(selectedEntities).toContain(itemToStay);
        expect(selectedEntities).toContain(itemToBeAdded);
    });

    it('should show the placeholder again after resetting the form',
        inject([DataService], (service: DataService) => {
            const parent = TestBed.createComponent(TestHostComponent);
            const hostComponent: TestHostComponent = parent.componentInstance;
            hostComponent.childComponent.multiple = false;
            hostComponent.childComponent.referenceMode = 'entity';
            hostComponent.childComponent.placeholder = 'This is the original placeholder';
            hostComponent.childComponent.minimumInputLength = 0;
            hostComponent.childComponent.dataSourceProvider = (term: string) => service.listData(term);
            hostComponent.childComponent.selectedProvider = (ids: string[]) => service.getItems(ids);
            hostComponent.childComponent.iqSelect2ItemAdapter = adapter();
            parent.detectChanges();

            hostComponent.fg.get('country').patchValue({
                id: '1',
                name: 'Tunisia',
                code: 'TN',
                color: '#fcd217'
            });
            parent.detectChanges();

            hostComponent.fg.reset();
            parent.detectChanges();

            const input = parent.nativeElement.querySelector('input');
            expect(input.classList.contains('hideable')).toBeFalsy();
        }));

    it('should include selected results when requesting new ones - no selection', fakeAsync(() => {
        component.searchFocused = true;
        component.term.setValue('arg');
        spyOn(component, 'dataSourceProvider').and.returnValue(empty());
        tick(250);
        expect(component.dataSourceProvider).toHaveBeenCalledWith('arg', null);
    }));

    it('should include selected results when requesting new ones - id selected - single', fakeAsync(() => {
        component.searchFocused = true;
        component.selectedItems = [{
            id: '1',
            text: 'Tunisia'
        }];
        component.term.setValue('arg');
        spyOn(component, 'dataSourceProvider').and.returnValue(empty());
        tick(250);
        expect(component.dataSourceProvider).toHaveBeenCalledWith('arg', '1');
    }));

    it('should include selected results when requesting new ones - id selected - multiple', fakeAsync(() => {
        component.multiple = true;
        fixture.detectChanges();
        component.searchFocused = true;
        component.selectedItems = [{
            id: '1',
            text: 'Tunisia'
        }];
        component.term.setValue('arg');
        spyOn(component, 'dataSourceProvider').and.returnValue(empty());
        tick(250);
        expect(component.dataSourceProvider).toHaveBeenCalledWith('arg', ['1']);
    }));

    it('should include selected results when requesting new ones - entity selected - single', fakeAsync(() => {
        component.referenceMode = 'entity';
        fixture.detectChanges();
        component.searchFocused = true;
        component.selectedItems = [{
            id: '1',
            text: 'Tunisia',
            entity: {
                id: '1',
                countryName: 'Tunisia'
            }
        }];
        component.term.setValue('arg');
        spyOn(component, 'dataSourceProvider').and.returnValue(empty());
        tick(250);
        expect(component.dataSourceProvider).toHaveBeenCalledWith('arg', {
            id: '1',
            countryName: 'Tunisia'
        });
    }));

    it('should include selected results when requesting new ones - entity selected - multiple', fakeAsync(() => {
        component.referenceMode = 'entity';
        component.multiple = true;
        fixture.detectChanges();
        component.searchFocused = true;
        component.selectedItems = [{
            id: '1',
            text: 'Tunisia',
            entity: {
                id: '1',
                countryName: 'Tunisia'
            }
        }];
        component.term.setValue('arg');
        spyOn(component, 'dataSourceProvider').and.returnValue(empty());
        tick(250);
        expect(component.dataSourceProvider).toHaveBeenCalledWith('arg', [{
            id: '1',
            countryName: 'Tunisia'
        }]);
    }));
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
