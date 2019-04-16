const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user');

//Create user
router.post('/', (req, res) => {
    User.find({username: req.body.username, email: req.body.email})
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                success: false,
                message: "User exists!"
            });
        }

        return bcrypt.hash(req.body.password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: req.body.name,
                surname: req.body.surname,
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email
            });
            return user.save();
        })
        .then(result => {
            res.status(200).json({success: true, message: "", user: result});
        });
    }).catch(err => console.log(err));
});

//login
router.post('/login', (req, res) => {
    let u;
    User.findOne().or([{ username: req.body.username }, { email: req.body.email }])
    .then(user => {
        if(!user) {
            return res.status(401).json({success: false, message: "Auth failed"});
        }
        u = user;
        console.log(req.body.password);
        return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => { //1 parameter???
        
        if(!result) {
            return res.status(401).json({success: false, message: "Wrong Password"});   
        }
    
        const token = jwt.sign({
            username: u.username,
            userId: u._id
        }, 'secret_key', {
            expiresIn: "1d"
        });

        return res.status(200).json({success: true, message: "Auth successful", token, userID: u._id});
    }) 
    .catch(err => console.log(err));
});

module.exports = router;