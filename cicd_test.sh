#!/bin/bash
set -x
set -e

echo -e "Running common tests"

npm -v
node -v

whoami

cd common

npm ci

! npm run test && exit 1

npm run build

echo -e "Zipping common build to be uploaded as an artifact"

tar -czf /var/artifacts/common_build.tar.gz .

echo -e "Finished running common tests"

cd ..

echo -e "Running server tests and build"

cd server

npm ci

npm run seed

! npm run test && exit 1

echo -e "Zipping server code to be uploaded as an artifact"

tar -czf /var/artifacts/server_build.tar.gz .

npm run coverage-report

echo -e "Moving test reports to volume"

mv coverage /var/artifacts/

mv mochawesome-report /var/artifacts/

npm run start &

echo -e "Finished running server tests"

cd ..

echo -e "Running client"

cd client

npm ci

CI=false
GENERATE_SOURCEMAP=false

npm run build
cd build

echo -e "Zipping client build to be uploaded as an artifact"

tar -czf /var/artifacts/client_build.tar.gz .

cd ..
npm run start