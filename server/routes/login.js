const User = require('../models/user');
const Token = require('../models/token');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        if (!req.body.username || !req.body.password) {
            res.status(400);
            throw new Error('Missing username or password');
        }

        const user = await User.findOne({ username: req.body.username });

        if (user === null) {
            res.status(403);
            throw new Error('Invalid username or password');
        }

        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.status(403);
            throw new Error('Invalid username or password');
        }

        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        if (!await Token.findOneAndUpdate({ _id: user._id }, { token: refreshToken })) {
            await Token.create({ _id: user._id, token: refreshToken });
        }

        res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/token', maxAge: 604800000 });
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;