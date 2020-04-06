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

        if (!(await bcrypt.compare(req.body.password, user.password))) {
            res.status(403);
            throw new Error('Invalid username or password');
        }

        const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        await Token.findOneAndUpdate({ _id: user._id }, { token: refreshToken }, { upsert: true });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, domain: process.env.DOMAIN, maxAge: 604800000 });
        res.json({ refreshToken, accessToken });
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
        const { _id: tokenID } = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET);
        const document = await Token.findByIdAndRemove(tokenID).populate('_id', 'username');

        // https://expressjs.com/en/5x/api.html#res.clearCookie
        res.clearCookie('refreshToken', { httpOnly: true, domain: process.env.DOMAIN });
        res.json({ message: `User ${document._id.username} logged out` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;