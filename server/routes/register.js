const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');

router.post('/', async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.validate();

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;

        res.json(await user.save());
    } catch (err) {
        if (err.name === 'ValidationError' || err.code === 11000) res.status(400);

        next(err);
    }
});

router.delete('/', async (req, res, next) => {
    const cookie = req.cookies.refreshToken;

    try {
        const { userID } = jwt.verify(cookie, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByIdAndRemove(userID);
        const token = await Token.findByIdAndRemove(userID);

        if (user === null && token === null) {
            res.status(400);
            throw new Error('User doesn\'t exist');
        }

        res.clearCookie('refreshToken');
        res.json({ message: `User ${user.username} deleted` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
