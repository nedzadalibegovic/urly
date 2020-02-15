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
            res.status(400);
            throw error;
        }

        if (!await urlExists(req.body.url)) {
            res.status(400);
            throw new Error('URL is not reachable');
        }

        next();
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const document = await Url.findById(req.params.id);

        if (document === null) {
            res.status(404);
            throw new Error('Document not found');
        }

        res.locals.document = document;
        next();
    } catch (err) {
        next(err);
    }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const { error } = validation.validate(req.body);
        const document = await Url.findById(req.params.id);

        if (document === null) {
            res.status(404);
            throw new Error('Document not found');
        }

        if (error != null) {
            res.status(400);
            throw error;
        }

        res.locals.document = document;
        next();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const document = await Url.findByIdAndDelete(req.params.id);

        if (document === null) {
            res.status(404);
            throw new Error('Document not found');
        }

        res.locals.document = document;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = router;