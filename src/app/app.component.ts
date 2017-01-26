import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {Observable} from 'rxjs/Observable';
import {IqSelect2Item} from './iq-select2/iq-select2-item';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public form: FormGroup;
    public listItems: (term: string) => Observable<IqSelect2Item[]>;
    public getItems: (ids: string[]) => Observable<IqSelect2Item[]>;

    constructor(private dataService: DataService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            firstname: {
                value: '',
                disabled: true
            },
            lastname: new FormControl(''),
            option: new FormControl(''),
            countrySingle: [{
                value: {
                    'id': '8',
                    'text': 'Argentina',
                    'entity': {
                        'id': '8',
                        'name': 'Argentina',
                        'money': 'ARS'
                    }
                },
                disabled: false
            }],
            countryMultiple: new FormControl({
                value: [{
                    'id': '8', 'text': 'Argentina', 'entity': {
                        'id': '8',
                        'name': 'Argentina',
                        'money': 'ARS'
                    }
                }],
                disabled: false
            }),
            countryMultipleDisabled: new FormControl({
                value: [{
                    'id': '8', 'text': 'Argentina', 'entity': {
                        'id': '8',
                        'name': 'Argentina',
                        'money': 'ARS'
                    }
                }],
                disabled: true
            }),
            countrySingleMin0: null,
            countryMultipleMin0: null
        });

        this.listItems = this.listData().bind(this.dataService);
        this.getItems = this.getCurrentItems().bind(this.dataService);
    }

    listData(): (term: string) => Observable < IqSelect2Item[] > {
        return this.dataService.listData;
    }

    getCurrentItems(): (ids: string[]) => Observable < IqSelect2Item[] > {
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

    reset() {
        console.log('Resetting form');
        this.form.reset();
    }

}
