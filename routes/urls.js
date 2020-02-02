const express = require('express');
const validUrl = require('valid-url');
const Url = require('../models/url');

const router = express.Router();

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
        const document = await Url.create(req.body);

        res.status(200).json(document);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const document = await Url.findById(req.body.url);

        res.status(200).json(document);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const document = await Url.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json(document);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const document = await Url.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'URL deleted'
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;