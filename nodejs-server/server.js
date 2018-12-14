const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');
const port = 4000;
const authRoutes = require('./routes/authRoutes');

const app = express();

const dbConfig = require('./config/secret');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.mLabUrl, { useNewUrlParser: true });

app.use(cookieParser());
// app.use(logger('dev'));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'PUT', 'DELETE', 'OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use('/api/chatapp', authRoutes);

app.listen(port, () => {
    console.log('Server is Running on ' + port);
});