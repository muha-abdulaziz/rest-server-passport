var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};
function notAuthError() {
    var err = new Error('You are not authenticated!');
    err.status = 401;
    return err;
};

function Error403(msg) {
    var err = new Error(msg);
    err.status = 403;
    return err;
};

var noTokenError = Error403('No token provided!');

var privilegeError = Error403('You not autherized to perform this operation!');

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token ||
     req.headers['x-access-token'];

     //decode token
     if (token) {
         //verifies secret and checks exp
         jwt.verify(token, config.secretKey, function (err, decoded) {
             if (err) next(notAuthError);
             else {
                 //if everything is good, save to request for
                 //use in other routes
                 req.decoded = decoded;
                 next();
             }
         });
     } else {
         // if there is no token
         //return error
         next(noTokenError);
     }
};

exports.verifyAdmin = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token ||
     req.headers['x-access-token'];

     //decode token
     if (token) {
         //verifies secret and checks exp
         jwt.verify(token, config.secretKey, function (err, decoded) {
             if (err) next(notAuthError);

             var checkAdmin = decoded._doc.admin;
             if (!checkAdmin) next(privilegeError);
             else {
                 //if everything is good, save to request for
                 //use in other routes
                 req.decoded = decoded;
                 next();
             }
         });
     } else {
         // if there is no token
         //return error
         next(noTokenError);
     }
};