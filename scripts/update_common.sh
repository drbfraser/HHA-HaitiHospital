#!/bin/sh

cd ../common
npm install
npm run build

cd ../${1}
npm uninstall @hha/common
npm pack ../common
npm install hha-common-1.0.0.tgz

