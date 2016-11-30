"use strict";
const core_1 = require('@angular/core');
class IqSelect2SelectedComponent {
    constructor() {
        this.itemRemoved = new core_1.EventEmitter();
    }
    ngOnInit() {
    }
    onItemRemoved(item) {
        this.itemRemoved.emit(item);
    }
}
IqSelect2SelectedComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'iq-select2-selected',
                templateUrl: './iq-select2-selected.component.html',
                styleUrls: ['./iq-select2-selected.component.css']
            },] },
];
IqSelect2SelectedComponent.ctorParameters = [];
IqSelect2SelectedComponent.propDecorators = {
    'items': [{ type: core_1.Input },],
    'itemRemoved': [{ type: core_1.Output },],
};
exports.IqSelect2SelectedComponent = IqSelect2SelectedComponent;
//# sourceMappingURL=iq-select2-selected.component.js.map