const mongoose = require('mongoose');

async function db() {
    try {
        await mongoose.connect(process.env.DB_URL_STR);
        console.log('db connection is successful');
    } catch (error) {
        console.log(error);
    }
}
module.exports = db;
