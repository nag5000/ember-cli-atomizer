'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const BroccoliPlugin = require('broccoli-caching-writer');
const MergeTrees = require('broccoli-merge-trees');

const Atomizer = require('atomizer');

const CSS_FILE_NAME = 'atomic.css';

AtomizerCompiler.prototype = Object.create(BroccoliPlugin.prototype);
AtomizerCompiler.prototype.constructor = AtomizerCompiler;
function AtomizerCompiler(inputNodes, options) {
  BroccoliPlugin.call(this, inputNodes);
  this.options = options || {};
}

AtomizerCompiler.prototype.build = function() {
  let pattern = this.options.pattern || '**/*.hbs';
  let templatesStr = this.inputPaths.map(inputPath => {
    return glob.sync(path.join(inputPath, pattern)).map(file => {
      return fs.readFileSync(file);
    }).join('\n');
  }).join('\n');

  let atomizer = new Atomizer({verbose: true});
  let foundClasses = atomizer.findClassNames(templatesStr);

  // Make shallow copy to avoid mutation of `options.config` in
  // `atomizer.getConfig` func: https://git.io/f4dyl.
  // Otherwise, the result of the second compilation will be incorrect.
  let defaultConfig = Object.assign({}, this.options.config);
  let config = atomizer.getConfig(foundClasses, defaultConfig);
  let css = atomizer.getCss(config);

  let cssOutputPath = path.join(this.outputPath, CSS_FILE_NAME);
  fs.writeFileSync(cssOutputPath, css);
};

module.exports = {
  name: 'ember-cli-atomizer',

  treeForVendor(tree) {
    let host = this._findHost();
    let options = host.options[this.name] || {};
    let templatesPaths = options.dir
        ? Array.isArray(options.dir) ? options.dir : [options.dir]
        : [host.trees.templates];

    let compiler = new AtomizerCompiler(templatesPaths, options);
    let trees = [tree, compiler].filter(Boolean);

    tree = new MergeTrees(trees, {
      annotation: this.name
    });

    return this._super.treeForVendor.call(this, tree);
  },

  included(parent) {
    this.import('vendor/' + CSS_FILE_NAME);
    return this._super.included.apply(this, arguments);
  }
};
