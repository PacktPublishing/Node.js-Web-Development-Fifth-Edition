
const cjsmodule = require('cjs-module');
const cjscjs6inner = require('cjs-module/cjsmodule');
// const hiddeninner = require('cjs-module/src/hidden-module.js');
const es6cjsinner = require('es6-module/cjsmodule');

// const broken1 = require('cjs-module/does/not/exist');

cjsmodule.hello();
cjscjs6inner.hello();
// hiddeninner.hello();

es6cjsinner.hello();
