# CBApp
An AngularJS -based web application with simple NodeJS backend

**ARCHIVED**

This application has been made as a hobby and is no longer under development.

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
* Bootstrap 3 (about to migrate to 4 in future)
* Facebook SDK for JavaScript
* Trumbowyg
* Less

## To get this project run locally

### Prerequisites:
* Node package manager installed
* Bower installed

### Todo

1. Get the project to your local environment for example by:
    * Fork project to your git repository
    * Clone the project to your chosen path with `git clone YOUR_FORK_PROJECT_REPO_URL`
2. Run `npm install` and `bower install` in project root
3. Edit Facebook SDK's initialization script in file /public/index.html by placing your Facebook app's id
to the `appId`-field
4. Start the server with `node bin/www` at project root
5. Application should now be available at localhost:3000


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

*Renders homepage*
* users.js

*Contains API-calls for user management - such as registering, loggin in and checking current authentication.*
* rooms.js

*Contains API-calls for room management - such as creating and getting rooms. Also Socket.io backend is stored there.*
* posts.js
*Contains API-calls for blog post management - such as creating, getting and deleting posts.*

#### /utils
* authentication.js

*This file contains method to check user's authentication - used in calls in route /rooms for example.*

#### /views
Contains two files:
* index.jade

*Imports index.html*
* error.jade

*Empty file at the moment.*

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
Frontend is located in /public and uses AngularJS as core application.

#### /public
* app -folder
* bower_components -folder
* index.html

*Contains basic elements of application UI, single-page contents locate at /public/app/views*
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

*Provides model for livechat, uses APIService and Socket -service to get and create chatrooms and chat messages. Facebook's SDK provides
possibility for adding profilephoto in chat's participants -view.*
* mainController.js

*Controls main view, i.e. requests recent blogposts*
* userController.js

*Provides model for creating new user via email and Facebook, and logging user in both ways.*
* profileController.js

*For user data management - change nickname and password, view FB-profilephoto, list own blogposts*
* blogController.js

*Provides feature to view (and delete own) blogposts and also lists most recent posts and user's posts in Blog/Main -view*

* markdownController.js

*Provides tools for creating blogpost: user can write post with Trumbowyg-markdown editor and view it before posting*

##### /public/app/services
* APIService.js

*This service communicates with backend API - contains all the $http get and post methods.*
* socket.js

*This factory works as a service to communicate with backend socket.io.*

##### /public/app/styles

* styles.css

*Customized styles for Bootstrap elements and some own classes*

* lessStyles.css

*Generated classes with Less*

* style.lessStyles

*Generation for Less -compiler*

##### /public/app/views
* about.html

*Contains information about this application.*
* chat.html

*Contains view for chat feature.*
* login.html

*Contains view for login form.*
* register.html

*Contains view for register form.*
* main.html

*Contains currently greeting for user and lists recent blog posts*
* profile.html

*Displays user's info, allows to change some of it*

* blogpost.html

*Shows posts*

* createpost.html

*Contains markdown editor*

* mainblogs.html

*List most recent posts and user's own posts*

##### app.js
Contains configuration for app - such as config -module for single-page routing and run -module.

##### app.min.js
Contains all JavaScript code in /public/app -folder in minified form.

## Known issues

As you can see when looking into the code or using the running app, this project is still in development and probably
will never be finished. Here is some of the bugs

### Backend pass creation for Facebook user -- FIXED


### No opportunity to change user info -- IMPROVED

IMPROVED: Users can now change password and nickname.

### No opportunity to search blogposts or view some older posts -- IMPROVED

IMPROVED: Opportunity to search posts.

### Participants -elements render sometimes poorly in chatroom -- FIXED


### No events or notifications

If someone comments your post, you do not get any notification at this point. Some improvement might be coming up.
