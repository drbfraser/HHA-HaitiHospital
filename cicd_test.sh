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

cd ..

echo -e "Running server tests and build"

cd server

npm ci

npm run seed

! npm run test && exit 1

npm run start &

cd ..

echo -e "Running client"

cd client

npm ci

npm run start