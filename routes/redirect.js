const Url = require('../models/url');
const router = require('express').Router();

router.get('/:id', async (req, res) => {
    try {
        const document = await Url.findById(req.params.id);

        if (document === null) {
            throw null;
        }
    
        res.redirect(303, document.url);
    } catch (err) {
        res.status(404).send();
    }
});

module.exports = router;