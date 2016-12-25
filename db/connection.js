var Sequelize = require('sequelize');

var sequelize = new Sequelize('cbapp', '', '', {
  dialect: 'sqlite',
  storage: 'db/CBApp.database'
});

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
