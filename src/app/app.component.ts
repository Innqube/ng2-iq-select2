import {Component, OnInit} from '@angular/core';
import {DataService, Country} from './data.service';
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
    public listItems: (term: string) => Observable<Country[]>;
    public getItems: (ids: string[]) => Observable<Country[]>;
    public entityToIqSelect2Item: (entity: Country) => IqSelect2Item;

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
                id: '17',
                name: 'Argentina',
                code: 'AR',
                color: '#c1ee5b'
            }],
            countryMultiple: null,
            countryMultipleDisabled: new FormControl({
                value: [{
                    id: '17',
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
            countryMultipleMin0: null,
            habilitado: true
        });
        this.initializeCountryIqSelect2();
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
