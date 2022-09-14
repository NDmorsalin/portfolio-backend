const jwt = require('jsonwebtoken');

const generateCookies = async (res, payLoad) => {
    const token = await jwt.sign({ userId: payLoad }, process.env.JWT_SECRET, {
        expiresIn: process.env.COOKIES_EXPIRES,
    });

    res.cookie('userId', token, {
        maxAge: parseInt(process.env.COOKIES_EXPIRES, 10),
        signed: true,
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(process.env.COOKIES_EXPIRES, 10)),
    });

    return token;
};

module.exports = { generateCookies };
