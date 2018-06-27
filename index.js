'use strict';

var Funnel = require('broccoli-funnel');
var Merge = require('broccoli-merge-trees');
var concat = require('broccoli-concat');
//var Plugin = require('broccoli-plugin');
var Plugin = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var Atomizer = require('atomizer');

// Create a subclass MyCompiler derived from Plugin
MyCompiler.prototype = Object.create(Plugin.prototype);
MyCompiler.prototype.constructor = MyCompiler;
function MyCompiler(inputNodes, options) {
  options = options || {};
  Plugin.call(this, inputNodes, {
    annotation: options.annotation
  });
  this.options = options;
}

MyCompiler.prototype.build = function() {
  let templatesStr = this.inputPaths.map(path => {
    let inputBuffer = glob.sync(path + '**/*.hbs').map(file => {
      return fs.readFileSync(file);
    }).join('\n');

    return inputBuffer;
  }).join('\n');

  var atomizer = new Atomizer({verbose: true});
  var foundClasses = atomizer.findClassNames(templatesStr);
  var finalConfig = atomizer.getConfig(foundClasses, {});
  var css = atomizer.getCss(finalConfig);

  fs.writeFileSync(path.join(this.outputPath, 'atomic.css'), css);
};

module.exports = {
  name: 'ember-cli-atomizer',

  treeForVendor(tree) {
    if (!this._isAddon()) {
      let templatesPath = path.join(this.projectRoot, 'templates');
      let comp = new MyCompiler([templatesPath], {});

      let trees = [tree, comp].filter(Boolean);

      tree = new Merge(trees, {
        annotation: 'asdasdsad1243'
      });
    }

    return this._super.treeForVendor.call(this, tree);
  },

  included: function(app) {
    this.projectRoot = this._projectRoot(app.trees);

    app.import('vendor/atomic.css');

    return this._super.included.apply(this, arguments);
  },

  _isAddon: function() {
    return Boolean(this.parent.parent);
  },

  _projectRoot: function(trees) {
    var projectRoot;
    if (this._isAddon()) {
      projectRoot = this.parent.root + '/addon';
    } else if (trees && trees.app) {
      projectRoot = trees.app;
    } else {
      projectRoot = this.parent.root + '/app';
    }

    return projectRoot;
  }
};
