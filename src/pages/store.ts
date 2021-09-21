import { Page } from 'playwright';

export class Store {
 
  private groupOfTitles = '[class*="group-title"]:not([class*="sub-group-title"])';
  private searchInput = 'input[type="search"]';
  private clearSearchButton = '[aria-label="Clear input"]';
  
  private appCards = 'fs-app-card';

  async load(page: Page) {
    await page?.route('https://consent.cookiebot.com/uc.js', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });
    await page?.goto('https://store.fusionfabric.cloud', { waitUntil: 'networkidle', timeout: 120000 });
    // await page?.goto(baseUrl, { waitUntil: 'networkidle', timeout: 120000 });
    await page?.waitForSelector(this.appCards, { timeout: 120000 });
    await page?.evaluate(() => {
      localStorage.setItem('store.liveBanner', '{}');
    });
  }
  async getLobTitles(page: Page){
    if (await page?.$(this.groupOfTitles)) {
      await page?.waitForSelector(this.groupOfTitles);
      return await page?.$$eval(this.groupOfTitles, (titles) => {
        return titles.map((title) => {
          const string = title.innerHTML;
          return string.substring(0, string.indexOf('(')).replace('amp;', '').trim();
        });
      });
    }
  }
  async searchByKey(page: Page | undefined, keyword: string) {
    if (await page?.$(this.clearSearchButton)) {
      await page?.click(this.clearSearchButton);
    }
    await page?.fill(this.searchInput, keyword);
    await page?.waitForSelector(`xpath=//div[contains(@class,"result-info")]`);
  }
}
