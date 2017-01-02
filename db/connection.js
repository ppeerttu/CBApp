var Sequelize = require('sequelize');
/* FOR POSTGRESQL DATABASE 
var sequelize = new Sequelize('postgres://abajeoneynnezq:77960af7b420a65441cfdb75a2cdeb22eaf7d686f7be725326b7a1b980b08ef9@ec2-54-243-38-139.compute-1.amazonaws.com:5432/d7m432pddc2780', {
  dialect: 'postgres',
  protocol: 'postgres'
});*/

/* FOR LOCAL DEVELOPMENT*/
var sequelize = new Sequelize('cbapp', '', '', {
  dialect: 'sqlite',
  storage: 'db/CBApp.database'
});

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
