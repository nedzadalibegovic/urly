const Url = require('../models/url');
const router = require('express').Router();

router.get('/', async (req, res, next) => {
    try {
        const documents = await Url.find();

        res.status(200).json(documents);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { title, url } = req.body;
        const document = await Url.create({ title, url });

        res.status(200).json(document);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        res.status(200).json(res.locals.document);
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const document = res.locals.document;

        document.url = req.body.url;
        document.title = req.body.title;
        document.date = Date.now();
        document.save();

        res.status(200).json(document);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const document = res.locals.document;

        document.remove();

        res.status(200).json(document);
    } catch (err) {
        next(err);
    }
});

module.exports = router;