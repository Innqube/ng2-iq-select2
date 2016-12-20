import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { IqSelect2Item } from './iq-select2/iq-select2-item';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public form: FormGroup;
  public listItems: (term: string) => Observable<IqSelect2Item[]>;
  public getItems: (ids: string[]) => Observable<IqSelect2Item[]>;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: '',
      lastname: '',
      option: '',
      countrySingle: null,
      countryMultiple: null,
      countrySingleMin0: null,
      countryMultipleMin0: null
    });

    this.listItems = this.listData().bind(this.dataService);
    this.getItems = this.getCurrentItems().bind(this.dataService);
  }

  listData(): (term: string) => Observable<IqSelect2Item[]> {
    return this.dataService.listData;
  }

  getCurrentItems(): (ids: string[]) => Observable<IqSelect2Item[]> {
    return this.dataService.getItems;
  }

  send(formJson: string) {
    console.log(formJson);
  }

  onSelect(item: IqSelect2Item) {
    console.log('Item selected: ' + item.text);
  }

  onRemove(item: IqSelect2Item) {
    console.log('Item removed: ' + item.text);
  }

}
