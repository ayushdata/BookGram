const { request } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:userid', requireLogin, (req, res) => {
    User.findOne({_id: req.params.userid})
    .select("-password")
    .then(user => {
        Post.find({postedBy: req.params.userid})
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
            if (err){
                return res.status(422).json({error: err})
            }
            return res.json({user, posts})
        })
    })
    .catch(err => {
        return res.status(404).json({error: "User not found"})
    })
})


router.put('/follow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {
        new: true
    }, (err, result) => {
        if (err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.followId}
        }, {
            new: true
        }).select("-password")
        .then(result => {
            return res.json(result)
        }).catch(err => {
            return res.status(422).json({error: err})
        })
    })
})

router.put('/unfollow', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    }, {
        new: true
    }, (err, result) => {
        if (err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.unfollowId}
        }, {
            new: true
        }).select("-password")
        .then(result => {
            return res.json(result)
        }).catch(err => {
            return res.status(422).json({error: err})
        })
    })
})

router.put('/updateprofilepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: {profilePic: req.body.profilePic}
    }, {
        new: true
    }).select("-password")
    .then(result => {
        return res.json(result)
    })
    .catch(err => {
        return res.status(422).json({error: "Profile Picture not found"})
    })
})

module.exports = router