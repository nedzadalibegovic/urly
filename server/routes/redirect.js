const router = require('express').Router();
const { checkIfDocumentExists } = require('./url');

router.get('/:id', checkIfDocumentExists, async (req, res, next) => {
    try {
        const document = res.locals.document;
        res.redirect(303, document.url);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
