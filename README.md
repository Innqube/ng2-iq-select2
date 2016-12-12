# ng2-iq-select2

[![InnQUbe](http://www.innqube.com/powered-by-innqube.png)](http://www.innqube.com/)
Angular 2 native select 2 implementation based on bootstrap 3

* Easily filter on a remote webservice (can be used with a local list too)
* Works with ids or completes entities
* Single or multiple modes
* Forms integration

Usage example:

```html
<iq-select2 formControlName="item" [inputData]="inputData" (requestData)="requestData($event)" referenceMode='id' [multiple]='true'></iq-select2>
```

```javascript
private inputData: Observable<IqSelect2Item[]>;

requestData(pattern: string) {
    this.webservice.list(pattern).subscribe(results => {
        let items: IqSelect2Item[] = [];
        results.forEach(result => {
            items.push({
                'id': result.id,
                'text': result.name,
                'entity': result
            });
        });
        
        this.inputData = items;
    });
}
```

Configuration options
=====================

**referenceMode**: 'id' | 'entity'
**multiple**: 'true' | 'false'

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