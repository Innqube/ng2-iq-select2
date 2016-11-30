import { OnInit, EventEmitter } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
export declare class IqSelect2SelectedComponent implements OnInit {
    private items;
    itemRemoved: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    onItemRemoved(item: IqSelect2Item): void;
}
