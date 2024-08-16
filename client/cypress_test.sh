#!/bin/bash

set -x

whoami

npm run cypress:pretest

npx cypress run

npm run cypress:posttest

mv cypress/reports/mochareports/report.html /var/artifacts/