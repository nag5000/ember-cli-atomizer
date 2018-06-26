import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

function getCssProperty(elementSelector, property) {
  let elem = document.querySelector(elementSelector);
  return window.getComputedStyle(elem, null).getPropertyValue(property);
}

module('Acceptance | app', function(hooks) {
  setupApplicationTest(hooks);

  test('atomic css has been generated', async function(assert) {
    await visit('/foo');

    assert.equal(currentURL(), '/foo');
    assert.equal(getCssProperty('#title', 'font-size'), '30px');
    assert.equal(getCssProperty('#test-foo', 'margin-bottom'), '20px');
    assert.equal(getCssProperty('#test-bar', 'padding'), '5px');
    assert.equal(getCssProperty('#test-bar', 'padding'), '5px');
    assert.equal(getCssProperty('#test-my-component', 'font-weight'), '700');
  });
});
