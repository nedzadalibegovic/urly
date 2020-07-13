const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        res.locals.userID = verified.userID;
    } catch (err) {
        res.status(403);
        next(err);
    }

    next();
};

module.exports = verify;
