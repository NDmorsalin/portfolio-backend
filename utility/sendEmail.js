const nodemailer = require('nodemailer');
const inLineCss = require('nodemailer-juice');

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMPT_EMAIL, // generated ethereal user
            pass: process.env.SMPT_PASSWORD, // generated ethereal password
        },
    });

    transporter.use('compile', inLineCss());

    const info = await transporter.sendMail({
        from: process.env.SMPT_EMAIL, // sender address
        to: option.email, // list of receivers
        subject: 'Nd Morsalin', // Subject line
        html: `<h1 style={color:red,font-size:1rem}>this is test email</h1>
            <p>${option.resetUrl}</p>
        `,
    });
    console.log(info);
};

module.exports = sendEmail;
