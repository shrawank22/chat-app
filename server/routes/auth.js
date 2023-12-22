const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcrypt");


router.post('/login', async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({ msg: "Incorrect Username or Password", status: false });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect Username or Password", status: false });

        delete user.password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
});

router.post('/register', async(req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // console.log(username, password, email);
        const usernameCheck = await User.findOne({ username });
        const emailCheck = await User.findOne({ email });
        if (usernameCheck || emailCheck) 
            return res.json({ msg: "Username or email already used", status: false });
        

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch(ex) {
        next(ex);
    }
});

router.get('/allusers/:id', async(req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
});


router.get('/logout/:id', async(req, res, next) => {
    try {
        if (!req.params.id) 
            return res.json({ msg: "User id is required " });
        onlineUsers.delete(req.params.id);
        return res.status(200).send();
    } catch (ex) {
        next(ex);
    }
});

module.exports = router;