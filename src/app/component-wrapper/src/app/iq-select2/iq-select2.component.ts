import {Component, EventEmitter, forwardRef, Input, Output, ViewChild, AfterViewInit} from '@angular/core';
import {IqSelect2Item} from './iq-select2-item';
import {IqSelect2ResultsComponent} from '../iq-select2-results/iq-select2-results.component';
import {FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Messages} from './messages';

const KEY_CODE_DOWN_ARROW = 40;
const KEY_CODE_UP_ARROW = 38;
const KEY_CODE_ENTER = 13;
const KEY_CODE_TAB = 9;
const KEY_CODE_DELETE = 8;
const VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IqSelect2Component),
    multi: true
};
const noop = () => {
};

@Component({
    selector: 'iq-select2',
    templateUrl: 'iq-select2.component.html',
    styleUrls: ['iq-select2.component.css'],
    providers: [VALUE_ACCESSOR]
})
export class IqSelect2Component<T> implements AfterViewInit, ControlValueAccessor {

    MORE_RESULTS_MSG = 'More results available. Refine your search to show them.';
    NO_RESULTS_MSG = 'No results available';

    @Input() dataSourceProvider: (term: string) => Observable<T[]>;
    @Input() selectedProvider: (ids: string[]) => Observable<T[]>;
    @Input() iqSelect2ItemAdapter: (entity: T) => IqSelect2Item;
    @Input() referenceMode: 'id' | 'entity' = 'id';
    @Input() multiple = false;
    @Input() searchDelay = 250;
    @Input() css: string;
    @Input() placeholder: string = '';
    @Input() minimumInputLength = 2; // Default value, at least two chars to start searching options
    @Input() disabled = false;
    @Input() remoteSearchIcon = 'glyphicon glyphicon-search';
    @Input() localSearchIcon = 'caret';
    @Input() deleteIcon = 'glyphicon glyphicon-remove';
    @Input() messages: Messages = {
        moreResultsAvailableMsg: this.MORE_RESULTS_MSG,
        noResultsAvailableMsg: this.NO_RESULTS_MSG
    };
    @Input() resultsCount;
    @Output() onSelect: EventEmitter<IqSelect2Item> = new EventEmitter<IqSelect2Item>();
    @Output() onRemove: EventEmitter<IqSelect2Item> = new EventEmitter<IqSelect2Item>();
    @ViewChild('termInput') private termInput;
    @ViewChild('results') results: IqSelect2ResultsComponent;
    term = new FormControl();
    resultsVisible = false;
    listData: IqSelect2Item[];
    selectedItems: IqSelect2Item[] = [];
    searchFocused = false;
    private fullListData: IqSelect2Item[];
    private forceVisibility = false;
    private placeholderSelected = '';
    private onTouchedCallback: () => void = noop;
    onChangeCallback: (_: any) => void = noop;

    constructor() {
    }

    ngAfterViewInit() {
        if (this.minimumInputLength === 0) {
            this.loadItemsAndSubscribeToChanges();
        } else {
            this.subscribeToChangesAndLoadDataFromObservable();
        }
    }

    private subscribeToChangesAndLoadDataFromObservable() {
        this.term.valueChanges
            .debounceTime(this.searchDelay)
            .distinctUntilChanged()
            .subscribe(term => {
                this.resultsVisible = term.length >= this.minimumInputLength;
                if (!this.resultsVisible) {
                    this.listData = [];
                    return;
                }

                this.dataSourceProvider(term).subscribe((items: T[]) => {
                    this.listData = [];
                    items.forEach(item => {
                        let iqSelect2Item = this.iqSelect2ItemAdapter(item);
                        if (!this.alreadySelected(iqSelect2Item)) {
                            this.listData.push(iqSelect2Item);
                        }
                    });
                });
            });
    }

    private loadItemsAndSubscribeToChanges() {
        this.dataSourceProvider('').subscribe((items: T[]) => {
            this.fullListData = [];
            this.listData = [];
            items.forEach((item: T) => {
                let iqSelect2Item = this.iqSelect2ItemAdapter(item);
                this.fullListData.push(iqSelect2Item);
                if (!this.alreadySelected(iqSelect2Item)) {
                    this.listData.push(iqSelect2Item);
                }
            });
        });

        this.term.valueChanges
            .debounceTime(this.searchDelay)
            .distinctUntilChanged()
            .subscribe(term => {
                this.resultsVisible = term.length > 0 ||
                    (this.searchFocused && this.forceVisibility && term.length >= this.minimumInputLength);
                this.filterData(this.term.value);
            });
    }

    filterData(filterText: string) {
        this.listData = [];
        this.fullListData.forEach(item => {
            let itemContainsTerm = item.text.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
            let singleMode = !this.multiple;
            let notSelected = !this.alreadySelected(item);

            if ((notSelected || singleMode) && itemContainsTerm) {
                this.listData.push(item);
            }
        });
    }

    writeValue(selectedValues: any): void {
        if (selectedValues) {
            if (this.referenceMode === 'id') {
                this.populateItemsFromIds(selectedValues);
            } else {
                this.populateItemsFromEntities(selectedValues);
            }
        } else {
            this.selectedItems = [];
        }
    }

    private populateItemsFromEntities(selectedValues: any) {
        if (this.multiple) {
            this.handleMultipleWithEntities(selectedValues);
        } else {
            let iqSelect2Item = this.iqSelect2ItemAdapter(selectedValues);
            this.selectedItems = [iqSelect2Item];
            this.placeholderSelected = iqSelect2Item.text;
        }
    }

    private handleMultipleWithEntities(selectedValues: any) {
        selectedValues.forEach((entity) => {
            let item = this.iqSelect2ItemAdapter(entity);
            let ids = this.getSelectedIds();

            if (ids.indexOf(item.id) === -1) {
                this.selectedItems.push(item)
            }
        });
    }

    private populateItemsFromIds(selectedValues: any) {
        if (this.multiple) {
            this.handleMultipleWithIds(selectedValues);
        } else {
            this.handleSingleWithId(selectedValues);
        }
    }

    private handleMultipleWithIds(selectedValues: any) {
        if (selectedValues !== undefined && this.selectedProvider !== undefined) {
            let uniqueIds = [];
            selectedValues.forEach((id) => {
                if (uniqueIds.indexOf(id) === -1) {
                    uniqueIds.push(id)
                }
            });

            this.selectedProvider(uniqueIds).subscribe((items: T[]) => {
                this.selectedItems = items.map(this.iqSelect2ItemAdapter);
            });
        }
    }

    private handleSingleWithId(id: any) {
        if (id !== undefined && this.selectedProvider !== undefined) {
            this.selectedProvider([id]).subscribe((items: T[]) => {
                items.forEach((item) => {
                    let iqSelect2Item = this.iqSelect2ItemAdapter(item);
                    this.selectedItems = [iqSelect2Item];
                    this.placeholderSelected = iqSelect2Item.text;
                });
            });
        }
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedCallback = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    private alreadySelected(item: IqSelect2Item): boolean {
        let result = false;
        this.selectedItems.forEach(selectedItem => {
            if (selectedItem.id === item.id) {
                result = true;
            }
        });
        return result;
    }

    onItemSelected(item: IqSelect2Item) {
        if (this.multiple) {
            this.selectedItems.push(item);

            if (this.minimumInputLength !== 0) {
                let index = this.listData.indexOf(item, 0);

                if (index > -1) {
                    this.listData.splice(index, 1);
                }
            } else {
                this.filterData('');
            }

        } else {
            this.selectedItems.length = 0;
            this.selectedItems.push(item);
        }

        this.onChangeCallback('id' === this.referenceMode ? this.getSelectedIds() : this.getEntities());
        this.term.patchValue('');
        this.focusInput(false);
        this.recalulateResultsVisibility();
        this.onSelect.emit(item);
        if (!this.multiple) {
            this.placeholderSelected = item.text;
        }
    }

    private recalulateResultsVisibility() {
        if (this.searchFocused && this.minimumInputLength === 0 && this.forceVisibility) {
            this.resultsVisible = true;
        } else if (this.termInput) {
            this.resultsVisible = this.termInput.nativeElement.value.length > 0;
        } else {
            this.resultsVisible = false;
        }
    }

    private getSelectedIds(): any {
        if (this.multiple) {
            let ids: string[] = [];

            this.selectedItems.forEach(item => ids.push(item.id));

            return ids;
        } else {
            return this.selectedItems.length === 0 ? null : this.selectedItems[0].id;
        }
    }

    private getEntities(): T[] {
        if (this.multiple) {
            let entities = [];

            this.selectedItems.forEach(item => {
                entities.push(item.entity);
            });

            return entities;
        } else {
            return this.selectedItems.length === 0 ? null : this.selectedItems[0].entity;
        }
    }

    removeItem(item: IqSelect2Item) {
        let index = this.selectedItems.indexOf(item, 0);

        if (index > -1) {
            this.selectedItems.splice(index, 1);
        }

        this.onChangeCallback('id' === this.referenceMode ? this.getSelectedIds() : this.getEntities());
        this.onRemove.emit(item);
        if (this.minimumInputLength === 0) {
            this.filterData('');
        }
        if (!this.multiple) {
            this.placeholderSelected = '';
        }
    }

    onFocus() {
        this.searchFocused = true;
        this.recalulateResultsVisibility();
    }

    onBlur() {
        this.term.patchValue('');
        this.searchFocused = false;
        this.forceVisibility = false;
        setTimeout(() => {
            this.recalulateResultsVisibility();
        }, 200);
        this.onTouchedCallback();
    }

    getInputWidth(): string {
        let searchEmpty = this.selectedItems.length === 0 && (this.term.value === null || this.term.value.length === 0);
        let length = this.term.value === null ? 0 : this.term.value.length;
        if (!this.multiple) {
            return '100%';
        } else {
            return searchEmpty ? '100%' : (1 + length * .6) + 'em';
        }
    }

    onKeyUp(ev) {
        if (this.results) {
            if (ev.keyCode === KEY_CODE_DOWN_ARROW) {
                this.results.activeNext();
            } else if (ev.keyCode === KEY_CODE_UP_ARROW) {
                this.results.activePrevious();
            } else if (ev.keyCode === KEY_CODE_ENTER) {
                this.results.selectCurrentItem();
            }
        } else {
            if (this.minimumInputLength === 0) {
                if (ev.keyCode === KEY_CODE_ENTER || ev.keyCode === KEY_CODE_DOWN_ARROW) {
                    this.focusInput(true);
                }
            }
        }
    }

    onKeyDown(ev) {
        if (this.results) {
            if (ev.keyCode === KEY_CODE_TAB) {
                this.results.selectCurrentItem();
            }
        } else {
            if (ev.keyCode === KEY_CODE_DELETE) {
                if ((!this.term.value || this.term.value.length === 0) && this.selectedItems.length > 0) {
                    this.removeItem(this.selectedItems[this.selectedItems.length - 1]);
                }
            }
        }
    }

    focusInput(visibility: boolean = null) {
        if (!this.disabled) {
            this.termInput.nativeElement.focus();
        }
        this.searchFocused = !this.disabled;
        if (this.minimumInputLength === 0 && !this.disabled) {
            this.searchFocused = !this.disabled;
            if (visibility !== null) {
                this.forceVisibility = visibility;
            } else {
                this.forceVisibility = !this.forceVisibility;
            }
        }
        this.recalulateResultsVisibility();
    }

    onKeyPress(ev) {
        if (ev.keyCode === KEY_CODE_ENTER) {
            ev.preventDefault();
        }
    }

    getCss(): string {
        return 'select2-selection-container ' + (this.css === undefined ? '' : this.css);
    }

    getMinHeight(): string {
        let isInputSm: boolean = this.css === undefined ? false : this.css.indexOf('input-sm') !== -1;
        return isInputSm ? '30px' : '34px';
    }

    getPlaceholder(): string {
        return this.selectedItems.length > 0 ? this.placeholderSelected : this.placeholder;
    }

    isHideable(): boolean {
        return !this.multiple && this.placeholderSelected !== '';
    }

    focus(): void {
        this.termInput.nativeElement.focus();
    }

}
