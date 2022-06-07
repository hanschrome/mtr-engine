const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Hello :) I will be the endpoint for multiple instance executing');
});

module.exports = router;