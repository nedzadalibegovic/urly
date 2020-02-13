const Url = require('../models/url');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const documents = await Url.find();

        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, url } = req.body;
        const document = await Url.create({ title, url });

        res.status(200).json(document);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.status(200).json(res.locals.document);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const document = res.locals.document;

        document.url = req.body.url;
        document.title = req.body.title;
        document.date = Date.now();
        document.save();
        
        res.status(200).json(document);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const document = res.locals.document;

        document.remove();

        res.status(200).json(document);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;