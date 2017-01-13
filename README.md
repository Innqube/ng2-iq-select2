# ng2-iq-select2

[![InnQUbe](http://www.innqube.com/powered-by-innqube.png)](http://www.innqube.com/)
[![Build Status](https://travis-ci.org/Innqube/ng2-iq-select2.svg?branch=master)](https://travis-ci.org/Innqube/ng2-iq-select2)
[![codecov](https://codecov.io/gh/Innqube/ng2-iq-select2/branch/master/graph/badge.svg)](https://codecov.io/gh/Innqube/ng2-iq-select2)

Angular 2 native select 2 implementation based on bootstrap 3

* Easily filter on a remote webservice (can be used with a local list too)
* Works with ids or complete entities
* Single or multiple modes
* Forms integration


[Take a look at the demo page](https://innqube.github.io/ng2-iq-select2-demo)



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
<iq-select2 css="form-control input-sm" formControlName="country" [dataSourceProvider]="dataService.listData" referenceMode='id' [minimumInputLength]='0' [multiple]='true' [searchDelay]="200"></iq-select2>
```

*DataService*
```javascript
public listData(pattern: string): Observable<IqSelect2Item[]> {
    ...
}
```

*IqSelect2Item*
```javascript
interface IqSelect2Item {
    id: string;
    text: string;
    entity?: any; // only needed when referenceMode === 'entity'
}
```

Configuration options (Inputs and Outputs)
==========================================

**@Input() dataSourceProvider(term: string) => Observable<IqSelect2Item[]>**: the function to get the data based on user input

**@Input() selectedProvider(ids: string[]) => Observable<IqSelect2Item[]>**: the function to get previously selected data when referenceMode === 'id'

**@Input() referenceMode**: 'id' | 'entity'. Allows to specify if you need the whole entity or just the id.

**@Input() multiple**: 'true' | 'false'. Allows to select multiple options from the list. The form value is returned as an array.

**@Input() searchDelay**: ms until request is effectively triggered

**@Input() placeholder**: text to show until a search is performed

**@Input() disabled**: boolean to control the disabled state of the component

**@Input() minimumInputLength**: if this value is '0', only makes one request to server and later filter values on client side, works  as a dropDown in single mode. Functionality for values bigger than 0 not implemented yet.

**@Input() css**: css classes to be applied

**@Output() onSelect(item: IqSelect2Item)**: event triggered when an item is selected

**@Output() onRemove(item: IqSelect2Item)**: event triggered when an item is removed

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
