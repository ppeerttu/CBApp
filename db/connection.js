var Sequelize = require('sequelize');
/* FOR POSTGRESQL DATABASE */
var sequelize = new Sequelize('postgres://wzdpolrthisfoi:00375316fb321210f03603987e96d84dcb8d4d9fe72d601f5f61d517ce68af3f@ec2-54-235-173-161.compute-1.amazonaws.com:5432/d3ci3beb4kh7it', {
  dialect: 'postgres',
  protocol: 'postgres'
});

/* FOR LOCAL DEVELOPMENT
var sequelize = new Sequelize('cbapp', '', '', {
  dialect: 'sqlite',
  storage: 'db/CBApp.database'
});*/

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
