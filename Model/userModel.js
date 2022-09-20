/* eslint-disable func-names */
/* eslint-disable comma-dangle */
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
        },
        subTitle: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        avatar: String,
        designation: [String],
        aboutMe: String,
        thumpPic: String,
        skills: [
            {
                skill: String,
                progress: Number,
            },
        ],
        familiarTech: [String],
        education: [
            {
                exam: String,
                institute: String,
            },
        ],
        socialLink: [
            {
                socialName: String,
                socialLink: String,
            },
        ],
        coursesTraining: [
            {
                coursesName: String,
                coursesDes: String, // courses Descriptions
            },
        ],
        role: {
            type: String,
            default: 'user',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        timestamps: true,
    }
);

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
