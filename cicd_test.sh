#!/bin/bash

set -x
set -e

cd common

npm ci

npm run build

cd ..

cd server

npm ci

npm run seed

npm run test

npm run start &

cd ..

cd client

npm ci

npm run start