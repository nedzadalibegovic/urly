const router = require('express').Router();
const url = require('url');
const Domain = require('../models/domain');

const checkDomain = async (req, res, next) => {
    const hostname = url.parse(req.body.url).hostname;

    try {
        const result = await Domain.find({ domain: hostname });

        // blacklist
        if (process.env.BLACKLIST === '1' && result.length > 0) {
            res.status(400);
            throw new Error('Domain is blacklisted');
        }

        // whitelist
        if (process.env.BLACKLIST === '0' && result.length === 0) {
            res.status(400);
            throw new Error('Domain not whitelisted');
        }
    } catch (err) {
        next(err);
    }

    next();
};

router.post('/', checkDomain);

router.patch('/:id', checkDomain);

module.exports = router;
