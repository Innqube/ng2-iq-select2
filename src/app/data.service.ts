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
    let params: URLSearchParams = new URLSearchParams();
    params.set('pattern', pattern);

    return this.http
      .get('http://localhost:8080/ws/categories-new', {
        search: params
      })
      .map((res: Response) => {
        let jsonArray = res.json();
        let items: IqSelect2Item[] = [];

        jsonArray.forEach(element => {
          let item: IqSelect2Item = {
            id: element,
            text: element
          };
          items.push(item);
        });

        return items;
      })
      .catch((error: any) => Observable.throw('Server error'));
  }

}
