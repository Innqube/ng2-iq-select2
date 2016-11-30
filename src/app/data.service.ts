import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { IqSelect2Item } from './iq-select2/iq-select2-item';

@Injectable()
export class DataService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers });
  private list: IqSelect2Item[] = [
    { "id": 1, "text": "Indonesia" },
    { "id": 2, "text": "Spain" },
    { "id": 3, "text": "Portugal" },
    { "id": 4, "text": "Myanmar" },
    { "id": 5, "text": "Czech Republic" },
    { "id": 6, "text": "Germany" },
    { "id": 7, "text": "Mexico" },
    { "id": 8, "text": "Argentina" },
    { "id": 9, "text": "Sweden" },
    { "id": 10, "text": "Yemen" },
    { "id": 11, "text": "Philippines" },
    { "id": 12, "text": "China" },
    { "id": 13, "text": "France" },
    { "id": 14, "text": "Brazil" },
    { "id": 15, "text": "Denmark" },
    { "id": 16, "text": "Finland" },
    { "id": 17, "text": "Colombia" },
    { "id": 18, "text": "Russia" },
    { "id": 19, "text": "Ethiopia" },
    { "id": 20, "text": "Italy" }
  ];

  constructor(
    private http: Http
  ) { }

  public listData(pattern: string): Observable<IqSelect2Item[]> {
    let filteredList:IqSelect2Item[] = [];

    this.list.forEach(country => {
      if (country.text.toUpperCase().indexOf(pattern.toUpperCase()) !== -1) {
        filteredList.push(country);
      }
    });

    filteredList.sort((country1: IqSelect2Item, country2: IqSelect2Item) => {
      if (country1.text < country2.text) {
        return -1;
      }
      if (country1.text > country2.text) {
        return 1
      }
      return 0;
    });

    return Observable.of(filteredList);
  }

}
