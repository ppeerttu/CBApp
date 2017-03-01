var express = require('express');
var router = express.Router();
var Models = require('../models');
var authenticate = require('../utils/authentication');


/* For developing purposes
router.get('/', function(req, res, next) {
    Models.Post.findAll().then(function(posts) {
        res.json(posts);
    }).error(function(error) {
        res.send(400).json({error: 'Something went wrong while getting all posts!'});
    });
});
*/

// create new post
// POST /posts/create
router.post('/create', authenticate, function(req, res, next) {
    if (req.body.title.length < 100) {
        Models.Post.create(req.body).then(function (post) {
            res.sendStatus(200);
        }).error(function (error) {
            res.send(400).json({error: 'Something went wrong while creating new post!'});
        });
    } else {
        res.send(400).json({error: 'Error while creating post: title too long!'});
    }
});


// get user's posts
// GET /posts/user/{user-id}
router.get('/user/:id', authenticate, function(req, res, next) {
    var userId = req.params.id;
    Models.Post.findAll({
        where: {
            UserId: userId
        },
        include: {
            model: Models.User,
            attributes: ['id', 'firstName', 'lastName', 'nickname']
        }
    }).then(function (posts) {
        res.json(posts);
    }).error(function (error) {
        console.log(error);
        res.send(400).json({error: "Something went wrong while getting user's posts!"});
    });
});


// get particular post
// GET /posts/{user-id}/{id}
router.get('/post/:userId/:id', function(req, res, next) {
    var userId = req.params.userId;
    var postId = req.params.id;
    Models.Post.findOne({
        where: {
            id: postId,
            UserId: userId
        },
        include: [{
            model: Models.User,
            attributes: ['id', 'firstName', 'lastName', 'nickname']
        }, {
            model: Models.Reply,
            include: {
                model: Models.User,
                attributes: ['id', 'firstName', 'lastName', 'nickname']
            }
        }]
    }).then(function (post) {
        res.json(post);
    }).error(function (error) {
        console.log(error);
        res.send(400).json({error: 'Something went wrong while getting that particular post!'});
    });
});


// delete post
// DELETE /posts/{id}
router.delete('/:id', authenticate, function(req, res, next) {
    var postId = req.params.id;
    Models.Post.destroy({
        where: {
            id: postId
        }
    }).then(function (result) {
        if (result > 0) {
            console.log('Destroyed ' + result + ' rows');
            res.sendStatus(200);
        } else {
            res.send(400).json({error: 'Such post was not found in database!'});
        }
    }).error(function (error) {
        console.log(error);
        res.send(400).json({error: 'Something went wrong while destroying this particular post!'});
    });
});


// get most recent posts
// GET /posts/recent
router.get('/recent', authenticate, function(req, res, next) {
    Models.Post.findAll({
        where: {
            createdAt: {
                $lte: new Date(),
                $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
            }
        }, include: {
            model: Models.User,
            attributes: ['id', 'firstName', 'lastName', 'nickname']
        }
    }).then(function (posts) {
        if (posts.length > 5) {
            posts.splice(0, posts.length - 5);
        }
        res.json(posts);
    }).error(function (error) {
        res.send(400).json({error: 'Something went wrong while getting recent posts!'});
    });
});

// post new reply to post
// POST /{id}/reply
router.post('/:id/reply', authenticate, function(req, res, next) {
    var replyToAdd = req.body;
    console.log('Reply to add: ' + replyToAdd);
    Models.Reply.create(replyToAdd).then(function (reply) {
        res.sendStatus(200);
    }).error(function (error) {
        console.log(error);
        res.send(400).json({error: 'Something went wrong while creating reply!'});
    });
});

// search for blogposts with searchTerm
// GET /search/{term}
router.get('/search/:term', function(req, res, next) {
    var searchTerm = req.params.term;
    console.log('posts/search/:term ' + searchTerm);

    Models.Post.findAll({
      where: {
        $or: [
          { 'title': { like: '%' + searchTerm + '%' } },
          { 'content': { like: '%' + searchTerm + '%' } }
        ]
      },
      include: {
          model: Models.User,
          attributes: ['id', 'nickname', 'firstName', 'lastName']
       }
    }).then(function (reply) {
        res.json(reply);
    }).error(function (error) {
        console.log(error);
        res.sendStatus(400).json({error: 'Something went wrong while searching for posts!'});
    });
});


module.exports = router;
