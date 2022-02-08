# CMPT 373 Haumea: HHA Internal Project

This is the CMPT 373 Haumea's team project for Hope Health Action. This project is intended to support database management, and registration for HHA internal use. The project is utilizing a MERN
Boilerplate to meet the clients needs/requirements(boilerplate can be found here: https://github.com/nemanjam/mern-boilerplate). In the final iteration for the current CMPT 373 fall term, the project
has built off the previous iteration, fleshing out concepts and ensuring smooth interface interactions.

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

## Build/Dependencies Initialization and Run Instructions

### Prequisites

- We assume Node has already been installed
  - If not, download and install here: https://nodejs.org/en/download/

### Database Setup

- Assuming you do not have MongoDB set up on your computer, follow the instructions to set it up
  - For MacOS, follow the instructions from this link:
    - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
  - For Windows:
    - https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
- (Recommended)
  - Download MongoDB Compass to view database records:
    - https://www.mongodb.com/try/download/compass

### Server Setup

- navigate into into /server folder from the root directory
- run the following:

```
$ npm install
$ npm run dev-start
```

### Client Setup

- Navigate to the /client folder from the root directory
- Run the following commands to install dependencies and start the client

```
$ npm install
$ npm start
```

### Known Issues

- If there are issues with npm dependencies when running npm install, run the following line:

```
$ npm i --legacy-peer-deps
```

### Prettier Setup

- Install Prettier as a VSCode extension
- Navigate to the root directory
- Run the following commands to install and use prettier on the whole directory
- Pressing CTRL S in a file will run prettier on that single file

```
$ npm install --global prettier
$ prettier --write
```

### Docker Setup

- To run the docker containers, run the following commands from the root directory

```
$ sudo docker-compose build
$ sudo docker-compose up
```

### Using the System

- Seeded User Credentials:
  - Role: Admin
    - Username: user0
    - Password: 123456789
  - Role: Medical Director
    - Username: user1
    - Password: 123456789
  - Role: Head of Department
    - Username: user2
    - Password: 123456789
  - Role: User
    - Username: user3
    - Password: 123456789

### License

GNU GPL
