import { OnInit, EventEmitter } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
export declare class IqSelect2ResultsComponent implements OnInit {
    private items;
    itemSelected: EventEmitter<any>;
    constructor();
    ngOnInit(): void;
    onItemSelected(item: IqSelect2Item): void;
}
