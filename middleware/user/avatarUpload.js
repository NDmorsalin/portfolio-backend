/* eslint-disable comma-dangle */
const singleFileUpload = require('../../utility/singleFileUpload');

const avatarUpload = async (req, res, next) => {
    const upload = singleFileUpload(
        'avatar',
        ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        400000,
        'Only .jpg, jpeg or .png format allowed!'
    );

    upload.any()(req, res, (err) => {
        if (err) {
            console.log({ err });

            res.status(500).json({
                errors: {
                    avatar: {
                        msg: err.message,
                    },
                },
            });
        } else {
            next();
        }
    });
};
module.exports = avatarUpload;
