import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';

@Component({
  selector: 'iq-select2-results',
  templateUrl: './iq-select2-results.component.html',
  styleUrls: ['./iq-select2-results.component.css']
})
export class IqSelect2ResultsComponent implements OnInit {

  @Input() private items: IqSelect2Item[];
  @Input() searchFocused: boolean;
  @Output() itemSelected: EventEmitter<any> = new EventEmitter();
  private selectedIndex: number = 0;

  constructor() { }

  ngOnInit() {
  }

  onItemSelected(item: IqSelect2Item) {
    this.itemSelected.emit(item);
  }

  selectNext() {
    if (this.selectedIndex + 1 === this.items.length) {
      this.selectedIndex = 0;
    } else {
      this.selectedIndex++;
    }
  }

  selectPrevious() {
    if (this.selectedIndex - 1 < 0) {
      this.selectedIndex = this.items.length - 1;
    } else {
      this.selectedIndex--;
    }
  }

  selectCurrentItem() {
    this.onItemSelected(this.items[this.selectedIndex]);
    this.selectedIndex = 0;
  }

  onMouseOver(index: number) {
    this.selectedIndex = index;
  }

}