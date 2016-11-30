"use strict";
const core_1 = require('@angular/core');
const forms_1 = require('@angular/forms');
const SEARCH_DELAY = 150;
class IqSelect2Component {
    constructor() {
        this.selectedItems = [];
        this.term = new forms_1.FormControl();
        this.requestData = new core_1.EventEmitter();
        this.propagateChange = (_) => { };
    }
    ngOnInit() {
        this.term.valueChanges
            .debounceTime(SEARCH_DELAY)
            .distinctUntilChanged()
            .subscribe(term => this.loadData(term));
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
        this.selectedItems.push(item);
        var index = this.listData.indexOf(item, 0);
        if (index > -1) {
            this.listData.splice(index, 1);
        }
        this.propagateChange(this.getSelectedIds());
    }
    getSelectedIds() {
        let ids = [];
        this.selectedItems.forEach(item => {
            ids.push(item.id);
        });
        return ids;
    }
    onItemRemoved(item) {
        var index = this.selectedItems.indexOf(item, 0);
        if (index > -1) {
            this.selectedItems.splice(index, 1);
        }
        if (item.text.toUpperCase().indexOf(this.term.value.toUpperCase()) !== -1) {
            this.listData.push(item);
        }
        this.propagateChange(this.getSelectedIds());
    }
    loadData(pattern) {
        this.requestData.emit(pattern);
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
};
exports.IqSelect2Component = IqSelect2Component;
//# sourceMappingURL=iq-select2.component.js.map