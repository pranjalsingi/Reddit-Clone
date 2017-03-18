var express = require('express');
var router  = express.Router();

var Topic   = require('../models/topic');
var Post    = require('../models/post');
var Comment = require('../models/comment');
var User    = require('../models/user');
var Verify  = require('./verify');


router.use(function(req, res, next){
    console.log("reached here in router use");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Access-Token");
    next();
});

// Retrieve topic on basis of topicid
router.param('topicid', function(req, res, next, id){
    var query = Topic.findById(id);
    query.exec(function(err, topic){
        if(err){ return next(err); }
        if(!topic) { return next(new Error("Could not find the topic")); }
        
        req.topic = topic;
        return next();
    });
});

// Retrieve post on basis of postid
router.param('postid', function(req, res, next, id){
    var query = Post.findById(id);
    query.exec(function(err, post){
        if(err){ return next(err); }
        if(!post){ return next(new Error("Could not find the post")); }
        
        req.post = post;
        return next();
    });
});

// Retrieve comment on basis of commentid
router.param('commentid', function(req, res, next, id){
    var query = Comment.findById(id);
    query.exec(function(err, comment){
        if(err) { return next(err); }
        if(!comment){ return next(new Error("Could not find the comment")); }
        
        req.comment = comment;
        return next();
    });
});

router.get('/', function(req, res){
    res.json({message:"Hooray , I got this message"});
});


router.route('/topics')
    .post(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'Moderator'){
            var topic = new Topic(req.body);
            
            topic.save(function(err, topic){
                if(err){
                    res.send(err);
                }
                
                res.json(topic);
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    })
    
    .get(Verify.verifyOrdinaryUser, function(req, res){
        Topic.find(function(err, topics){
            if(err){
                res.send(err);
            }
            
            res.json(topics);
        });
    });
    
router.route('/topics/:topicid')
    .get(Verify.verifyOrdinaryUser, function(req, res){
        req.topic.populate('posts', function(err, topic){
            if(err){ return res.send(); }
            res.json(topic);
        });
    })
    
    .put(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'Moderator'){
            req.topic.name = req.body.name;
            req.topic.author = req.body.author;
            req.topic.save(function(err, topic){
                if(err){ res.send(); }
                res.json(topic);
            });
        }
       else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    })
    
    .delete(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'Moderator'){
            Topic.remove({ _id: req.params.topicid }, function(err, topic){
                if(err){
                    res.send();
                }
                res.json(topic);
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    });
    
// For upvote of a topic
router.route('/topics/:topicid/vote')
    .put(Verify.verifyOrdinaryUser, function(req, res){
        req.topic.vote(function(err, topic){
            if(err){ res.send(err); }
            res.json(topic);
        });
    });
    
router.route('/topics/:topicid/post')
    .post(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'Author'){
            var post = new Post(req.body);
            post.topic = req.topic;
            
            post.save(function(err, post){
                if(err){ return res.send(err); }
                req.topic.posts.push(post);
                req.topic.save(function(err, topic){
                    if(err) { return res.send(err); }
                    res.json(post);
                });
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    });
    
router.route('/topics/:topicid/post/:postid')
    .get(Verify.verifyOrdinaryUser, function(req, res){
        req.post.populate('comments', function(err, post){
            if(err){ return res.send(); }
            
            res.json(post);
        });
    })
    
    .put(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'Author'){
            req.post.title = req.body.title;
            req.post.link = req.body.link;
            req.post.author = req.body.author;
            req.post.save(function(err, post){
                if(err){ return res.send(); }
                res.json(post);
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    })
    
    .delete(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'Author'){
            Post.remove({_id: req.params.postid}, function(err, post){
                if(err){ return res.send(err); }
                res.json({ message: "Post Deleted" });
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    });
    
router.route('/topics/:topicid/post/:postid/vote')
    .put(Verify.verifyOrdinaryUser, function(req, res){
        req.post.vote(function(err, post){
           if(err){ return res.send(err); }
           res.json(post);
        });
    });
    
router.route('/topics/:topicid/post/:postid/comment')
    .post(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'User'){
            var comment = new Comment(req.body);
            comment.topic = req.topic;
            comment.post = req.post;
            
            comment.save(function(err, comment){
                if(err) { return res.send(err); }
                
                req.post.comments.push(comment);
                req.post.save(function(err, post){
                    if(err){ return res.send(err); }
                    res.json(comment);
                });
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    });
    
router.route('/topics/:topicid/post/:postid/comment/:commentid')
    .put(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'User'){
            req.comment.body = req.body.body;
            req.comment.author = req.body.author;
            
            req.comment.save(function(err, comment){
                if(err){ return res.next(err); }
                res.json(comment);
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    })
    
    .delete(Verify.verifyOrdinaryUser, function(req, res){
        if(req.decoded._doc.role == 'Admin' || req.decoded._doc.role == 'User'){
            Comment.remove({ _id: req.params.commentid }, function(err, comment){
                if(err){ return res.next(err); }
                res.json(comment);
            });
        }
        else{
            var err = new Error("Permission denied");
            err.status = 403;
            res.send(err);
        }
    })
    
router.route('/topics/:topicid/post/:postid/comment/:commentid/vote')
    .put(Verify.verifyOrdinaryUser, function(req, res){
        req.comment.vote(function(err, comment){
           if(err) { return res.send(err); }
           res.json(comment);
        });
    });
    
module.exports = router;
