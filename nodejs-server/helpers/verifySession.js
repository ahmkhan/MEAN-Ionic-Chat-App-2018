const jwt           = require('jsonwebtoken');
const httpStatus    = require('http-status-codes');
const dbConfig      = require('../config/secret');

module.exports.verifySession = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(httpStatus.UNAUTHORIZED).json({message: 'No Header Authorization'});
    }
    
    const token = req.cookies.auth || req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(httpStatus.FORBIDDEN).json({message: 'No Token provided'});
    }

    return jwt.verify(token, dbConfig.secretKey, (err, decoded) => {
        if (err) {
            if (err.expiredAt < new Date()) {
                return res.status(httpStatus.GATEWAY_TIMEOUT).json({message: 'Session Expired, Please Login Again'});
            }
            next();
        }
        req.user = decoded.data;
        next();
    });
};

