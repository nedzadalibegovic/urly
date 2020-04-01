const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

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

module.exports = router;
