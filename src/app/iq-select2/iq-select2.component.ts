import { Component, OnInit, Input, forwardRef, ViewChild } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
import { IqSelect2ResultsComponent } from '../iq-select2-results/iq-select2-results.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

const KEY_CODE_DOWN_ARROW = 40;
const KEY_CODE_UP_ARROW = 38;
const KEY_CODE_ENTER = 13;
const VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IqSelect2Component),
  multi: true
};

@Component({
  selector: 'iq-select2',
  templateUrl: './iq-select2.component.html',
  styleUrls: ['./iq-select2.component.css'],
  providers: [VALUE_ACCESSOR]
})
export class IqSelect2Component implements OnInit, ControlValueAccessor {

  @Input() dataCallback: (term: string) => Observable<IqSelect2Item[]>;
  @Input() referenceMode: 'id' | 'entity' = 'id';
  @Input() multiple = false;
  @Input() searchDelay = 250;
  @ViewChild('termInput') private termInput;
  @ViewChild('results') private results: IqSelect2ResultsComponent;
  private listData: IqSelect2Item[];
  private selectedItems: IqSelect2Item[] = [];
  private term = new FormControl();
  private searchFocused = false;
  private resultsVisible = false;
  propagateChange = (_: any) => { };

  constructor() { }

  ngOnInit() {
    this.term.valueChanges
      .debounceTime(this.searchDelay)
      .distinctUntilChanged()
      .subscribe(term => {
        this.resultsVisible = term.length > 0;

        this.dataCallback.call(this.dataCallback, term).subscribe((items: IqSelect2Item[]) => {
          this.listData = [];
          items.forEach(item => {
            if (!this.alreadySelected(item)) {
              this.listData.push(item);
            }
          });
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
    if (this.multiple) {
      this.selectedItems.push(item);

      let index = this.listData.indexOf(item, 0);

      if (index > -1) {
        this.listData.splice(index, 1);
      }
    } else {
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

  getSelectedIds(): any {
    if (this.multiple) {
      let ids: string[] = [];

      this.selectedItems.forEach(item => {
        ids.push(item.id);
      });

      return ids;
    } else {
      return this.selectedItems.length === 0 ? null : this.selectedItems[0].id;
    }
  }

  getEntities(): any {
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

  onItemRemoved(item: IqSelect2Item) {
    let index = this.selectedItems.indexOf(item, 0);

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    }

    if (item.text.toUpperCase().indexOf(this.term.value.toUpperCase()) !== -1) {
      this.listData.push(item);
    }

    this.propagateChange('id' === this.referenceMode ? this.getSelectedIds() : this.getEntities());
  }

  onFocus() {
    this.searchFocused = true;
  }

  onBlur() {
    this.recalulateResultsVisibility();
    this.term.patchValue('');
    this.searchFocused = false;
  }

  getInputWidth(): string {
    return this.term.value === null ? '0.75em' : (1 + this.term.value.length * .6) + 'em';
  }

  onKeyUp(ev) {
    if (this.results) {
      if (ev.keyCode === KEY_CODE_DOWN_ARROW) {
        this.results.selectNext();
      } else if (ev.keyCode === KEY_CODE_UP_ARROW) {
        this.results.selectPrevious();
      } else if (ev.keyCode === KEY_CODE_ENTER) {
        this.results.selectCurrentItem();
      }
    }
  }

  focusInput() {
    if (this.multiple || this.selectedItems.length === 0) {
      this.termInput.nativeElement.focus();
    }
  }

  onKeyPress(ev) {
    if (ev.keyCode === KEY_CODE_ENTER) {
      ev.preventDefault();
    }
  }

}
