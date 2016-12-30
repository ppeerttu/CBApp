# CBApp
An AngularJS -based web application with simple NodeJS backend

Author Perttu Kärnä
perttu.karna@gmail.com


## About
This web-app is made as hobby to improve web-developing skills and deepen my understanding of basic tools for both front- and 
backend developing. Currently this app is running on heroku url: https://arcane-beyond-54795.herokuapp.com/#/login and 
it providessimple chat functionality with different rooms user can join and create. In the future there might be kind of a
blog service as well.


## Techs

### Backend:
* NodeJS
* Express
* Sequelize
* SQLite as local dev database - Postgres in Heroku
* bCrypt
* Socket.io

### Frontend:
* AngularJS
* jQuery
* Bootstrap
* Facebook SDK for JavaScript


## Structure

### Backend
The backend for this application is provided with NodeJS and Express, using Sequelize library and SQLite (Postgres in Heroku) as handling database. Socket.io provides live-chat features. Filestructure below explains more about solutions for backend.

#### /bin
Contains www.js for starting HTTP server, setting port, ip etc.

#### /db
Contains seed.js for Postgres database initialization and connection.js for connecting Sequelize with database.

#### /models
index.js contains datatypes for database and relations between datatypes.

#### /node_modules
Contains all node modules, such as Express, bCrypt and so on.

#### /routes
Contains express routes:
* index.js
Renders homepage
* users.js
Contains API-calls for user management - such as registering, loggin in and checking current authentication.
* rooms.js
Contains API-calls for room management - such as creating and getting rooms. Also Socket.io backend is stored there.

#### /utils
* authentication.js
This file contains method to check user's authentication - used in calls in route /rooms for example.

#### /views
Contains two files:
* index.jade
Imports index.html
* error.jade
Empty file at the moment.

#### .bowerrc

#### Gruntfile.js
Contains configuration for Grunt tasks.

#### Procfile
For deploying app in heroku.

#### app.js
For generating backend -app, importing necessary stuff in it and configuring errorhandlers.

#### bower.json
Configuring Bower dependencies.

#### package.json
Configuring NodeJS dependencies.


### Frontend

#### /public
* app -folder
* bower_components -folder
* index.html contains basic elements of application UI, single-page contents locate at /public/app/views
* favicon.ico

#### /public/bower_components
Contains front-end frameworks and tools such as AngularJS and jQuery files.

#### /public/app
* controllers -folder
* services -folder
* styles -folder
* views -folder

##### /public/app/controllers
* chatController.js
Provides model for livechat, uses APIService and Socket -service to get and create chatrooms and chat messages. Facebook's SDK provides 
possibility for adding profilephoto in chat's participants -view.
* mainController.js
Provides model for viewing simple userdata, such as full name, nickname and profilephoto for Facebook users.
* userController.js
Provides model for creating new user via email and Facebook, and logging user in both ways.

##### /public/app/services
* APIService.js
This service communicates with backend API - contains all the $http get and post methods.
* socket.js
This factory works as a service to communicate with backend socket.io.

##### /public/app/styles

* styles.css
Added few lines of customized style for couple elements.

##### /public/app/views
* about.html
Contains information about this application.
* chat.html
Contains view for chat feature.
* login.html
Contains view for login form.
* register.html
Contains view for register form.
* main.html
Contains currently view for single jumbotron - might grow up pretty much in the future.
* profile.html
Displays user's info

##### app.js
Contains configuration for app - such as config -module for single-page routing and run -module.

##### app.min.js
Contains all JavaScript code in /public/app -folder in minified form.

## Known issues

As you can see when looking into the code or using the running app, this project is still badly in development and probably
never will be finished. Two badly executed behaviours still do stand out of the app:

### Backend pass creation for Facebook user

No unique password will be generated for Facebook user - instead same password will be set for all Facebook users.
This flaw will be taken care of as soon as I can.

### No opportunity to change user data

Currently backend doesn't provide an opportunity for frontend to post any kind of change to the user's data.
