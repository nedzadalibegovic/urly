const router = require('express').Router();
const Url = require('../models/url');
const joi = require('@hapi/joi');
joi.objectId = require('joi-objectid')(joi);
const urlExists = require('url-exist');

const validation = joi.object({
    _id: joi.objectId(),

    title: joi.string()
        .required(),

    url: joi.string()
        .uri()
        .required(),

    date: joi.date()
});

router.post('/', async (req, res, next) => {
    try {
        const { error } = validation.validate(req.body);

        if (error != null) {
            return res.status(400).json({
                message: error
            });
        }

        if (!await urlExists(req.body.url)) {
            return res.status(400).json({
                message: "URL not reachable"
            });
        }

        next();
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const document = await Url.findById(req.params.id);

        if (document === null) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.locals.document = document;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { error } = validation.validate(req.body);
        const document = await Url.findById(req.params.id);

        if (document === null) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        if (error != null) {
            return res.status(400).json({
                message: error
            });
        }

        res.locals.document = document;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const document = await Url.findByIdAndDelete(req.params.id);

        if (document === null) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.locals.document = document;
        next();
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;