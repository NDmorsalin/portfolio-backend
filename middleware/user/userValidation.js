/* eslint-disable comma-dangle */
const { check, validationResult } = require('express-validator');

const deleteFile = require('../../utility/deleteFile');

const userValidation = [
    check('name')
        .not()
        .isEmpty()
        .withMessage('Please enter your name')
        .isLength({ min: 4 })
        .withMessage('Minimum name length is 4')
        .isLength({ max: 30 })
        .withMessage('Maximum name length is 8'),
    check('email')
        .not()
        .isEmpty()
        .withMessage('Please Enter Your Email')
        .isEmail()
        .withMessage('Please enter a Valid email'),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Please Enter Your password')
        .isStrongPassword()
        .withMessage('Please enter a Strong password'),
];

const userValidationResult = async (req, res, next) => {
    const error = validationResult(req);
    const mappedError = error.mapped();
    if (error.isEmpty()) {
        next();
    } else {
        // delete file what is uploaded
        deleteFile(`${__dirname}/../../public/avatar/`, req.fileName);
        res.status(401).json({
            error: mappedError,
        });
    }
};

module.exports = { userValidation, userValidationResult };
