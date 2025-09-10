const express = require('express');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./src/config/db');
const initCronJobs = require('./src/cron/dollar');

const indexRouter = require('./src/routes/rates');
const testRouter = require('./src/routes/test');

const app = express();

// Connect to the database
connectDB();

if (process.env.NODE_ENV !== 'production') {
    // Initialize cron jobs only in non-production environments
    initCronJobs();
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/rates', indexRouter);
app.use('/get-actual-rates', testRouter);

module.exports = app
