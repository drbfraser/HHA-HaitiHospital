# CMPT 415 Haumea: HHA Internal Project Continuation

This is the CMPT 373 Haumea's team project for Hope Health Action (HHA). It is a web application aimed at providing HHA a digital portal for collecting and managing data in the fields. The project is
uses the MERN stack and was built off of a [boilerplate project](https://github.com/nemanjam/mern-boilerplate).

This project is currently being managed by CMPT 415 Spring 2022 team with the aim to deploy it for real world use.

#### [More information about the project is available here](https://docs.google.com/document/d/1JG4cK-soyS3thzk-ZJnUyMR3XHxJoLA5gg7Uk1v1aFk/edit?usp=sharing)

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

The Demo of the project can be viewed using this link: http://142.58.21.74:3000/ Please keep in mind that the VPN must be used to view the application.

## Directory Structure

The Directory can be split into client and serverside. Here are a few important locations:

#### Serverside

- /server/src contains resources to database models(/models), routes and API calls(/routes), JSON test entries(/tests), and other backend code.

#### Clientside

- /server/src contains resources to react components(/components), index file(index.ts), and other frontend code

# Devs Build Instructions

This instruction is intended for people looking to setup a development enviroment.

### Install Node.js

- Install the latest version [here](https://nodejs.org). LTS is preferred

### Install MongoDB

- For MacOS, follow the instructions from this link:
  - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
- For Windows:
  - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- MongoDB Compass (Optional):
  - MongoDB Compass provides a GUI for MongoDB:
    - https://www.mongodb.com/try/download/compass

### Setup Process Enviroments

You will need to specify process enviroment variables specific to your setup. Navigate to the server folder and create a `.env` file. You can use the following default values:

```
# MongoDB URI. Defaults to port is usually 27017.
MONGO_URI=mongodb://localhost:27017/

# REQUIRED - Secret used to generate JWT tokens
JWT_SECRET=sauce

# The React client host. For development this would be your React devlopment server. The default port is usually 3000
CORS=http://localhost:3000

# Server configs
SERVER_PORT=5000

# REQUIRED - The server will seed users into db with this password.
SEED_PWD=catdog
```

### Starting the server

- navigate into into /server folder from the root directory
- run the following:

```
$ npm install
$ npm run dev-start
```

### Starting the client

- Navigate to the /client folder from the root directory
- Run the following commands to install dependencies and start the client

```
$ npm install
$ npm start
```

### Known Issues

- If there are issues with npm dependencies when running npm install, run the following line:

```
$ npm i --legacy-peer-deps install
```

## Validate

The web app should now be accessible at your React dev server, the default is http://localhost:3000.

The seeded users are:

- Role: Admin
  - Username: user0
- Role: Medical Director
  - Username: user1
- Role: Head of Department
  - Username: user2
- Role: User
  - Username: user3 to user6

Their passwords are as defined in your `.env`.

## Other Instructions

### Prettier Setup

We use prettier as our code formatter. Once setup, saving a file will automatically format the code.

- Install Prettier as a VSCode extension
- Mavigate to the root of the project
- Run:

```
$ npm install --global prettier
$ prettier --write
```

This will install and use prettier on the whole directory.

### Docker Setup

- To run the docker containers, run the following commands from the root directory

```
$ sudo docker-compose build
$ sudo docker-compose up
```

### License

GNU GPL
