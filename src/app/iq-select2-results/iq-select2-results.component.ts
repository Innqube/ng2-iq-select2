import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { IqSelect2Item } from '../iq-select2/iq-select2-item';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'iq-select2-results',
  templateUrl: './iq-select2-results.component.html',
  styleUrls: ['./iq-select2-results.component.css']
})
export class IqSelect2ResultsComponent implements OnInit {

  @Input()
  private items: Observable<IqSelect2Item[]>;
  @Output()
  itemSelected: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onItemSelected(item: IqSelect2Item) {
    this.itemSelected.emit(item);
  }

}
