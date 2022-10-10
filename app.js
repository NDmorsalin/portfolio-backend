/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const indexRouter = require('./routes/index');
const adminRouter = require('./routes/adminRoutes');
const adminProjectsRouter = require('./routes/adminProjectsRouter');
const db = require('./db/db');
const deleteFile = require('./utility/deleteFile');

const app = express();
require('dotenv').config();

app.use(logger('dev'));

// DB connection
db();

// parser utility
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIES_SECRET));

// cors origin

app.use(
    cors({
        origin: '*',
    })
);

// static folder
app.use(express.static(path.join(`${__dirname}/public`)));

// router
app.use('/api/v1/', indexRouter);
app.use('/api/v1/', adminRouter);
app.use('/api/v1/', adminProjectsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    console.log({ err });

    // delete file if it has
    if (req.fileName) {
        deleteFile(`${__dirname}/public/avatar`, req.fileName);
    }
    // render the error page
    res.status(err.status || 500).json({
        errorMsg: err.message,
        error: req.app.get('env') === 'development' ? err : {},
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT || 3000}`);
});
module.exports = app;
