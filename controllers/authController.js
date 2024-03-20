const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')

exports.signup = catchAsync(async (req, res, mext) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        name: req.body.name
    })
})