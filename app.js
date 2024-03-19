const express = require('express')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorController')

// Import routers
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json()); // Data from the body is added to the request object
// app.use((req, res, next) => {
//     console.log('MIDDLEWARE');
//     next()
// })
app.use(express.static(`${__dirname}/public`));

// Mounting routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError('ERROR', 404))
})

// Error handling middleware
app.use(errorHandler)

module.exports = app