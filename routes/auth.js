const express = require('express');
const router = express.Router();

const yup = require('yup');
const { validateSchema } = require('../schemas');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSettings = require('../constants/jwtSettings');
const { findDocuments } = require('../helpers/MongoDbHelper')

// req: request
router.post('/login', (req, res, next) => {

    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    console.log('* username: ', username);
    console.log('* password: ', password);
    if (username === 'admin' && password === '123456789') {
        res.send({ message: 'Login success!' });
        return;
    }

    res.status(401).send({ message: 'Login failed!' });
});

const loginSchema = yup.object({
    body: yup.object({
        username: yup.string().email().required(),
        password: yup.string().required(),
    }),
});

router.post('/login-validate', validateSchema(loginSchema), (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;


    if (username === 'admin@gmail.com' && password === '123456789') {
        res.send({ message: 'Login success!' });
        return;
    }

    res.status(401).send({ message: 'Login failed!' });
});

const getByIdSchema = yup.object({
    params: yup.object({
        id: yup.number().required(),
    }),
});

router.get('/users/:id', validateSchema(getByIdSchema), (req, res, next) => {
    res.send('ok')
});

const findSchema = yup.object({
    query: yup.object({
        fullName: yup.string().required(),
        email: yup.string().email().required(),
    }),
});

router.get('/users-find', validateSchema(findSchema), (req, res, next) => {
    res.send('ok')
});

// LOGIN JWT
router.post('/login-jwt', validateSchema(loginSchema), async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log('* username: ', username);
    console.log('* password: ', password);

    const found = await findDocuments({
        query: {
            username: username,
            password: password
        },
    }, 'login');


    if (found && found.length > 0) {

        const id = found[0]._id.toString();
        // C???p token jwt
        var payload = {
            user: {
                username: username,
                fullName: 'End User',
            },
            application: 'ecommerce',
        };

        var secret = jwtSettings.SECRET;

        var token = jwt.sign(payload, secret, {
            expiresIn: 86400, // th???i gian h???t h???n  24h(24 x 60 x 60)
            audience: jwtSettings.AUDIENCE,
            issuer: jwtSettings.ISSUER,
            subject: id, // th?????ng d??ng ????? ki???m tra JWT l???n sau
            algorithm: 'HS512',
        });

        res.send({ message: 'Login success!', token });
        return;
    }

    res.status(401).send({ message: 'Login failed!' });
});

router.get('/authentication', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.send('OK')
})

// CALL API HTTP BASIC AUTHENTICATION
// ------------------------------------------------------------------------------------------------
router.get('/basic', passport.authenticate('basic', { session: false }), function (req, res, next) {
    res.json({ ok: true });
});

const checkApiKey = () => {
    // return a middleware
    return (req, res, next) => {
        const apiKey = req.get('x-api-key');
        if (apiKey === '147258369') {
            next();
        } else {
            res.status(401).json({ message: 'x-api-key is invalid' });
        }
    };
};

// C??ch 1:
router.get('/api-key', checkApiKey(), function (req, res, next) {
    res.json({ ok: true });
});

// CHECK ROLES
const allowRoles = (...roles) => {
    // return a middleware
    return (request, response, next) => {
        // GET BEARER TOKEN FROM HEADER
        const bearerToken = request.get('Authorization').replace('Bearer ', '');

        // DECODE TOKEN
        const payload = jwt.decode(bearerToken, { json: true });

        // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
        const { uid } = payload;

        // FING BY _id
        findDocument(uid, 'login')
            .then((user) => {
                console.log(user);
                if (user && user.roles) {
                    let ok = false;
                    user.roles.forEach((role) => {
                        if (roles.includes(role)) {
                            ok = true;
                            return;
                        }
                    });
                    if (ok) {
                        next();
                    } else {
                        response.status(403).json({ message: 'Forbidden' }); // user is forbidden
                    }
                } else {
                    response.status(403).json({ message: 'Forbidden' }); // user is forbidden
                }
            })
            .catch(() => {
                response.sendStatus(500);
            });
    };
};

// ------------------------------------------------------------------------------------------------
// CALL API JWT AUTHENTICATION & CHECK ROLES
// ------------------------------------------------------------------------------------------------
router.get('/roles', passport.authenticate('jwt', { session: false }), allowRoles('administrators', 'managers'), function (req, res, next) {
    res.json({ ok: true });
});



module.exports = router;