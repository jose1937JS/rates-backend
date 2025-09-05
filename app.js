var express = require('express');
// var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./src/config/db');
const initCronJobs = require('./src/cron/dollar');

var indexRouter = require('./routes/index');

var app = express();

// Connect to the database
connectDB();

// Initialize cron jobs
// initCronJobs();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/get-rates', indexRouter);

module.exports = app
