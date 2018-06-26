ember-cli-atomizer
==============================================================================

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

    // Pattern to match template files. [Glob](https://github.com/isaacs/node-glob) is used.
    // '**/*.hbs' by default.
    pattern: <string>,

    // [Atomizer](https://github.com/acss-io/atomizer) config (optional). [example-config.js](https://github.com/acss-io/atomizer/blob/master/examples/example-config.js)
    // `undefined` by default.
    config: <object>
  }
```
