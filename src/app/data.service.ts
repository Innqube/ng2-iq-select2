import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {
    debounceTime,
    distinctUntilChanged,
    map
} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { timer } from 'rxjs/observable/timer';

export class Country {
    id: string;
    name: string;
    code: string;
    color: string;
}

@Injectable()
export class DataService {

    private headers: Headers = new Headers({'Content-Type': 'application/json'});
    private options: RequestOptions = new RequestOptions({headers: this.headers});
    private list: Country[] = [{
        id: '1',
        name: 'Tunisia',
        code: 'TN',
        color: '#fcd217'
    }, {
        id: '2',
        name: 'Vietnam',
        code: 'VN',
        color: '#bce0bc'
    }, {
        id: '3',
        name: 'France',
        code: 'FR',
        color: '#dcba1a'
    }, {
        id: '4',
        name: 'Russia',
        code: 'RU',
        color: '#c4d6c2'
    }, {
        id: '5',
        name: 'Finland',
        code: 'FI',
        color: '#20b116'
    }, {
        id: '6',
        name: 'Portugal',
        code: 'PT',
        color: '#e87568'
    }, {
        id: '7',
        name: 'Mongolia',
        code: 'MN',
        color: '#5a8d12'
    }, {
        id: '8',
        name: 'Nigeria',
        code: 'NG',
        color: '#e4cd58'
    }, {
        id: '9',
        name: 'Philippines',
        code: 'PH',
        color: '#bf5771'
    }, {
        id: '10',
        name: 'Luxembourg',
        code: 'LU',
        color: '#7ad51c'
    }, {
        id: '11',
        name: 'Azerbaijan',
        code: 'AZ',
        color: '#1cbd7b'
    }, {
        id: '12',
        name: 'China',
        code: 'CN',
        color: '#beb9f3'
    }, {
        id: '13',
        name: 'Belgium',
        code: 'BE',
        color: '#eeff02'
    }, {
        id: '14',
        name: 'Japan',
        code: 'JP',
        color: '#b1b49b'
    }, {
        id: '15',
        name: 'Uzbekistan',
        code: 'UZ',
        color: '#abccc3'
    }, {
        id: '16',
        name: 'Argentina',
        code: 'AR',
        color: '#c1ee5b'
    }, {
        id: '17',
        name: 'Indonesia',
        code: 'ID',
        color: '#19f77a'
    }];

    constructor(private http: Http) {
    }

    public listData(pattern: string, maxResults?: number): Observable<Country[]> {
        return of(this.list
            .filter((country) => country.name.toUpperCase().indexOf(pattern.toUpperCase()) !== -1)
            .sort(this.sortFunction));
    }

    private sortFunction(country1: Country, country2: Country) {
        if (country1.name < country2.name) {
            return -1;
        }
        if (country1.name > country2.name) {
            return 1;
        }
        return 0;
    }

    public listDataMax(pattern: string, maxResults: number): Observable<{ count: number, results: Country[] }> {
        const filteredList = this.list
            .filter((country) => country.name.toUpperCase().indexOf(pattern.toUpperCase()) !== -1)
            .sort(this.sortFunction);

        return timer(1000)
            .pipe(map((t) => {
                return {
                    count: filteredList.length,
                    results: maxResults && maxResults < filteredList.length ? filteredList.splice(0, maxResults) : filteredList
                };
            }));
    }

    public getItems(ids: string[]): Observable<Country[]> {
        const selectedItems: Country[] = [];

        ids.forEach((id) => {
            this.list
                .filter((item) => item.id == id)
                .map((item) => selectedItems.push(item));
        });

        return of(selectedItems);
    }

}
