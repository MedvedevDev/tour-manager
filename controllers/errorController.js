module.exports = (err, req, res, next) => { // ErrorFirst function - first argument is an error
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}