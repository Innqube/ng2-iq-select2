import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';

@Component({
  selector: 'iq-select2-selected',
  templateUrl: './iq-select2-selected.component.html',
  styleUrls: ['./iq-select2-selected.component.css']
})
export class IqSelect2SelectedComponent implements OnInit {

  @Input()
  private items: IqSelect2Item[];
  @Output()
  itemRemoved: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onItemRemoved(item: IqSelect2Item) {
    this.itemRemoved.emit(item);
  }

}
