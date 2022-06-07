var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send("MTR working");
});

router.get('/ping', function (req, res, next) {
    res.send('["PONG"]');
});

module.exports = router;
