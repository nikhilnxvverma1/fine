import { NgFinePage } from './app.po';

describe('ng-fine App', () => {
  let page: NgFinePage;

  beforeEach(() => {
    page = new NgFinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
