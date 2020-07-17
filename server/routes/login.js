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
            res.status(400);
            throw new Error('Invalid username or password');
        }

        if (!(await bcrypt.compare(req.body.password, user.password))) {
            res.status(400);
            throw new Error('Invalid username or password');
        }

        let token = await Token.findById(user._id);

        if (token === null) {
            token = await Token.create({
                _id: user._id,
                token: jwt.sign({ userID: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
            });
        }

        try {
            jwt.verify(token.token, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                token.token = jwt.sign({ userID: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
                await token.save();
            } else {
                throw err;
            }
        }

        const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
        const refreshToken = token.token;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            domain: process.env.DOMAIN,
            maxAge: 604800000,
            secure: process.env.NODE_ENV === 'production' ? true : false,
        });
        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
});

router.delete('/', async (req, res, next) => {
    const cookie = req.cookies.refreshToken;

    if (!cookie) {
        res.status(400);
        return next(new Error('You must be logged in to log out'));
    }

    try {
        const { userID } = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET);
        const document = await Token.findByIdAndRemove(userID);

        // https://expressjs.com/en/5x/api.html#res.clearCookie
        res.clearCookie('refreshToken');
        res.json({ message: `User ${document.username} logged out` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
