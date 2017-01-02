var express = require('express');
var bcrypt = require('../node_modules/bcrypt-nodejs/bCrypt');
var router = express.Router();
var Models = require('../models');

// backend regEx-validation for email
function checkEmail(email) {
    var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regEx.test(email);
}
// backend regEx-validation for password
function checkPassword(pass) {
    var regEx = /(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/;
    return regEx.test(pass);
}
// for developing purposes
/*
router.get('/all', function (req, res, next) {
    Models.User.findAll().then(function(users) {
        res.json(users);
    }).error(function(error) {
        res.send(400).json(error);
    })
})
*/

// authenticating with facebook
// This route makes sure that if the user authenticating via facebook has already registered
// via email, fbId will be updated to the old email-account and it will be used to authenticate
// to the backend
router.post('/fb_authenticate', function (req, res, next) {
    var fbUser = req.body;
    Models.User.findOne({
        where: {
            fbId: fbUser.fbId
        }
    }).then(function (user) {
        if (user) {
            console.log('Fb-user authenticated');
            req.session.userId = user.id;
            user.password = '';
            res.json(user);
        } else {
            Models.User.findOne({
                where: {
                    email: fbUser.email
                }
            }).then(function (user) {
                if (user) {
                    user.update({
                        firstName: fbUser.firstName,
                        lastName: fbUser.lastName,
                        fbId: fbUser.fbId
                    }).then(function (response) {
                        console.log('Userdata connected with Facebook and authenticated');
                        response.password  = '';
                        res.json(response);
                    });
                } else {
                    var abcs = 'abcdefghijklmnopqrstuvwxyzåäöABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ1234567890';
                    var pass = '';
                    for (var i = 0; i < 8; i++) {
                        var index = Math.floor(Math.random() * abcs.length);
                        pass += abcs.charAt(index);
                    }
                    bcrypt.hash(pass, null, null, function (err, hash) {
                        if (err) {
                            console.log(err);
                        } else {
                            fbUser.password = hash;
                            Models.User.create(fbUser).then(function (user) {
                                console.log('Created new user via FB-login with nickname: ' + user.nickname);
                                req.session.userId = user.id;
                                user.password = '';
                                res.json(user);
                            });
                        }
                    });
                }
            });
        }
    });
});

// register new user with email
router.post('/', function (req, res, next) {
    var userToAdd = req.body;
    if (userToAdd.nickname.length < 3 || userToAdd.firstName.length < 2 || !checkEmail(userToAdd.email) || !checkPassword(userToAdd.password)) {
        res.status(400).json({error: 'Userinfo not valid!'});
        return;
    }

    console.log('Attempting to register user with nickname: ' + userToAdd.nickname);

    Models.User.findOne({
        where: {
            $or: [
                {email: userToAdd.email},
                {nickname: userToAdd.nickname}
            ]
        }
    }).then(function (user) {
        console.log('Found: ' + user);
        if (user) {
            res.status(400).json({error: 'Nickname or email already in use!'});
        } else {
            bcrypt.hash(userToAdd.password, null, null, function (err, hash) {
                if (err) {
                    console.log(err);
                } else {
                    userToAdd.password = hash;
                    console.log("Created passHash: " + hash);
                    userToAdd.fbId = 'not_set';
                    Models.User.create(userToAdd).then(function (added) {
                        console.log("User added with nickname: " + added.nickname);
                        added.password = '';
                        res.json(added);
                    });
                }
            });
        }
    });

});

// checking login authentication
router.post('/authenticate', function (req, res, next) {
    var userToCheck = req.body;
    Models.User.findOne({
        where: {
            email: userToCheck.email
        }
    }).then(function (user) {
        if (user) {
            bcrypt.compare(userToCheck.password, user.password, function (err, ans) {
                if (ans) {
                    console.log("User logged in with nickname: " + user.nickname);
                    req.session.userId = user.id;
                    user.password = '';
                    res.json(user);
                } else {
                    res.status(400).json({error: 'Wrong password!'});
                }
            });
        } else {
            res.status(400).json({error: 'Wrong email and password!'});
        }
    });
});

// get current credentials
router.get('/current-auth', function (req, res, next) {
    var loggedInId = req.session.userId ? req.session.userId : null;
    if (loggedInId === null) {
        res.json({});
    } else {
        Models.User.findOne(loggedInId).then(function (loggedIn) {
            res.json({
                firstName: loggedIn.firstName,
                lastName: loggedIn.lastName,
                nickname: loggedIn.nickname,
                email: loggedIn.email,
                id: loggedIn.id,
                fbId: loggedIn.fbId
            });
        });
    }
});

// log user out
router.get('/logout', function (req, res, next) {
    console.log("UserId " + req.session.userId + " session stopped");
    req.session.userId = null;
    res.sendStatus(200);
});

// update password and nickname
router.put('/update', function (req, res, next) {
    var toUpdate = req.body;
    console.log('toUpdate: ' + toUpdate.id + ' + ' + toUpdate.nickname);
    //validating update info
    if (toUpdate.nickname.length < 3 || !checkPassword(toUpdate.password)) {
        res.status(404).json({error: 'Password or nickname do not meet requirements!'});
    }
    Models.User.findOne({
        where: {
            nickname: toUpdate.nickname
        }
    }).then(function(user) {
        if (user === null || user.id === toUpdate.id) {
                var pass = toUpdate.password;
                console.log('Going to hash');
                bcrypt.hash(pass, null, null, function (err, hash) {
                    if (err) {
                        console.log(err);
                        res.status(400).json({error: 'Error occurred while creating passhash: ' + err});
                    } else {
                        toUpdate.password = hash;
                        console.log('Created hash: ' + toUpdate.password);
                        Models.User.update({
                            nickname: toUpdate.nickname,
                            password: toUpdate.password
                        },{
                            where: {
                                id: toUpdate.id
                            }
                        }).then(function (response) {
                            if (response[0] === 0) {
                                res.status(400).json({error: "Update failed!"});
                            } else {
                                Models.User.findOne(toUpdate.id).then(function(resUser) {
                                    resUser.password = '';
                                    res.json(resUser);
                                });
                            }
                        });
                    }
                });
        } else if (user) {
            res.status(400).json({error: "Nickname not available!"});
        } else {
            res.status(400).json({error: "Error occurred while updating info!"});
        }
    })

});

module.exports = router;
