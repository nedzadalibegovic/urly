const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const URL = require('../models/url');

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.validate();

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;

        await user.save();

        res.json({ message: `User ${user.username} created` });
    } catch (err) {
        if (err.name === 'ValidationError' || err.code === 11000) res.status(400);

        next(err);
    }
});

router.delete('/', async (req, res, next) => {
    const cookie = req.cookies.refreshToken;

    if (!cookie) {
        res.status(400);
        return next(new Error('You must be logged in to delete your account'));
    }

    try {
        const { userID } = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET);

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

        await user.deleteOne();
        const token = await Token.findByIdAndRemove(userID);

        if (user === null && token === null) {
            res.status(400);
            throw new Error("User doesn't exist");
        }

        await URL.deleteMany({ userID: user._id });

        res.clearCookie('refreshToken');
        res.json({ message: `User ${user.username} deleted` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
