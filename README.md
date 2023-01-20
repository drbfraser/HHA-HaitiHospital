# CMPT 373 Haumea: HHA Internal Project

This is a web application made for Hope Health Action (HHA) to digitize its data collection process at field hospitals. The project uses the MERN stack and used the following as an initial template.

[boiler plate](https://github.com/nemanjam/mern-boilerplate).

Team Haumea created this project for CMPT 373. It is currently being further developed by CMPT 415 team to deploy it for summer 2022.

### Documents

- See the project's [Google Drive folder](https://drive.google.com/drive/u/1/folders/1gFExr-PnGu1AitOtUZj-w4E_3EmPlD-q) for developer guides, user manuals, design docs, reports, and other useful
  documents beyond what is listed in this readme or elsewhere in the repo.

- Please update this readme and the files/folders in Google Drive to make them more useful, correct, and relevant!

### Features

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

### Future Improvements

- Backend Coupling Resolution between API Routing and Backend Logic
- Frontend Coupling Resolution for API Calls and Business Logic
- Dynamic Form Creation/Data Rendering
- Editing Report For Department
- Displaying Frontend Report Aggregation
- Automatic Unit Testing/Integration
- Creole Translation
- Reminder system for Department Report Submission based on time
- Biomechanical Page Secondary Support Form
- Biomechanical Page Route Protection/Authentication
- Internal Logic for Employee of the Month

## Demo

The development environment of the project can be viewed using this link: https://hhahaiti-dev.cmpt.sfu.ca/

The staging environment: https://hhahaiti-stg.cmpt.sfu.ca/

## Directory Structure

The Directory splits into client and server sides. Here are a few important locations:

#### Serverside

- /server/src contains resources to database models(/models), routes and API calls(/routes), JSON test entries(/tests), and other backend code.

#### Clientside

- /server/src contains resources to react components(/components), index file(index.ts), and other frontend code

## Build instructions for Devs

These instructions are to set up a dev environment.

### Install Node.js

- You can find it [here](https://nodejs.org/en/download/). Use the LTS version described in the .nvrmc (Please keep this updated to the LTS version of node)

### Install MongoDB

Install Mongo for your system:

- For [MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

- For [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

You can use [MongoDB Compass](https://www.mongodb.com/try/download/compass) for a GUI of Mongo.

### Process Environment

Before starting the server, you will need to define process environment variables specific to your setup. Environment Variables configure the server. You can configure them by creating a `.env` file
under the `server` folder. You can use the following example `.env` configurations:

```

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
PASSWORD_SEED=catdog

```

### Common package

- Navigate to the /common folder from the root directory
- Run the following commands to install dependencies and build the files

```
$ npm install
$ npm build
```

_(Outdated)_ Whenever changes are made to `common` folder, you should run `npm run update-common` on root dir. This will run a shell script inside `scripts/update-common.sh` which rebuilds `common`
and reinstalls it in `client` and `server`.

### Server Setup

- navigate into/server folder from the root directory
- run the following:

```
$ npm install
$ npm run seed
$ npm start
```

### Client Setup

- Navigate to the /client folder from the root directory
- Run the following commands to install dependencies and start the client

```
$ npm install
$ npm start
```

Alternatively, you can run this command inside the root directory to run the client and server concurrently:

```
$ npm run dev
```

Now that everything is up, visit http://localhost:3000 and log in with the seeded users:

- Role: Admin
- Username: user0
- Role: Medical Director
- Username: user1
- Role: Head of Department
- Username: user2
- Role: User
- Username: user3 to user 6

The password will be `PASSWORD_SEED` as defined in your `.env`

### Logging

Log levels:

```
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
- saves logs to logs/hha-info-%DATE%.log and logs/hha-errors-%DATE%.log files which are then rotated every day or whenever the file limit is exceeded
- see `logger/prod.logger.ts`

For non-prod env

- log level is set to `debug`
- logs will not be exported into a file but only to the console.
- see `logger/dev.logger.ts`

### Prettier Setup

We use prettier as our code formatter. The repo provides a prettier config to unify our styles.

- Install Prettier as a VSCode extension
- Navigate to the root directory
- Run the following commands to install and use prettier on the whole directory

```
$ npm install --global prettier
$ prettier --write
```

Our prettier config is set to format code on file save.

### Docker Setup

- To run the docker containers, run the following commands from the root directory

```
$ sudo docker-compose build
$ sudo docker-compose up
```

- To seed the database in the containerized deployment, run the following command from the `/src` folder in the server containerized

```
$npm run seed
```

### License

GNU GPL
