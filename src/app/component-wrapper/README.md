# ng2-iq-select2

[![InnQUbe](http://www.innqube.com/powered-by-innqube.png)](http://www.innqube.com/)
[![Build Status](https://travis-ci.org/Innqube/ng2-iq-select2.svg?branch=master)](https://travis-ci.org/Innqube/ng2-iq-select2)
[![codecov](https://codecov.io/gh/Innqube/ng2-iq-select2/branch/master/graph/badge.svg)](https://codecov.io/gh/Innqube/ng2-iq-select2)
[![Code Climate](https://codeclimate.com/github/Innqube/ng2-iq-select2/badges/gpa.svg)](https://codeclimate.com/github/Innqube/ng2-iq-select2)

Angular 2 native select 2 implementation based on bootstrap 3

* Easily filter on a remote webservice (can be used with a local list too)
* Works with ids or complete entities
* Single or multiple modes
* Forms integration


[Take a look at the demo page](https://innqube.github.io/ng2-iq-select2-demo)

---

Usage example:

*app.module.ts*
```javascript

import { IqSelect2Module } from 'ng2-iq-select2';

@NgModule({
    declarations: [..],
    imports: [.., IqSelect2Module, ...],
    providers: [..]
```

*html file*
```html
<iq-select2 css="form-control input-sm" 
            formControlName="country" 
            [dataSourceProvider]="listCountries"
            [selectedProvider]="loadFromIds"
            [iqSelect2ItemAdapter]="adapter"></iq-select2>
```

*example typescript file*
```javascript
export class Example {
    listCountries: (term: string) => Observable<Country[]>;
    loadFromIds: (ids: string[]) => Observable<Country[]>;
    adapter: (entity: Country) => IqSelect2Item;
//
    constructor(private countriesService: CountryService){
    
    }
//
    ngOnInit() {
        this.listCountries = (term: string) => this.countriesService.listCountries(term);
        this.loadFromIds = (ids: string[]) => this.countriesService.loadCountriesFromIds(ids);
        this.adapter = (entity: Country) => {
            return {
                id: country.id,
                text: country.name,
                entity: country
            };
    }
};
```

*IqSelect2Item*
```javascript
interface IqSelect2Item {
    id: string;
    text: string;
    entity?: any; // only needed when referenceMode === 'entity'
}
```

---

Configuration options (Inputs and Outputs)
==========================================

*@Input()* **dataSourceProvider: (term: string) => Observable<IqSelect2Item<T>[]>**: the function to get the data based on user input

*@Input()* **selectedProvider: (ids: string[]) => Observable<IqSelect2Item<T>[]>**: the function to get previously selected data when referenceMode === 'id'

*@Input()* **iqSelect2ItemAdapter: (entity: T) => IqSelect2Item**: the function to adapt any entity to a IqSelect2Item

*@Input()* **referenceMode**: 'id' | 'entity'. Allows to specify if you need the whole entity or just the id.

*@Input()* **multiple**: 'true' | 'false'. Allows to select multiple options from the list. The form value is returned as an array.

*@Input()* **searchDelay**: ms until request is effectively triggered

*@Input()* **placeholder**: text to show until a search is performed

*@Input()* **disabled**: boolean to control the disabled state of the component

*@Input()* **minimumInputLength**: if this value is '0', only makes one request to server and later filter values on client side, works  as a dropDown in single mode. Functionality for values bigger than 0 not implemented yet.

*@Input()* **css**: css classes to be applied

*@Input()* **remoteSearchIcon**: css icon to be used when search is performed remotely

*@Input()* **localSearchIcon**: css icon to be used when search is performed in the client

*@Input()* **deleteIcon**: css icon to be used to remove selected option (In single mode)

*@Output()* **onSelect(item: IqSelect2Item)**: event triggered when an item is selected

*@Output()* **onRemove(item: IqSelect2Item)**: event triggered when an item is removed

---

*Reference mode examples*
```javascript
// form.value example with referenceMode === 'id':
{
    'item': 1
}

// form.value example with referenceMode === 'entity':
{
    'item':  {
        'id': 1,
        'property1': 'value',
        ...
    }
}

// form.value example with referenceMode === 'id' and multiple === 'true':
{
    'item': [1,2,3]
}

// form.value example with referenceMode === 'entity' and multiple === 'true':
{
    'item': [{
        'id': 1,
        'property1': 'value',
        ...
    },{
        'id': 2,
        'property1': 'value2',
        ...
    },{
        'id': 3,
        'property1': 'value3',
        ...
    }]
}

```
