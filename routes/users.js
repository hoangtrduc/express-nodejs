const express = require('express');
const router = express.Router();

// GET users listing
router.get('/list', function (req, res, next) {
    res.send({ message: 'HELLO EXPRESS' })
});

module.exports = router;