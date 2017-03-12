import {Ng2IqSelect2Page} from './app.po';

describe('ng2-iq-select2 App', () => {
  let page: Ng2IqSelect2Page;

  beforeEach(() => {
    page = new Ng2IqSelect2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
