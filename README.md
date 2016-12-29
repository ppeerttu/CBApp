# CBApp
An AngularJS -based web application with simple NodeJS backend

Author Perttu Kärnä
perttu.karna@gmail.com


## About
This web-app is made as hobby to improve web-developing skills and deepen my understanding of basic tools for both front- and 
backend developing. Currently this app is running on heroku url: https://arcane-beyond-54795.herokuapp.com/#/login and it provides
simple chat functionality with different rooms user can join and create. In the future there might be kind of a blog service as
well.


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
Contains seed.js for Postgres database initialization. 
