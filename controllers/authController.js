const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const { log } = require('console')

// Create token function
const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.signup = catchAsync(async (req, res, mext) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = createToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email, password is exist
    if (!email || !password) {
        return next(new AppError('Please provide email & password', 400));
    }

    // Check if a user exist && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401)); // 401 - unauthorized
    }

    // If everythinh is OK - send token to a client
    const token = createToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})

// Middleware to protect access from users that are not logged in
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // Get a token and check if it`s there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not logged in!', 401));
    }

    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exists'), 401);
    }

    // Check if user changed password after token was issued
    if(freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password!', 401));
    }

    req.user = freshUser;
    next();
})