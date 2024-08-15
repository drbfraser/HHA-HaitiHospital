#!/bin/bash

RED='\033[1;31m'
BLUE='\033[1;36m'
COLOR_OFF='\033[0m'

set -x
set -e

echo -e "${BLUE}"
echo -e "Running common tests"

npm -v
node -v

cd common

npm ci

! npm run test && exit 1

npm run build

tar -czf /var/artifacts/common_build.tar.gz .

cd ..

echo -e "Running server tests and build"

cd server

npm ci

npm run seed

! npm run test && exit 1

tar -czf /var/artifacts/server_build.tar.gz .

npm run coverage-report

mv coverage /var/artifacts/

mv mochawesome-report /var/artifacts/

npm run start &

cd ..

echo -e "Running client"

cd client

npm ci

CI=false
GENERATE_SOURCEMAP=false

npm run build
cd build
tar -czf /var/artifacts/client_build.tar.gz .

cd ..
npm run start