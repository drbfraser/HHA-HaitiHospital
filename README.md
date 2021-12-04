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
