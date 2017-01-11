
// SEEDFILE FOR POSTGRESQL

var Database = require('./connection');

var User = Database.sequelize.define('User', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fbId: Database.DataTypes.STRING,
  firstName: Database.DataTypes.STRING,
  lastName: Database.DataTypes.STRING,
  email: Database.DataTypes.STRING,
  nickname: Database.DataTypes.STRING,
  password: Database.DataTypes.STRING
});


var Message = Database.sequelize.define('Message', {
  id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: Database.DataTypes.TEXT
});


var Room = Database.sequelize.define('Room', {
    id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: Database.DataTypes.STRING
});

var Post = Database.sequelize.define('Post', {
    id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: Database.DataTypes.STRING,
    comImg: Database.DataTypes.STRING,
    content: Database.DataTypes.TEXT
});

var Reply = Database.sequelize.define('Reply', {
    id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: Database.DataTypes.TEXT
})

Message.belongsTo(User);
Message.belongsTo(Room);

User.hasMany(Post);
User.hasMany(Reply);
User.hasMany(Message);

Post.hasMany(Reply);
Post.belongsTo(User);

Reply.belongsTo(User);
Reply.belongsTo(Post);

Room.hasMany(Message);

Database.sequelize.sync();
