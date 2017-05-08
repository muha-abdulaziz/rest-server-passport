var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotions = require('../models/promotion');
var Verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.find({}, function(err, promo) {
        if (err) throw err;
        res.json(promo);
    });
})

.post(Verify.verifyAdmin, function (req, res, next) {
    Promotions.create(req.body, function (err, promo) {
        if (err) throw err;

        console.log('Promotion created!');
        var id = promo._id;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Added the promotion with id: ' + id);
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    Promotions.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.route('/:promoId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findById(req.params.promoId, function (err, promo) {
        if (err) throw err;
        res.json(promo);
    });
})

.put(Verify.verifyAdmin, function (req, res, next) {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set : req.body
    }, {
        new: true
    }, function (err, promo) {
        if (err) throw err;
        res.json(promo);
    });
})

.delete(Verify.verifyAdmin, function (req, res, next) {
    Promotions.findByIdAndRemove(req.params.promoId, 
        function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
});

module.exports = router;