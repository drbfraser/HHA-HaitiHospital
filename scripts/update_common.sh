#!/bin/sh

cd ../common
npm run build

cd ../client
npm uninstall @hha/common
npm pack ../common
npm install hha-common-1.0.0.tgz
rm -rf hha-common-1.0.0.tgz

cd ../server
npm uninstall @hha/common
npm pack ../common
npm install hha-common-1.0.0.tgz
rm -rf hha-common-1.0.0.tgz

cd ..

