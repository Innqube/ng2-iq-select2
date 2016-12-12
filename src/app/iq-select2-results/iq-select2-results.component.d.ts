import { OnInit, EventEmitter } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
export declare class IqSelect2ResultsComponent implements OnInit {
    items: IqSelect2Item[];
    searchFocused: boolean;
    itemSelected: EventEmitter<any>;
    private selectedIndex;
    constructor();
    ngOnInit(): void;
    onItemSelected(item: IqSelect2Item): void;
    selectNext(): void;
    selectPrevious(): void;
    selectCurrentItem(): void;
    onMouseOver(index: number): void;
}
