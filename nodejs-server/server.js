const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');
const port = 4000;
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const peopleRoutes = require('./routes/peopleRoutes');
const followRoutes = require('./routes/followRoutes');

const app = express();

//Socket.IO
const server = require('http').createServer(app);
const socketIO =  require('socket.io').listen(server);
//Socket.IO

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

require('./socket/streams')(socketIO);

app.use('/api/chatapp', authRoutes);
app.use('/api/chatapp', postRoutes);
app.use('/api/chatapp', peopleRoutes);
app.use('/api/chatapp', followRoutes);

server.listen(port, () => {
    console.log('Server is Running on ' + port);
});