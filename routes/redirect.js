const Url = require('../models/url');
const router = require('express').Router();

router.get('/:id', async (req, res, next) => {
    try {
        const document = await Url.findById(req.params.id);

        if (document === null) {
            res.status(404);
            throw new Error('URL not found');
        }
    
        res.redirect(303, document.url);
    } catch (err) {
        next(err);
    }
});

module.exports = router;