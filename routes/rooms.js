
module.exports = function (io) {
    var express = require('express');
    var router = express.Router();

    var authentication = require('../utils/authentication');
    var Models = require('../models');

//adding new room
// POST /rooms
    router.post('/', authentication, function (req, res, next) {
        var roomToAdd = req.body;
        Models.Room.create(roomToAdd).then(function (room) {
            res.json(room);
        });
    });

// getting all rooms
// GET /rooms
    router.get('/', authentication, function (req, res, next) {
        Models.Room.findAll().then(function (rooms) {
            res.json(rooms);
        });
    });

// getting room with :id
// GET /rooms/:id
    router.get('/:id', authentication, function (req, res, next) {
        var roomId = req.params.id;
        Models.Room.findOne(roomId).then(function (room) {
            res.json(room);
        });
    });

// socket.io functionality
    io.on('connection', function (socket) {

        // JOINING ROOM
        socket.on('room:join', function (req) {
            var id = socket.id;
            socket.join(req.RoomId);
            io.to(req.RoomId).emit('user:join', {nickname: req.nickname, fbId: req.fbId, id: req.id});
            io.to(req.RoomId).emit('get:users', {SocketId: id});
        });

        // SENDING NICKNAME AND FBID FOR USER JOINING IN ROOM
        socket.on('get:user', function (req) {
            console.log(req.SocketId + ' + normal id : ' + socket.id);
            if (req.SocketId !== socket.id) {
                console.log('broadcasting nickname and fbid for user joining in room');
                socket.broadcast.to(req.SocketId).emit('add:user', req);
            }
        });

        // SENDING MESSAGE IN ROOM
        socket.on('room:sent', function (req) {
            var messageToAdd = {content: req.content};
            messageToAdd.UserId = req.UserId;
            messageToAdd.RoomId = req.RoomId;
            Models.Message.create(messageToAdd).then(function (message) {
                io.to(message.RoomId).emit('send:message', {
                    nickname: req.nickname,
                    content: message.content,
                    createdAt: message.createdAt
                });
            });
        });
        
        // SOMEONE ADDED NEW ROOM
        socket.on('new:room', function(req) {
            io.emit('refresh:rooms');
        });

        //LEAVING ROOM
        socket.on('room:leave', function (req) {
            socket.leave(req.RoomId);
            console.log('User left');
            io.to(req.RoomId).emit('user:left', {nickname: req.nickname, id: req.id});
        });
    });


    return router;
};
