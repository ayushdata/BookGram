const { request } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const requireLogin = require('../middleware/requireLogin')

// List all the posts made by any user
router.get('/allposts', requireLogin, (req, res) => {
    Post.find()
    .populate('postedBy', "_id name")
    .populate('comments.postedBy', "_id name")
    .then(posts => {
        res.json({posts})
    })
    .catch((err) => {
        console.log("error")
    })
})

// Listing all posts made by user
router.get('/myposts', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate('postedBy', "_id name")
    .then(myposts => {
        res.json({myposts})
    })
    .catch((err) => {
        console.log("error")
    })
})

// Creating a new post
router.post('/createpost', requireLogin, (req, res) => {
    const {title, body, photo} = req.body
    console.log(title, body, photo)
    if (!title || !body || !photo){
        return res.status(422).json({error: "Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})

// Deleting a post
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err, post) => {
        if (err || !post){
            return res.status(422).json({error: err})
        }
        if (post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            })
            .catch(err => {
                console.log(err)
            })
        }
    })
})

// Like a post
router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {likes: req.user._id}
    }, {
        new: true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err){
            return res.status(422).json({error: err})
        } else{
            return res.json(result)
        }
    })
})

// Unlike a post
router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
            $pull: {likes: req.user._id}
        }, {
            new: true
        }
    )
    .populate("comments.postedBy","_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err){
            return res.status(422).json({error: err})
        } else{
            return res.json(result)
        }
    })
})

// Commenting on a post
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
            $push: {comments: comment}
        }, {
            new: true
        }
    )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err){
            return res.status(422).json({error: err})
        } else{
            return res.json(result)
        }
    })
})

// Deleting a comment
router.delete('/deletecomment/:postId/:commentId', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
        {_id: req.params.postId},
        {$pull: {'comments': {_id: req.params.commentId}}},
        {
            new: true
        }
    ).populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
        if (err || !result){
            return res.status(422).json({error: err})
        }
        res.json(result)
    })
})

module.exports = router