'use strict';

var Funnel = require('broccoli-funnel');
var Merge = require('broccoli-merge-trees');
var Plugin = require('broccoli-plugin');
var concat = require('broccoli-concat');
// var Plugin = require('broccoli-caching-writer');
var path = require('path');
var fs = require('fs');
var glob = require("glob");
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

  // Read files from this.inputPaths, and write files to this.outputPath.
  // Silly example:

  // Read 'foo.txt' from the third input node
  //var inputBuffer = fs.readFileSync(path.join(this.inputPaths[2], 'foo.txt'));
  //var outputBuffer = someCompiler(inputBuffer);

  // Write to 'bar.txt' in this node's output
  console.log(this.inputPaths);

  let templatesStr = this.inputPaths.map(path => {
    let inputBuffer = glob.sync(path + '**/*.hbs').map(file => {
      console.log('file:', file);
      return fs.readFileSync(file);
    }).join('\n');

    return inputBuffer;
  }).join('\n');

  var atomizer = new Atomizer({verbose: true});
  var foundClasses = atomizer.findClassNames(templatesStr);
  var finalConfig = atomizer.getConfig(foundClasses, {});
  var css = atomizer.getCss(finalConfig);

  console.log(css, this.outputPath);

  // var targetPath = this.options.targetCssPath;
  // console.log(targetPath);

  // fs.writeFileSync(path.join(this.outputPath, 'bar.hbs'),
  //                  '<style>' + css + '</style>');
  //fs.mkdirSync(path.join(this.outputPath, 'styles'));
  fs.writeFileSync(path.join(this.outputPath, 'aaa.css'), css);
  // fs.writeFileSync(targetPath, css);
};

function MyPlugin(options) {
  this.name = 'ember-cli-atomizer';
  this.ext = 'hbs';
  this.options = options;
}

MyPlugin.prototype.toTree = function(tree) {
  return Merge([tree, new MyCompiler([tree, this.options.templatesPath], this.options)]);
};

module.exports = {
  name: 'ember-cli-atomizer',

  // setupPreprocessorRegistry: function(type, registry) {
  //   let options = {
  //     // inputTemplatePaths: path.join(this.projectRoot, 'templates/**/*.hbs'),
  //     // targetCssFile: path.join(this.projectRoot, 'styles/fzz.css')
  //   };
  //   let plugin = new MyPlugin(options);
  //   this._plugin = plugin;
  //   registry.add('template', plugin);
  // },

  // preprocessTree(type, tree) {
  //   if (type === 'template') {
  //     console.log('123');

  //     let templatesPath = path.join(this.projectRoot, 'templates');
  //     let targetCssPath = path.join(this.projectRoot, 'styles/acss.css');
  //     console.log(templatesPath, targetCssPath);

  //     tree = new Merge([new MyCompiler([templatesPath], {
  //       templatesPath,
  //       targetCssPath
  //     }), tree].filter(Boolean), {
  //       annotation: 'Foo bar baZzz'
  //     });

  //     return tree;
  //   }

  //   return tree;
  // },

  // preBuild(result) {
  //   console.log(result);

  //   let templatesPath = path.join(this.projectRoot, 'templates');
  //   let targetCssPath = path.join(this.projectRoot, 'styles/acss.css');
  //   console.log(templatesPath, targetCssPath);

  //   let inputBuffer = glob.sync(templatesPath + '**/*.hbs').map(file => {
  //     console.log('file:', file);
  //     return fs.readFileSync(file);
  //   }).join('\n');

  //   var atomizer = new Atomizer({verbose: true});
  //   var foundClasses = atomizer.findClassNames(inputBuffer);
  //   var finalConfig = atomizer.getConfig(foundClasses, {});
  //   var css = atomizer.getCss(finalConfig);

  //   console.log(css, this.outputPath);

  //   var targetPath = targetCssPath;
  //   console.log(targetPath);

  //   // fs.writeFileSync(path.join(this.outputPath, 'bar.hbs'),
  //   //                  '<style>' + css + '</style>');
  //   fs.writeFileSync(targetPath, css);
  // },

  treeForVendor(tree) {
    if (!this._isAddon()) {
      console.log(this.projectRoot, tree);
      // let f = new Funnel(this.projectRoot, {
      //   include: ['styles/foo.css'],
      //   allowEmpty: true,
      //   annotation: 'BASSSSD 0328947'
      // });

      let templatesPath = path.join(this.projectRoot, 'templates');
      let targetCssPath = path.join(this.projectRoot, 'styles/acss.css');

      let stylesPath = path.join(this.projectRoot, 'styles');

      let comp = new MyCompiler([templatesPath], {
        targetCssPath
      });

      let trees = [tree, comp].filter(Boolean);

      tree = new Merge(trees, {
        annotation: 'asdasdsad1243'
      });

    }

    return this._super.treeForVendor.call(this, tree);
  },

  included: function(app) {
    console.log('included');

    this.app = app;
    this.projectRoot = this._projectRoot(app.trees);

    let templatesPath = path.join(this.projectRoot, 'templates');
    let targetCssPath = path.join(this.projectRoot, 'styles/acss.css');
    // this._plugin.options.templatesPath = templatesPath;
    // this._plugin.options.targetCssPath = targetCssPath;

    app.import('vendor/aaa.css');

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
