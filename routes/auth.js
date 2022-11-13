const express = require('express');
const router = express.Router();


// req: request
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log('* username: ', username);
    console.log('* password: ', password);
    if (username === 'admin' && password === '123456789') {
        res.send({ message: 'login success!' });
        return;
    }
    res.status(401).send({ message: 'login failed!' });
});

module.exports = router;
