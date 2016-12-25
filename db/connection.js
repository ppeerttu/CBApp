var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://lekhfjdeztwuwi:15298118bf80378a1298a2ba04bb92f71d0063be37d221b4b3b2b39a557044ad@ec2-174-129-37-15.compute-1.amazonaws.com:5432/d5cuqehujl34ri', {
  dialect: 'postgres',
  storage: 'postgres'
});

module.exports = {
  DataTypes: Sequelize,
  sequelize: sequelize
};
