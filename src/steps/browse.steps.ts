import { ICustomWorld } from '../support/custom-world';
import { Store } from '../pages/store';
import { Given, Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
let store: Store;

Given('Go to the main page of Fusion Store', async function (this: ICustomWorld) {
  store = new Store(this.page!,this.baseUrl!);
  await store.load();
});

When('User searches application by {string}', async function (this: ICustomWorld, author: string) {
  await store.searchByKey(author);
});

Then('Results list has more than 0 items', async function (this: ICustomWorld) {
  const lobTitles = await store.getLobTitles();
  assert.isNumber(lobTitles?.length);
  assert.notEqual(lobTitles?.length, 0);
});
