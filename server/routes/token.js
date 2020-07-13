const router = require('express').Router();
const Token = require('../models/token');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const document = await Token.findById(decoded.userID);

        if (document === null || document.token !== refreshToken) {
            res.status(403);
            throw new Error('Please login again');
        }

        const accessToken = jwt.sign({ userID: document._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });

        res.json({ accessToken: accessToken });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') res.status(403);
        next(err);
    }
});

module.exports = router;
