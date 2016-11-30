import { OnInit } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
import { ControlValueAccessor } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
export declare class IqSelect2Component implements OnInit, ControlValueAccessor {
    private selectedItems;
    private term;
    private requestData;
    inputData: Observable<IqSelect2Item[]>;
    private listData;
    propagateChange: (_: any) => void;
    constructor();
    ngOnInit(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(value: any): void;
    alreadySelected(item: IqSelect2Item): boolean;
    onItemSelected(item: IqSelect2Item): void;
    getSelectedIds(): number[];
    onItemRemoved(item: IqSelect2Item): void;
    loadData(pattern: string): void;
}
