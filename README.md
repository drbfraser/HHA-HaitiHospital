# CMPT 373 Haumea: HHA Internal Project

This is a web application made for Hope Health Action (HHA) to digitize its data collection process
at field hospitals. The project uses the MERN stack and used the following as an initial template.

[boiler plate](https://github.com/nemanjam/mern-boilerplate).

Team Haumea created this project for CMPT 373. It is currently being further developed by CMPT 415
team to deploy it for summer 2022.

## Documents

- See the project's
  [Google Drive folder](https://drive.google.com/drive/u/1/folders/1gFExr-PnGu1AitOtUZj-w4E_3EmPlD-q)
  for developer guides, user manuals, design docs, reports, and other useful documents beyond what
  is listed in this readme or elsewhere in the repo.

- Please update this readme and the files/folders in Google Drive to make them more useful, correct,
  and relevant!

## Features

- Message board (viewing and adding messages)
- Clean User Interface
- Sidebar Navigation
- Page Route Protection based on Role and Department of User
- Dynamic Page Rendering based on Role and Department of User
- API JWT Authentication/Authorization
- Account Management and Admin Dashboard for User Management
- French Translation
- Report Submission/Viewing for all Departments
- Database Routing/Structures
- Structured Report Models for each Department
- Multiple Report Deletion and Aggregation/Report Merging
- CSV and PDF Export Functionality
- Case Studies Submissions and Display
- Biomechanical Issues Report Submissions and Display
- Leaderboard between Departments

## Future Improvements

- Backend Coupling Resolution between API Routing and Backend Logic
- Frontend Coupling Resolution for API Calls and Business Logic
- Dynamic Form Creation/Data Rendering
- Displaying Frontend Report Aggregation
- Automatic Unit Testing/Integration
- Creole Translation
- Reminder system for Department Report Submission based on time
- Biomechanical Page Secondary Support Form
- Biomechanical Page Route Protection/Authentication
- Internal Logic for Employee of the Month

## Demo

The development environment of the project can be viewed using this link:
<https://hhahaiti-dev.cmpt.sfu.ca/>

The staging environment: <https://hhahaiti-stg.cmpt.sfu.ca/>

## Directory Structure

The Directory splits into client and server sides. Here are a few important locations:

### Serverside

- /server/src contains resources to database models(/models), routes and API calls(/routes), JSON
  test entries(/tests), and other backend code.

### Clientside

- /server/src contains resources to react components(/components), index file(index.ts), and other
  frontend code
- All `API` related calls are stored under `API` folder. It is is ordered in `CRUD` format (Create, Read, Update, Delete) for organized and orderly format.

## Build instructions for Devs

These instructions are to set up a dev environment.

### Install Node.js

- You can find it [here](https://nodejs.org/en/download/). Currently, we are support node 18 and 20. Use the LTS version described in the
  .nvrmc (Please keep this updated to the LTS version of node)

### Install MongoDB

Install Mongo for your system:

- For [MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

- For [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

You can use [MongoDB Compass](https://www.mongodb.com/try/download/compass) for a GUI of Mongo.

### Process Environment

Before starting the server, you will need to define process environment variables specific to your
setup. Environment Variables configure the server. You can configure them by creating a `.env` file
under the `server` folder. You can use the following example `.env` configurations:

```bash
# Your MongoDB URI (local or remote). Defaults to localhost:27017
MONGO_URI=mongodb://localhost:27017/
# Secret use to generate JWT tokens (You can generate the secret via 'openssl rand -base64 32'on Linux)
JWT_SECRET=secret
# CORS origin. Currently only support one and will be re evaluated in the future.
CORS=http://localhost:3000
# Port for server
SERVER_PORT=8000
# Port for unit test server
TEST_SERVER_PORT=5001
# Password for seeding users
PASSWORD_SEED=C@td0g
```

> [!IMPORTANT] If you are planning to run tests in your local environment and have changed the
> password variable above, please make sure to update the cypress.config.ts file accordingly. Please
> do not commit the updated cypress.config.ts file.

### Common package

- Navigate to the /common folder from the root directory
- Run the following commands to install dependencies and build the files

```bash
npm install
npm run build
```

_(Outdated)_ Whenever changes are made to `common` folder, you should run `npm run update-common` on
root dir. This will run a shell script inside `scripts/update-common.sh` which rebuilds `common` and
reinstalls it in `client` and `server`.

### Server Setup

- navigate into/server folder from the root directory
- run the following:

```bash
npm install
npm run seed
npm start
```

### Client Setup

- Navigate to the /client folder from the root directory
- Run the following commands to install dependencies and start the client

```bash
npm install
npm start
```

Alternatively, you can run this command inside the root directory to run the client and server
concurrently:

```bash
npm run dev
```


> Note: If you are using wsl2 you may face the login problem because the wsl is not coonecting to mongoDB correctly. [Here is the Solution.](https://github.sfu.ca/bfraser/415-HHA-Haiti/wiki/Troubleshoot-windows-MongoDB-on-WSL2)


Now that everything is up, visit <http://localhost:3000> and log in with the seeded users:

- Role: Admin
- Username: user0
- Role: Medical Director
- Username: user1
- Role: Head of Department
- Username: user2
- Role: User
- Username: user3 to user 6

The password will be `PASSWORD_SEED` as defined in your `.env`

## Logging

Log levels:

```json
levels {
    error: 0,
    warn 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug 5,
    silly: 6
}
```

For prod env:

- log level is set to `info`, meaning only `error`, `warn` and `info` will show up in the log files.
- saves logs to logs/hha-info-%DATE%.log and logs/hha-errors-%DATE%.log files which are then rotated
  every day or whenever the file limit is exceeded
- see `logger/prod.logger.ts`

For non-prod env

- log level is set to `debug`
- logs will not be exported into a file but only to the console.
- see `logger/dev.logger.ts`

### Environment Variables Required for Logging

The following values are needed from a Grafana Cloud account to run with logging

- LOKI_HOST
- LOKI_USER
- LOKI_KEY
- PROMETHEUS_HOST
- PROMETHEUS_USER
- PROMETHEUS_KEY

### App Labels for Logging in Dev, Staging, and Prod

We now have logs coming from the docker containers and the app server itself. For the app server, if we want to know from which environment it's from, we can set the `app` label to `LOKI_APP_LABEL` in the .env file. By default, it's going to be `hhahaiti_local` for local testing.

- Dev: `hhahaiti_dev`
- Staging: `hhahaiti_stg`
- Prod: `hhahaiti_prod`

### Command to run docker services for local monitoring

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Deployment on staging

We would need a Prometheus config file that would push logs to the production Grafana cloud.

## Prettier Setup

We use prettier as our code formatter. The repo provides a prettier config to unify our styles. Prettier is run automatically on staged files whenever code is committed.

- Install Prettier as a VSCode extension
- Navigate to the root directory
- Run the following commands run prettier on the whole project

```bash
npm install
npm run format
```

Our prettier config is set to format code on file save.

Note:
- `npm run format` - formats all the files, usually not needed since we added husky precommit on staged files
- `npm run precommit` - formats only staged files. This is git-precommit hook to do prettier on staged files

### Troubleshooting commit error

If you encounter:

```
> lint-staged

⚠ Some of your tasks use `git add` command. Please remove it from the config since all modifications made by tasks will be automatically added to the git commit index.

✔ Preparing lint-staged...
✔ Hiding unstaged changes to partially staged files...
✔ Running tasks for staged files...
✖ Prevented an empty git commit!
↓
  ✖ lint-staged failed due to a git error.
✔ Reverting to original state because of errors...
✔ Cleaning up temporary files...

  ⚠ lint-staged prevented an empty git commit.
  Use the --allow-empty option to continue, or check your task configuration

husky - pre-commit script failed (code 1)
```

This means the code that you change is only due to formatting reason - the code after formatted is the same as latest commit. You need to make a change that does not only contain formatting.

## Docker Setup

- To run the docker containers, run the following commands from the root directory

```bash
sudo docker-compose build
sudo docker-compose up
```

- To seed the database in the containerized deployment, run the following command from the `/src`
  folder in the server containerized

```bash
npm run seed
```

## Gitlab Runners

> [!WARNING] As of Summer 2023, this project was migrated to Github and all the pipeline steps run
> on Github runners.

- Gitlab runners are administered directly by Dr Brian
- It is important to not change how jobs are picked up by runners as this affects projects outside
  of this repo
- It is possible to run and test steps in the pipeline locally.
  [This is a useful guide to get started.](https://www.linkedin.com/pulse/how-execute-gitlab-ci-docker-your-local-machine-shubham-takode/)

## MongoDB in non-local environments

If the mongoDB is not seeded you may need to seed it.

To do so:

1. Successfully deploy the project
2. SSH into the server
3. Find the ID of the server container (via `docker container ls`)
4. run: `docker exec -it <container-id> bash`
5. run: `cd server`
6. run: `npm run seed`

## License

GNU GPL

## Infrastructure Notes

### Overview

Our infrastructure is composed of frontend and backend projects, utilizing React and Node.js,
respectively. Both projects rely on a shared package responsible for performing various tasks. The
backend, developed in TypeScript, is transpiled with ts-node for production builds, while the
frontend is created using Create React App, which employs webpack as its default bundler. We modify
the webpack rules with the rewire library. Deployment occurs within Docker containers, featuring
Caddy as a reverse proxy for the frontend and MongoDB as the database. Our infrastructure maintains
consistency across development (dev) and staging environments, with updates pushed through
respective branch merges. We use fluentbit to collect logs and send them to hosted services like
cloudwatch and grafana where they can be stored and analyzed.

### Backend

The backend project, developed using TypeScript, operates within a dedicated Docker container.
TypeScript code is transpiled to JavaScript using ts-node. The backend container communicates with
the MongoDB container for data storage and retrieval purposes.

### Frontend

The frontend project, built with Create React App and also using Typescript, runs inside a separate
Docker container. The frontend is served via Caddy, a reverse proxy incorporating TLS, which
delivers the frontend content as HTML, CSS, and JS files within the Caddy container. The frontend in
production is compiled using webpack, which transpiles CRA into an optimized javascript file (more
on this Webpack and Rewire).

### Docker Containers

Our application is constructed and deployed within Docker containers. We utilize three containers:
one each for the frontend, backend, and MongoDB database. This approach ensures component isolation
and independent scalability. Each container is assembled using a Dockerfile, which outlines the
necessary dependencies and configurations for that specific component.

### Caddy

Caddy serves as the reverse proxy for our frontend, providing built-in TLS to encrypt all incoming
and outgoing traffic. This additional layer of security enhances the overall protection of our
application.

### Database

MongoDB functions as our database solution, operating within its own Docker container. It interacts
with the backend container for data storage and retrieval operations.

### Fluentbit

Fluent Bit is a lightweight data collector that can efficiently collect log data from various
sources, including Docker containers, and output it to different destinations like Amazon
CloudWatch. This setup helps monitor application health and identify issues quickly, ensuring a
reliable and stable product for our users.

### Dev and Staging

Our infrastructure supports two environments: dev and staging. Updates to the dev environment occur
through merges to the master branch, while the staging environment is updated via merges to the
staging branch. Consistent infrastructure across both environments ensures application uniformity,
simplifying the process of identifying and resolving issues that may arise in one environment but
not the other.

### Webpack and Rewire

Webpack serves as a powerful bundler and transpiler, responsible for transforming and bundling our
frontend project's assets, including JavaScript, CSS, and images. Webpack is employed by default in
Create React App (CRA) configurations, allowing for streamlined development.

Rewire is a complementary library that enables us to modify the default CRA configurations of
Webpack without ejecting from CRA. This allows us to customize Webpack configurations according to
our specific requirements, granting us the flexibility to adapt our project's build process while
maintaining the simplicity and ease of use provided by CRA. An example use of rewire is preventing
webpack from changing class and function names which are shortened by default in CRA's webpack
config.

### API End-points

Please import “hha.postman_collection” file from the repository to your postman. This collection
contains all the api requests to the database.To send a request to the database from postman, please
run “Step 1. CSRF Token” and “Step 2. Login” requests inside the Authentication folder first. These
two requests set up the value for the CSRF token variable. This token is required in some requests.
If you create a new api request, please remember to update this file.
