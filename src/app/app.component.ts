import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { IqSelect2Item } from './iq-select2/iq-select2-item';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private dataObserver: Observer<IqSelect2Item[]>;
  private inputData: Observable<IqSelect2Item[]>;
  private form: FormGroup;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.inputData = new Observable<IqSelect2Item[]>(observer => this.dataObserver = observer);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: '',
      lastname: '',
      option: '',
      category: ''
    });
  }

  requestData(pattern: string) {
    this.dataService.listData(pattern).subscribe(result => {
      this.dataObserver.next(result)
    });
  }

  send(formJson: string) {
    console.log(formJson);
  }

}
