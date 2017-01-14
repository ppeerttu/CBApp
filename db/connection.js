var Sequelize = require('sequelize');
/* FOR POSTGRESQL DATABASE
var sequelize = new Sequelize('', {
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
