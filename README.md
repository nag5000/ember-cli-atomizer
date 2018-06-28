ember-cli-atomizer
==============================================================================
[![npm version](https://badge.fury.io/js/ember-cli-atomizer.svg)](https://badge.fury.io/js/ember-cli-atomizer)

Use [Atomizer](https://github.com/acss-io/atomizer) to generate
[Atomic CSS](http://acss.io/) from your ember templates.

Installation
------------------------------------------------------------------------------

```
ember install ember-cli-atomizer
```


Usage
------------------------------------------------------------------------------

By default this addon will process `app/templates/**/*.hbs` to generate 
Atomic CSS rules using `atomizer`. Generated css will be imported into 
`vendor.css`.


You can specify options using the `ember-cli-atomizer` config property
in `ember-cli-build.js`:
```js
  'ember-cli-atomizer': {
    // Directory or directories of templates.
    // 'app/templates' by default.
    dir: <string|string[]>,

    // Pattern to match template files. 
    // https://github.com/isaacs/node-glob is used.
    // '**/*.hbs' by default.
    pattern: <string>,

    // Atomizer config (optional).
    // `undefined` by default.
    config: <object>
  }
```
