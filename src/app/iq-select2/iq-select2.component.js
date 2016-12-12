"use strict";
const core_1 = require('@angular/core');
const forms_1 = require('@angular/forms');
const SEARCH_DELAY = 150;
const KEY_CODE_DOWN_ARROW = 40;
const KEY_CODE_UP_ARROW = 38;
const KEY_CODE_ENTER = 13;
class IqSelect2Component {
    constructor() {
        this.requestData = new core_1.EventEmitter();
        this.referenceMode = 'id';
        this.multiple = false;
        this.selectedItems = [];
        this.term = new forms_1.FormControl();
        this.searchFocused = false;
        this.resultsVisible = false;
        this.propagateChange = (_) => { };
    }
    ngOnInit() {
        this.term.valueChanges
            .debounceTime(SEARCH_DELAY)
            .distinctUntilChanged()
            .subscribe(term => {
            this.resultsVisible = term.length > 0;
            this.loadData(term);
        });
        this.inputData.subscribe((items) => {
            this.listData = [];
            items.forEach(item => {
                if (!this.alreadySelected(item)) {
                    this.listData.push(item);
                }
            });
        });
    }
    writeValue(value) {
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(value) {
    }
    alreadySelected(item) {
        let result = false;
        this.selectedItems.forEach(selectedItem => {
            if (selectedItem.id === item.id) {
                result = true;
            }
        });
        return result;
    }
    onItemSelected(item) {
        if (this.multiple) {
            this.selectedItems.push(item);
            let index = this.listData.indexOf(item, 0);
            if (index > -1) {
                this.listData.splice(index, 1);
            }
        }
        else {
            this.selectedItems.length = 0;
            this.selectedItems.push(item);
        }
        this.propagateChange('id' === this.referenceMode ? this.getSelectedIds() : this.getEntities());
        this.term.patchValue('');
        this.recalulateResultsVisibility();
    }
    recalulateResultsVisibility() {
        this.resultsVisible = this.termInput.nativeElement.value.length > 0;
    }
    getSelectedIds() {
        if (this.multiple) {
            let ids = [];
            this.selectedItems.forEach(item => {
                ids.push(item.id);
            });
            return ids;
        }
        else {
            return this.selectedItems.length === 0 ? null : this.selectedItems[0].id;
        }
    }
    getEntities() {
        if (this.multiple) {
            let entities = [];
            this.selectedItems.forEach(item => {
                entities.push(item.entity);
            });
            return entities;
        }
        else {
            return this.selectedItems.length === 0 ? null : this.selectedItems[0].entity;
        }
    }
    onItemRemoved(item) {
        let index = this.selectedItems.indexOf(item, 0);
        if (index > -1) {
            this.selectedItems.splice(index, 1);
        }
        if (item.text.toUpperCase().indexOf(this.term.value.toUpperCase()) !== -1) {
            this.listData.push(item);
        }
        this.propagateChange('id' === this.referenceMode ? this.getSelectedIds() : this.getEntities());
    }
    loadData(pattern) {
        this.requestData.emit(pattern);
    }
    onFocus() {
        this.searchFocused = true;
    }
    onBlur() {
        this.recalulateResultsVisibility();
        this.term.patchValue('');
        this.searchFocused = false;
    }
    getInputWidth() {
        return this.term.value === null ? '0.75em' : (1 + this.term.value.length * .6) + 'em';
    }
    onKeyUp(ev) {
        if (this.results) {
            if (ev.keyCode === KEY_CODE_DOWN_ARROW) {
                this.results.selectNext();
            }
            else if (ev.keyCode === KEY_CODE_UP_ARROW) {
                this.results.selectPrevious();
            }
            else if (ev.keyCode === KEY_CODE_ENTER) {
                this.results.selectCurrentItem();
                return false;
            }
        }
    }
    focusInput() {
        if (this.multiple || this.selectedItems.length === 0) {
            this.termInput.nativeElement.focus();
        }
    }
}
IqSelect2Component.decorators = [
    { type: core_1.Component, args: [{
                selector: 'iq-select2',
                templateUrl: './iq-select2.component.html',
                styleUrls: ['./iq-select2.component.css'],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR,
                        useExisting: core_1.forwardRef(() => IqSelect2Component),
                        multi: true
                    }
                ]
            },] },
];
IqSelect2Component.ctorParameters = [];
IqSelect2Component.propDecorators = {
    'requestData': [{ type: core_1.Output },],
    'inputData': [{ type: core_1.Input },],
    'referenceMode': [{ type: core_1.Input },],
    'multiple': [{ type: core_1.Input },],
    'termInput': [{ type: core_1.ViewChild, args: ['termInput',] },],
    'results': [{ type: core_1.ViewChild, args: ['results',] },],
};
exports.IqSelect2Component = IqSelect2Component;
//# sourceMappingURL=iq-select2.component.js.map