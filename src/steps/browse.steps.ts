import { ICustomWorld } from '../support/custom-world';
import { Store } from '../pages/store';
import { Given, Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
const store: Store = new Store();

Given('Go to the main page of Fusion Store', async function (this: ICustomWorld) {
  const { page } = this;
  await store.load(page!);
});

When('User searches application by {string}', async function (this: ICustomWorld, author: string) {
  const { page } = this;
  await store.searchByKey(page, author);
});

Then('Results list has more than 0 items', async function (this: ICustomWorld) {
  const { page } = this;
  const lobTitles = await store.getLobTitles(page!);
  assert.isNumber(lobTitles?.length);
  assert.notEqual(lobTitles?.length, 0);
});
