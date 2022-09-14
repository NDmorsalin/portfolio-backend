const bcrypt = require('bcryptjs');

const hashPassword = async (str) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);

    return hash;
};

module.exports = hashPassword;
