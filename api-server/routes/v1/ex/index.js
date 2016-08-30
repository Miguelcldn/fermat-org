/*global require*/
/*global module*/
var config = require('../../../config');
var express = require('express');
var exRateMod = require('../../../modules/exrate')
var router = express.Router();
var security = require('../../../lib/utils/security');
var sha256 = require('../../../modules/auth/lib/sha256');

function insertCallback(err, exrate, res) {
    if (err) {
        res.status(500).send({
            "message": err
        });
        return;
    }
    res.status(200).send({
        "message": "ex rate created succesfully"
    })
}

/**
 * @api {post} /v1/ex/ticker set exchange rate
 * @apiVersion 0.0.1
 * @apiName AddExRate
 * @apiGroup Ex
 * @apiParam {Number} price The price in USD
 * @apiParam {String} pass The admin password
 * @apiDescription Adds a new ex rate
 */
router.post('/ticker', function(req, res, next) {
    'use strict';
    try {
        console.log(req.body);
        // Check that all required data is present
        if (!security.isValidData(req.body.price) ||
            !security.isNumber(req.body.price) ||
            !security.isValidData(req.body.pass)) {

            res.status(412).send({
                "message": "missing or invalid data"
            });
        } else {
            // Check that the password match
            if (sha256.calc(req.body.pass) !== config.exrate.pass) {
                res.status(403).send({
                    "message": "Invalid password"
                });
            } else {
                // Tries to create the ex rate
                exRateMod.insertExRate(req.body.price, res, insertCallback);
            }
        }
    } catch (err) {
        next(err);
    }
});

function getExRateCallback(err, exrate, res) {
    if (err === null && exrate === null) {
        res.status(200).send({
            "FER_USD": {
                "price": 0,
                "timestamp": 0
            }
        });
    } else if (err) {
        res.status(500).send({
            "message": err
        });
    } else {
        res.status(200).send({
            "FER_USD": {
                "price": exrate.price,
                "timestamp": Date.parse(exrate.timestamp)
            }
        });
    }
}

/**
 * @api {get} /v1/ex/ticker get exchange rate
 * @apiVersion 0.0.1
 * @apiName GetExRate
 * @apiGroup Ex
 * @apiDescription Gets the current exchange rate
 */
router.get('/ticker', function(req, res, next) {
    'use strict';
    try {
        exRateMod.findExRate(res, getExRateCallback);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
