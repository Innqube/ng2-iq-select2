import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';

@Component({
  selector: 'iq-select2-results',
  templateUrl: './iq-select2-results.component.html',
  styleUrls: ['./iq-select2-results.component.css']
})
export class IqSelect2ResultsComponent implements OnInit {

  @Input() items: IqSelect2Item[];
  @Input() searchFocused: boolean;
  @Input() selectedItems: IqSelect2Item[];
  @Output() itemSelectedEvent: EventEmitter<any> = new EventEmitter();
  private activeIndex: number = 0;

  constructor() { }

  ngOnInit() {
  }

  onItemSelected(item: IqSelect2Item) {
    this.itemSelectedEvent.emit(item);
  }

  activeNext() {
    if (this.activeIndex + 1 === this.items.length) {
      this.activeIndex = 0;
    } else {
      this.activeIndex++;
    }
  }

  activePrevious() {
    if (this.activeIndex - 1 < 0) {
      this.activeIndex = this.items.length - 1;
    } else {
      this.activeIndex--;
    }
  }

  selectCurrentItem() {
    if (this.items[this.activeIndex]) {
      this.onItemSelected(this.items[this.activeIndex]);
      this.activeIndex = 0;
    }
  }

  onMouseOver(index: number) {
    this.activeIndex = index;
  }

  isSelected(item) {
    if (this.selectedItems.includes(item)) {
      return true;
    }
  }

}
