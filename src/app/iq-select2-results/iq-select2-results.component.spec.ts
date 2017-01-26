/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IqSelect2ResultsComponent} from './iq-select2-results.component';

describe('IqSelect2ResultsComponent', () => {
    let component: IqSelect2ResultsComponent;
    let fixture: ComponentFixture<IqSelect2ResultsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IqSelect2ResultsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IqSelect2ResultsComponent);
        component = fixture.componentInstance;
        component.items = [
            {
                id: '1',
                text: 'test 1'
            },
            {
                id: '2',
                text: 'test 2'
            }];
        component.selectedItems = [];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to the next item', () => {
        component.activeNext();
        expect(component.activeIndex).toBe(1);
    });

    it('should remain at the end', () => {
        component.activeIndex = 1;
        component.activeNext();
        expect(component.activeIndex).toBe(1);
    });

    it('should remain at the beginning', () => {
        component.activePrevious();
        expect(component.activeIndex).toBe(0);
    });

    it('should navigate to the previous item', () => {
        component.activeIndex = 1;
        component.activePrevious();
        expect(component.activeIndex).toBe(0);
    });

    it('should call scrollToElement on getting to the next result', () => {
        spyOn(component, 'scrollToElement');
        component.activeNext();
        expect(component.scrollToElement).toHaveBeenCalled();
    });

    it('should call scrollToElement on getting to the previous result', () => {
        spyOn(component, 'scrollToElement');
        component.activePrevious();
        expect(component.scrollToElement).toHaveBeenCalled();
    });

    it('should emit event on item selection', () => {
        spyOn(component.itemSelectedEvent, 'emit');
        component.selectCurrentItem();
        expect(component.itemSelectedEvent.emit).toHaveBeenCalled();
    });

    it('should reset active index after selection', () => {
        spyOn(component.itemSelectedEvent, 'emit');
        component.activeNext();
        component.selectCurrentItem();
        expect(component.activeIndex).toBe(0);
    });
});
