const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

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