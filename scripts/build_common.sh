#!/bin/sh

BASEDIR=$(dirname $0)
CALLDIR=${PWD}

cd ${BASEDIR}/../common
npm install
npm run build

cd ${CALLDIR}
npm uninstall @hha/common
npm pack ../common
npm install hha-common-1.0.0.tgz
