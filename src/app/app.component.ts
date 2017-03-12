import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService, Country} from './data.service';
import {Observable} from 'rxjs/Observable';
import {IqSelect2Item} from './component-wrapper/iq-select2/iq-select2-item';
import {FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {IqSelect2Component} from './component-wrapper/iq-select2/iq-select2.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public form: FormGroup;
    public listItems: (term: string) => Observable<Country[]>;
    public getItems: (ids: string[]) => Observable<Country[]>;
    public entityToIqSelect2Item: (entity: Country) => IqSelect2Item;
    @ViewChild('countrySingle') countrySingle: IqSelect2Component<Country>;

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
                id: '16',
                name: 'Argentina',
                code: 'AR',
                color: '#c1ee5b'
            }, Validators.required],
            countryMultiple: null,
            countryMultipleDisabled: new FormControl({
                value: [{
                    id: '16',
                    name: 'Argentina',
                    code: 'AR',
                    color: '#c1ee5b'
                }, {
                    id: '17',
                    name: 'Indonesia',
                    code: 'ID',
                    color: '#19f77a'
                }],
                disabled: true
            }),
            countrySingleMin0: null,
            countryMultipleMin0: [[{
                id: '16',
                name: 'Argentina',
                code: 'AR',
                color: '#c1ee5b'
            }]],
            habilitado: true
        });
        this.initializeCountryIqSelect2();
        this.form.valueChanges.subscribe(() => {
            console.log('-->' + this.form.controls['countrySingle'].value);
        });
    }

    private initializeCountryIqSelect2() {
        this.listItems = (term: string) => this.dataService.listData(term);
        this.getItems = (ids: string[]) => this.dataService.getItems(ids);
        this.entityToIqSelect2Item = (entity: any) => {
            return {
                id: entity.id,
                text: entity.name,
                entity: entity
            };
        };
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
