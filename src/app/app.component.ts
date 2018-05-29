import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, tap} from 'rxjs/operators';
import {Country, DataService} from './data.service';
import {IqSelect2Item} from '../../projects/ng2-iq-select2/src/lib/iq-select2/iq-select2-item';
import {IqSelect2Component} from '../../projects/ng2-iq-select2/src/lib/iq-select2/iq-select2.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public form: FormGroup;
    public listItems: (term: string) => Observable<Country[]>;
    public listItemsMax: (term: string, ids: string[]) => Observable<Country[]>;
    public getItems: (ids: string[]) => Observable<Country[]>;
    public entityToIqSelect2Item: (entity: Country) => IqSelect2Item;
    public count: number;
    @ViewChild('countrySingle') countrySingle: IqSelect2Component;

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
            countryMin0Count: null,
            habilitado: true
        });
        this.initializeCountryIqSelect2();
        this.form.valueChanges.subscribe(() => {
            // console.log('-->' + this.form.controls['countrySingle'].value);
        });
    }

    private initializeCountryIqSelect2() {
        this.listItems = (term: string) => this.dataService.listData(term);
        this.listItemsMax = (term: string, ids: string[]) => {
            const selectedCount = ids ? ids.length : 0;
            return this.dataService
                .listDataMax(term, 3 + selectedCount)
                .pipe(
                    tap(response => this.count = response.count),
                    map((response) => response.results)
                );
        };
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
        // console.log(formJson);
    }

    onSelect(item: IqSelect2Item) {
        // console.log('Item selected: ' + item.text);
    }

    onRemove(item: IqSelect2Item) {
        // console.log('Item removed: ' + item.text);
    }

    reset() {
        // console.log('Resetting form');
        this.form.reset();
    }

}
