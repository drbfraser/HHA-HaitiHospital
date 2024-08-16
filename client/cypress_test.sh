#!/bin/bash

set -x

whoami

echo -e "Running cypress tests"

npm run cypress:pretest

npx cypress run

npm run cypress:posttest

echo -e "Finished cypress tests"

echo -e "Moving cypress test reports to volume"

mv cypress/reports/mochareports/report.html /var/artifacts/