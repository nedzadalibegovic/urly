// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
};

const notFound = (req, res, next) => {
    const error = new Error(`This is not the route you're looking for...`);
    res.status(404);
    next(error);
};

module.exports = {
    errorHandler,
    notFound
};