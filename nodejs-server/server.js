const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const port = 4000;
const authRoutes = require('./routes/authRoutes');

const app = express();

const dbConfig = require('./config/secret');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, { useNewUrlParser: true });

app.use(cookieParser());
// app.use(logger('dev'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/chatapp', authRoutes);

app.listen(port, () => {
    console.log('Server is Running on ' + port);
});