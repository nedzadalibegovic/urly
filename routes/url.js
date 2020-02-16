const router = require('express').Router();
const URL = require('../models/url');

const checkIfDocumentExists = async (req, res, next) => {
    try {
        const document = await URL.findById(req.params.id);

        if (!document) {
            res.status(404);
            throw new Error('Document not found');
        }

        res.locals.document = document;
        next();
    } catch (err) {
        if (err.name === 'CastError') {
            err.message = 'Invalid ID';
            res.status(400);
        }

        next(err);
    }
};

router.get('/', async (req, res, next) => {
    try {
        const documents = await URL.find();
        res.json(documents);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', checkIfDocumentExists, async (req, res) => {
    res.json(res.locals.document);
});

router.post('/', async (req, res, next) => {
    try {
        const document = await URL.create(req.body);
        res.json(document);
    } catch (err) {
        if (err.name === 'ValidationError') res.status(400);
        next(err);
    }
});

router.patch('/:id', checkIfDocumentExists, async (req, res, next) => {
    try {
        const document = await URL.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true, new: true });
        res.json(document);
    } catch (err) {
        if (err.codeName === 'ImmutableField' || err.name === 'ValidationError') res.status(400);
        if (err.codeName === 'ImmutableField') err.message = 'ID is immutable';
        next(err);
    }
});

router.delete('/:id', checkIfDocumentExists, async (req, res, next) => {
    try {
        const document = await res.locals.document.remove();
        res.json(document);
    } catch (err) {
        next(err);
    }
});

module.exports = {
    checkIfDocumentExists,
    router
};