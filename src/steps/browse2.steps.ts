import { ICustomWorld } from '../support/custom-world';
import { Store } from '../pages/store';
import { Given, Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
let store: Store;

Given('Go to the main page of Fusion Store - 2nd test', async function (this: ICustomWorld) {
  store = new Store(this.page!);
  await store.load(this.baseUrl!);
});

When('User searches application by {string} title', async function (this: ICustomWorld, title: string) {
  await store.searchByKey(title);
});

Then('List has more than 0 items', async function (this: ICustomWorld) {
  const lobTitles = await store.getLobTitles();
  assert.isNumber(lobTitles?.length);
  assert.notEqual(lobTitles?.length, 0);
});
