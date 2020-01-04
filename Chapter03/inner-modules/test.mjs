
// import cjsmodule from 'cjs-module';
import cjscjs6inner from 'cjs-module/cjsmodule';
import { default as cjses6inner } from 'cjs-module/es6module';
// import { default as es6module } from 'es6-module';
import es6cjsinner from 'es6-module/cjsmodule';
import { default as es6inner } from 'es6-module/es6module';

// import broken from 'es6-module/does/not/exist';
import broken from 'cjs-module/does/not/exist';

// cjsmodule.hello();
cjscjs6inner.hello();
cjses6inner();

// es6module();
es6cjsinner.hello();
es6inner();