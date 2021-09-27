import { Page } from 'playwright';

export class Store {

  page!: Page;
  constructor(page: Page){
    this.page = page;
  }

  private groupOfTitles = '[class*="group-title"]:not([class*="sub-group-title"])';
  private searchInput = 'input[type="search"]';
  private clearSearchButton = '[aria-label="Clear input"]';
  
  private appCards = 'fs-app-card';

  async load(baseUrl: string) {
    await this.page.route('https://consent.cookiebot.com/uc.js', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });
    await this.page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 120000 });
    await this.page.waitForSelector(this.appCards, { timeout: 120000 });
    await this.page.evaluate(() => {
      localStorage.setItem('store.liveBanner', '{}');
    });
  }
  async getLobTitles(){
    if (await this.page.$(this.groupOfTitles)) {
      await this.page.waitForSelector(this.groupOfTitles);
      return await this.page.$$eval(this.groupOfTitles, (titles) => {
        return titles.map((title) => {
          const string = title.innerHTML;
          return string.substring(0, string.indexOf('(')).replace('amp;', '').trim();
        });
      });
    }
  }
  async searchByKey(keyword: string) {
    if (await this.page.$(this.clearSearchButton)) {
      await this.page.click(this.clearSearchButton);
    }
    await this.page.fill(this.searchInput, keyword);
    await this.page.waitForSelector(`xpath=//div[contains(@class,"result-info")]`);
  }
}
