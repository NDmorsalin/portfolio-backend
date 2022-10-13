/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const crypto = require('crypto');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const catchAsyncError = require('../../middleware/common/catchAsyncError');
const User = require('../../Model/userModel');
const { generateCookies } = require('../../utility/generateCookies');
const hashStr = require('../../utility/hashStr');
const sendEmail = require('../../utility/sendEmail');

// ?complete
// Log out
const getAdmin = catchAsyncError(async (req, res, next) => {
    const admin = await User.findOne({ role: 'admin' });

    res.status(200).json({
        message: 'admin data',
        status: true,
        admin,
    });
});

// ?complete
// signup
const signup = catchAsyncError(async (req, res, next) => {
    const hashPassword = await hashStr(req.body.password);
    const avatar = `${req.hostname}:${process.env.PORT}/avatar/${req.files[0].filename}`;
console.log({avatar,file:req.files})
    const user = new User({
        ...req.body,
        password: hashPassword,
        
    });
    await user.save();
    const token = await generateCookies(res, user.id);

    res.status(200).json({
        user,
        status: true,
        message: 'signup successful',
    });
});

// ?complete
// login
const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        next(createHttpError(401, 'please enter email and password '));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        next(createHttpError(401, 'email or password is incorrect'));
    }
    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
        next(createHttpError(401, 'email or password is incorrect'));
    }

    const token = await generateCookies(res, user.id);

    res.status(200).json({
        status: true,
        message: 'logged in successful',
        user,
    });
});

// ?complete
// Log out
const logout = catchAsyncError(async (req, res, next) => {
    res.clearCookie('userId');

    res.status(200).json({
        message: 'logout successful',
        status: true,
    });
});

// ?complete
// get all user --Admin
const getAllUser = catchAsyncError(async (req, res, next) => {
    const allUser = await User.find();

    if (allUser.length === 0) {
        res.status(201).json({
            status: 404,
            message: 'no user found',
        });
    }
    res.status(200).json({
        status: true,
        message: 'allUser find successful',
        allUser,
    });
});

// ?complete
// get single user  --Admin
const getSingleUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        next(createHttpError(403, `${id} this id is invalid`));
    }
    res.status(200).json({
        status: true,
        user,
        message: `successfully founded ${user.name}'s id`,
    });
});

// update password
const updateUser = catchAsyncError(async (req, res, next) => {
    const id =
        req.user.role === 'admin' && req.originalUrl === '/api/v1/me/update'
            ? req.user.id
            : req.params.id;

    const forUpdateUser =
        req.user.role === 'admin' && req.originalUrl === '/api/v1/me/update'
            ? req.user
            : await User.findById(id);

    // console.log(req.originalUrl === '/api/v1/me/update');
    console.log({ forUpdateUser, id });
    /* //todo
     skills education socialLink coursesTraining

     are send object or array from front end
    */ //! todo

    // todo send string from frontEnd
    const familiarTech = req.body.familiarTech ? req.body.familiarTech.split(',') : null;

    // profile image and thump image
    const avatarFile = req?.files?.find((file) => file.fieldname === 'avatar');
    const thumpPicFile = req?.files?.find((file) => file.fieldname === 'thumpPic');

    const avatar = avatarFile
        ? `${req.hostname}:${process.env.PORT}/avatar/${avatarFile.filename}`
        : null;

    const thumpPic = thumpPicFile
        ? `${req.hostname}:${process.env.PORT}/avatar/${thumpPicFile.filename}`
        : null;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        {
            $set: {
                name: req.body.name || forUpdateUser.name,
                email: req.body.email,
                avatar: avatar || forUpdateUser.avatar,
                aboutMe: req.body.aboutMe || forUpdateUser.aboutMe,
                thumpPic: thumpPic || forUpdateUser.thumpPic,
                familiarTech: familiarTech || forUpdateUser.familiarTech,
                // todo wait for front end
                skills: forUpdateUser.skills,
                education: forUpdateUser.education,
                socialLink: forUpdateUser.socialLink,
                coursesTraining: forUpdateUser.coursesTraining,
            },
        },
        {
            new: true,
        }
    );
    res.status(200).json({
        status: true,
        user,
        message: `successfully updated ${user.name}'s profile`,
    });
});
// update user
const updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isPasswordRight = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordRight) {
        next(createHttpError(402, 'your odl password is wrong'));
    }
    user.password = await hashStr(req.body.newPassword);

    user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: true,
        message: 'successfully updated your password',
    });
});

// forget password
const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        next(createHttpError(404, 'user not found'));
    }
    const resetToken = user.getResetPasswordToken();
    user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.hostname}:${process.env.PORT}${req.baseUrl}/password/reset/${resetToken}`;
    console.log(resetUrl);

    await sendEmail({
        email: user.email,
        resetUrl,
    });

    res.status(200).json({
        status: true,
        user,
        message: `successfully sended a token for update Password to  ${user.email}`,
    });
});
// forget password
const resetPassword = catchAsyncError(async (req, res, next) => {
    const { resetToken } = req.params;
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        next(createHttpError(404, 'user not found or request time is expired'));
    }

    user.password = await hashStr(req.body.password);

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    user.save({ validateBeforeSave: false });

    res.status(200).json({
        status: true,
        message: 'successfully update your Password',
    });
});

module.exports = {
    getAllUser,
    getSingleUser,
    login,
    logout,
    signup,
    updateUser,
    updatePassword,
    forgetPassword,
    resetPassword,
    getAdmin,
};
