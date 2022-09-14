const fs = require('fs');
const path = require('path');

const deleteFile = (dirname, fileName) => {
    fs.unlink(path.join(dirname, fileName), (err) => {
        if (err) {
            console.log('there is an error');
            console.error(err);
        } else {
            console.log('file deleted successfully');
        }
    });
};
module.exports = deleteFile;
