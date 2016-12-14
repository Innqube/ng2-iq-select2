# ng2-iq-select2

[![InnQUbe](http://www.innqube.com/powered-by-innqube.png)](http://www.innqube.com/)
[![Build Status](https://travis-ci.org/Innqube/ng2-iq-select2.svg?branch=master)](https://travis-ci.org/Innqube/ng2-iq-select2)

Angular 2 native select 2 implementation based on bootstrap 3

* Easily filter on a remote webservice (can be used with a local list too)
* Works with ids or completes entities
* Single or multiple modes
* Forms integration

Usage example:

```html
<iq-select2 css="form-control input-sm" formControlName="country" [dataCallback]="dataService.listData" referenceMode='id' [multiple]='true' [searchDelay]="200"></iq-select2>
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
    entity: any; // only needed when referenceMode === 'entity'
}
```

Configuration options
=====================

**referenceMode**: 'id' | 'entity'. Allows to specify if you need the whole entity or just the id.
**multiple**: 'true' | 'false'. Allows to select multiple options from the list. The form value is returned as an array.
**searchDelay**: ms until request is effectively triggered

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

// form.value example with referenceMode === 'id' and multiple === 'true':
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