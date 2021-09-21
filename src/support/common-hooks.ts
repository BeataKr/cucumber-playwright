import { ICustomWorld } from './custom-world';
import { browserOptions } from './config';
import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
} from 'playwright';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';
import { ensureDir } from 'fs-extra';
require('dotenv').config();

// eslint-disable-next-line no-var
var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;

declare global {
  // eslint-disable-next-line no-var
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

var testName: string;

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

BeforeAll(async function () {
  switch (process.env.BROWSER) {
    case 'firefox':
      browser = await firefox.launch(browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(browserOptions);
      break;
    default:
      browser = await chromium.launch(browserOptions);
  }
  await ensureDir(`${process.env.TRACEFILES_DIR}`);
  await ensureDir(`${process.env.HARFILES_DIR}`);
   
});

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  const time = new Date().toISOString().split('.')[0];
  const suffix = time.replace(/:|T/g, '-');
  testName = pickle.name.replace(/\W/g, '-')+'-' + suffix;

  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  this.context = await browser.newContext({
    acceptDownloads: true,
    extraHTTPHeaders: { 'ngsw-bypass': '' },
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    recordHar: process.env.HARFILES_DIR ? { path: 'harfiles' } : undefined,
  });

  await this.context.tracing.start({ screenshots: true, snapshots: true });

  this.page = await this.context.newPage();
  this.page.on('console', async (msg) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });
  this.feature = pickle;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    await this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot();
      image && (await this.attach(image, 'image/png'));
    }
  }
  await this.context?.tracing.stop({ path: `${process.env.TRACEFILES_DIR}/${testName}-trace.zip` });
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser.close();
});
