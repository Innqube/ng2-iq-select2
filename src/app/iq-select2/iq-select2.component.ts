import { Component, OnInit, EventEmitter, Output, Input, forwardRef, ViewChild } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
import { IqSelect2ResultsComponent } from '../iq-select2-results/iq-select2-results.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

const SEARCH_DELAY = 150;
const KEY_CODE_DOWN_ARROW = 40;
const KEY_CODE_UP_ARROW = 38;
const KEY_CODE_ENTER = 13;

@Component({
  selector: 'iq-select2',
  templateUrl: './iq-select2.component.html',
  styleUrls: ['./iq-select2.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IqSelect2Component),
      multi: true
    }
  ]
})
export class IqSelect2Component implements OnInit, ControlValueAccessor {

  private selectedItems: IqSelect2Item[] = [];
  private term = new FormControl();
  @Output() private requestData = new EventEmitter();
  @Input() inputData: Observable<IqSelect2Item[]>;
  private listData: IqSelect2Item[];
  private searchFocused = false;
  @ViewChild('termInput')
  private termInput;
  @ViewChild('results')
  private results: IqSelect2ResultsComponent;
  private resultsVisible = false;
  propagateChange = (_: any) => { };

  constructor() { }

  ngOnInit() {
    this.term.valueChanges
      .debounceTime(SEARCH_DELAY)
      .distinctUntilChanged()
      .subscribe(term => {
        this.resultsVisible = term.length > 0;
        this.loadData(term);
      });

    this.inputData.subscribe((items: IqSelect2Item[]) => {
      this.listData = [];
      items.forEach(item => {
        if (!this.alreadySelected(item)) {
          this.listData.push(item);
        }
      });
    });
  }

  writeValue(value: any): void {

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(value: any): void {

  }

  alreadySelected(item: IqSelect2Item): boolean {
    let result = false;
    this.selectedItems.forEach(selectedItem => {
      if (selectedItem.id === item.id) {
        result = true;
      }
    });
    return result;
  }

  onItemSelected(item: IqSelect2Item) {
    this.selectedItems.push(item);

    let index = this.listData.indexOf(item, 0);

    if (index > -1) {
      this.listData.splice(index, 1);
    }

    this.propagateChange(this.getSelectedIds());
    this.term.patchValue('');
    this.termInput.nativeElement.focus();
    this.recalulateResultsVisibility();
  }

  recalulateResultsVisibility() {
    this.resultsVisible = this.termInput.nativeElement.value.length > 0;
  }

  getSelectedIds(): number[] {
    let ids: number[] = [];

    this.selectedItems.forEach(item => {
      ids.push(item.id);
    });

    return ids;
  }

  onItemRemoved(item: IqSelect2Item) {
    let index = this.selectedItems.indexOf(item, 0);

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }

    if (item.text.toUpperCase().indexOf(this.term.value.toUpperCase()) !== -1) {
      this.listData.push(item);
    }

    this.propagateChange(this.getSelectedIds());
  }

  loadData(pattern: string) {
    this.requestData.emit(pattern);
  }

  onFocus() {
    this.searchFocused = true;
  }

  onBlur() {
    this.recalulateResultsVisibility();
  }

  getInputWidth(): string {
    return this.term.value === null ? '0.75em' : (1 + this.term.value.length * .5) + 'em';
  }

  onKeyUp(ev) {
    if (ev.keyCode === KEY_CODE_DOWN_ARROW) {
      this.results.selectNext();
    } else if (ev.keyCode === KEY_CODE_UP_ARROW) {
      this.results.selectPrevious();
    } else if (ev.keyCode === KEY_CODE_ENTER) {
      this.results.selectCurrentItem();
      return false;
    }
  }
}
