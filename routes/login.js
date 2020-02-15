const User = require('../models/user');
const Token = require('../models/token');
const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const validation = Joi.object({
    username: Joi.string()
        .required()
        .min(4)
        .max(20),
    password: Joi.string()
        .required()
        .min(8)
});

router.get('/', express.static('public/login'));

router.post('/', async (req, res, next) => {
    try {
        const { error } = validation.validate(req.body);

        if (error != null) {
            res.status(400);
            throw error;
        }

        const user = await User.findOne({ username: req.body.username });

        if (user === null) {
            res.status(400);
            throw new Error('Invalid username or password');
        }

        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.status(400);
            throw new Error('Invalid username or password');
        }

        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        // const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });

        if (!await Token.findOneAndUpdate({ _id: user._id }, { token: refreshToken })) {
            await Token.create({ _id: user._id, token: refreshToken });
        }

        res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/token', maxAge: 604800000 });
        // res.status(200).json({ refreshToken: refreshToken, accessToken: accessToken });
        res.sendStatus(200);
    } catch (err) {
        next(err);
    }
});

module.exports = router;