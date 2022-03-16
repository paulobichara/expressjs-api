const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

module.exports = app;
