# CMPT 373 Haumea: HHA Database and Form Entry

This is the CMPT 373 Haumea's team project for Hope Health Action. This project is intended to support database management, and registration for HHA internal use. The project is utilizing a MERN Boilerplate to meet the clients needs/requirements(boilerplate can be found here: https://github.com/nemanjam/mern-boilerplate). The project currently contains Database support for departments, users, reports, and messages, and houses a clean and improved UI. 

### Additional features have been added for the second iteration, such as:
- Message board (viewing and adding messages)
- Interface overhaul
- Sidebar navigation
- Login with JWT authentication
- Case Studies (viewing)

### Some features have been improved, such as:
- Improved report-list and report viewing
- Improved Report, Message, and User API
- Improved report entry
- Improved homepage
- Improved website navigation


## Demo

The Demo of the project can be viewed using this link: http://142.58.21.74:3000/
Please keep in mind that the VPN must be used to view the application(there are some known issues with the VPN currently).

## Directory Structure

The Directory can be split into client and serverside. Here are a few important locations:
#### Serverside
- /server/src contains resources to database models(/models), routes and API calls(/routes), and JSON test entries(/tests). 
- /server/security contains the SSL security protocols(certificate information)
#### Clientside
- /server/src contains resources to react components(/components), and index file(index.ts)

## Build/Dependencies Initialization and Run Instructions

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
