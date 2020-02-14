const jwt = require('jsonwebtoken');
const router = require('express').Router();
const Token = require('../models/token');

const verify = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        res.locals.userID = verified._id;
    } catch (err) {
        return res.sendStatus(401);
    }

    next();
};

router.get('/', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if (!Token.findById(decoded._id)) {
            throw null;
        }

        const accessToken = jwt.sign({ _id: decoded._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });

        res.json({ accessToken: accessToken });
    } catch (err) {
        return res.sendStatus(401);
    }
});

module.exports.authentication = verify;
module.exports.tokenRoute = router;