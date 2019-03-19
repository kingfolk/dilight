const fs = require('fs');
const path = require('path');

const package = require('../package');
const srcPackage = require('../publish/package');

srcPackage.name = 'dilight.js';
srcPackage.version = package.version;
srcPackage.publishConfig = package.publishConfig;

const publishDir = path.join(__dirname, '../publish');

fs.writeFileSync(path.join(publishDir, 'package.json'), JSON.stringify(srcPackage, null, 2));
