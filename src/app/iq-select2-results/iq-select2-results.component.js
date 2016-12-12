"use strict";
const core_1 = require('@angular/core');
class IqSelect2ResultsComponent {
    constructor() {
        this.itemSelected = new core_1.EventEmitter();
        this.selectedIndex = 0;
    }
    ngOnInit() {
    }
    onItemSelected(item) {
        this.itemSelected.emit(item);
    }
    selectNext() {
        if (this.selectedIndex + 1 === this.items.length) {
            this.selectedIndex = 0;
        }
        else {
            this.selectedIndex++;
        }
    }
    selectPrevious() {
        if (this.selectedIndex - 1 < 0) {
            this.selectedIndex = this.items.length - 1;
        }
        else {
            this.selectedIndex--;
        }
    }
    selectCurrentItem() {
        this.onItemSelected(this.items[this.selectedIndex]);
        this.selectedIndex = 0;
    }
    onMouseOver(index) {
        this.selectedIndex = index;
    }
}
IqSelect2ResultsComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'iq-select2-results',
                templateUrl: './iq-select2-results.component.html',
                styleUrls: ['./iq-select2-results.component.css']
            },] },
];
IqSelect2ResultsComponent.ctorParameters = [];
IqSelect2ResultsComponent.propDecorators = {
    'items': [{ type: core_1.Input },],
    'searchFocused': [{ type: core_1.Input },],
    'itemSelected': [{ type: core_1.Output },],
};
exports.IqSelect2ResultsComponent = IqSelect2ResultsComponent;
//# sourceMappingURL=iq-select2-results.component.js.map