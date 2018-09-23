Email Server
===
* Send emails to multiple addresses using sendgrid API<br />
* Blacklist components allows adding emails you don't want to have the ability to send<br />
* MongoDB for database to check upon banned users<br />
* Node JS & express for handling http requests<br />
Assumptions
* Only storing banned users, not the contents of the email one sends<br />
Steps Required
1. Create a dev.js file inside of config with the following inside module.exports<br />
* mongoURI<br />
* sendGridKey <br />
2. In the terminal execute <br />
```
npm install
nodemon
```
