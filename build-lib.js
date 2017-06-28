const fs = require('fs');
const os = require("os");
const child_process = require('child_process');
const rimraf = require('rimraf');
const ncp = require('ncp');

console.log('clean publish directory');
if(fs.existsSync('publish')){
  rimraf.sync('publish');
}

console.log('copy files to publish directory');
const copyOptions = {
  filter: filename => !filename.endsWith('.spec.ts')
};
ncp('src/app/component-wrapper/','publish/', copyOptions, error => {
  console.log('inline templates and styles');
  const ngInlineCmd = os.platform() === 'win32' ? 'node_modules\\.bin\\ng2-inline' : './node_modules/.bin/ng2-inline';
  child_process.execSync(ngInlineCmd + ' --flatten --relative publish/**/*.component.ts', {stdio:[0,1,2]});

  console.log('compile typescript');
  const ngcCmd = os.platform() === 'win32' ? 'node_modules\\.bin\\ngc' : './node_modules/.bin/ngc';
  child_process.execSync(ngcCmd + ' -p publish/tsconfig.json', {stdio:[0,1,2]});
});
