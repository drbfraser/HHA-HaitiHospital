# CMPT 373 Haumea: HHA Database and Form Entry

This is the CMPT 373 Haumea's team project for Hope Health Action. This project is intended to support database management, and registration for HHA internal use. The project is utilizing a MERN Boilerplate to meet the clients needs/requirements(boilerplate can be found here: https://github.com/nemanjam/mern-boilerplate). The project currently contains basic database insertion/display, and basic webpage navigation.

## Demo

The Demo of the project can be viewed using this link: http://142.58.21.74:3000/home
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
- navigate to the project root folder
- navigate to ./server/security and add an SSL key: 
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout cert.key -out cert.pem -config req.cnf 
-sha256
```
- navigate back out into server
- run the following:
```
$ npm install
$ npm run build
```
- Expect an error during npm run build. Copy the security and public folder into /dist with:
```
$ cp -R /security /dist
$ cp -R /public /dist
```
- Run the build command to ensure that it is built properly and run the server:
```
$ npm run build
$ npm run start-dev
```

### Client Setup
- Navigate to the /client folder from the root
- Run the following commands to install dependencies and start the client
```
$ npm install
$ npm start
```
