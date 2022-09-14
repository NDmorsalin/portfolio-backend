/* eslint-disable no-unused-expressions */
const multer = require('multer');

const path = require('path');
const createError = require('http-errors');

const singleFileUpload = (subFolder, fileType, fileSize, errorMsg) => {
    const folderName = `${__dirname}/../public/${subFolder}`;
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, folderName);
        },
        filename(req, file, cb) {
            const fileExt = path.extname(file.originalname);
            const fileName = file.originalname
                .replace(fileExt, '')
                .toLowerCase()
                .split(' ')
                .join('-');
            req.fileName = fileName + Date.now() + fileExt;

            cb(null, fileName + Date.now() + fileExt);
        },
    });

    const upload = multer({
        storage,
        limits: {
            fileSize,
        },
        fileFilter: (req, file, cb) => {
            if (fileType.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(403, errorMsg));
            }
        },
    });

    return upload;
};

module.exports = singleFileUpload;
