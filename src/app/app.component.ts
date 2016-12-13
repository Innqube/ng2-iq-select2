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
  private form: FormGroup;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstname: '',
      lastname: '',
      option: '',
      country: ''
    });
  }

  send(formJson: string) {
    console.log(formJson);
  }

}
