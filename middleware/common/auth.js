/* eslint-disable prettier/prettier */
const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');
const User = require('../../Model/userModel');
const catchAsyncError = require('./catchAsyncError');

const auth = catchAsyncError(async (req, res, next) => {
    const token = req.signedCookies.userId;
    if (!token) {
        next(createHttpError(403, 'Please login to access this resource'));
    }
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    if (!user) {
        next(createHttpError(402, 'User not found please registration again'));
    }

    req.user = user;
    next();
});

const authenticateRole = (role) => catchAsyncError(async (req, res, next) => {
        if (!(role === req.user.role)) {
            next(createHttpError(403, `Role: ${req.user.role} are not allow to access this resource`));
        }
    next();
    });

module.exports = { auth, authenticateRole };
