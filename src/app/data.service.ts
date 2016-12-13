import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { IqSelect2Item } from './iq-select2/iq-select2-item';

@Injectable()
export class DataService {

  private headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  private options: RequestOptions = new RequestOptions({ headers: this.headers });

  constructor(
    private http: Http
  ) { }

  public listData(pattern: string): Observable<IqSelect2Item[]> {
    let filteredList: IqSelect2Item[] = [];

    let list: IqSelect2Item[] = [
      { 'id': '1', 'text': 'Indonesia', 'entity': undefined },
      { 'id': '2', 'text': 'Spain', 'entity': undefined },
      { 'id': '3', 'text': 'Portugal', 'entity': undefined },
      { 'id': '4', 'text': 'Myanmar', 'entity': undefined },
      { 'id': '5', 'text': 'Czech Republic', 'entity': undefined },
      { 'id': '6', 'text': 'Germany', 'entity': undefined },
      { 'id': '7', 'text': 'Mexico', 'entity': undefined },
      {
        'id': '8', 'text': 'Argentina', 'entity': {
          'id': '8',
          'name': 'Argentina',
          'money': 'ARS'
        }
      },
      { 'id': '9', 'text': 'Sweden', 'entity': undefined },
      { 'id': '10', 'text': 'Yemen', 'entity': undefined },
      { 'id': '11', 'text': 'Philippines', 'entity': undefined },
      { 'id': '12', 'text': 'China', 'entity': undefined },
      { 'id': '13', 'text': 'France', 'entity': undefined },
      { 'id': '14', 'text': 'Brazil', 'entity': undefined },
      { 'id': '15', 'text': 'Denmark', 'entity': undefined },
      { 'id': '16', 'text': 'Finland', 'entity': undefined },
      { 'id': '17', 'text': 'Colombia', 'entity': undefined },
      { 'id': '18', 'text': 'Russia', 'entity': undefined },
      { 'id': '19', 'text': 'Ethiopia', 'entity': undefined },
      { 'id': '20', 'text': 'Italy', 'entity': undefined }
    ];

    list.forEach(country => {
      if (country.text.toUpperCase().indexOf(pattern.toUpperCase()) !== -1) {
        filteredList.push(country);
      }
    });

    filteredList.sort((country1: IqSelect2Item, country2: IqSelect2Item) => {
      if (country1.text < country2.text) {
        return -1;
      }
      if (country1.text > country2.text) {
        return 1;
      }
      return 0;
    });

    return Observable.of(filteredList);
  }

}
