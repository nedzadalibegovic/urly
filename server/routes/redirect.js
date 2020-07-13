const router = require('express').Router();
const URL = require('../models/url');

router.get('/:id', async (req, res, next) => {
    try {
        const document = await URL.findById(req.params.id);

        if (!document) {
            res.status(404);
            throw new Error('Document not found');
        }

        res.redirect(307, document.url);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
