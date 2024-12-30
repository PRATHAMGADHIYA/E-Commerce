const notFound = (req, res, next) => {
    const error = new Error(`not Found:${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (error, req, res, next) => {
    const statuscode = req.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: error?.message,
        stack: error?.stack,
    });
};

module.exports = { errorHandler, notFound };