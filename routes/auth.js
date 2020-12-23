const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')
const { JWT_SECRET } = require("../config/keys")
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req, res) => {
    res.send("hello user")
})

router.post('/signup', (req, res) => {
    const {name, email, password, profilePic} = req.body
    if (!email || !name || !password){
        return res.status(422).json({error: "Please input all the fields"})
    }
    User.findOne({email: email})
    .then((savedUser) => {
        if (savedUser){
            return res.status(422).json({error: "User already exists with this email"})
        }
        bcrypt.hash(password, 10)
        .then(hashedpassword => {
            const user = new User({
                email,
                name,
                password: hashedpassword,
                profilePic
            })
            user.save()
            .then(user => {
                res.json({message: "Saved Successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/signin', (req, res) => {
    const {email, password} = req.body;
    if (!email || !password){
        res.status(422).json({error: "Please input Username/Password"})
    }
    User.findOne({email: email})
    .then(savedUser => {
        if (!savedUser){
            return res.status(422).json({error: "Invalid Email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if (doMatch){
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email, profilePic, followers, following} = savedUser
                res.json({token, user: {_id, name, email, profilePic, followers, following}})
            }
            else{
                return res.status(422).json({error: "Invalid Email or password"})
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
})

module.exports = router