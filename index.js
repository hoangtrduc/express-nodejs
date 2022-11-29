const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const port = 9000;

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;


// JWT
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwtSettings = require('./constants/jwtSettings');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const suppliersRouter = require('./routes/suppliers');
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const uploadRouter = require('./routes/upload');


const connectDb = require('./Services/connectDBService');
const { findDocument, findDocuments } = require('./helpers/MongoDbHelper');

// Thiếu cái này, đây là cái tội: Ko làm đúng template của thầy ☠️☠️☠️
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(
    cors({
        origin: '*',
    }),
);

const myLogger = function (req, res, next) {
    console.log('LOGGED')
    next();
};

app.use(myLogger);

// Passport: Basic Auth
passport.use(
    new BasicStrategy(function (username, password, done) {
        console.log('BasicStrategy');
        // MONGODB
        findDocuments({ query: { username: username, password: password } }, 'login')
            .then((result) => {
                if (result.length > 0) {
                    return done(null, true);
                } else {
                    return done(null, false);
                }
            })
            .catch((err) => {
                return done(err, false);
            });
    }),
);


// Passport: jwt
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER

passport.use(
    new JwtStrategy(opts, async (payload, done) => {
        // console.log(payload);
        const id = payload.sub;
        const found = await findDocument(id, 'login')
        console.log(found && found.active)

        if (found && found.active) {
            let error = null;
            let user = true;
            return done(error, user);
        } else {
            let error = null;
            let user = false;
            return done(error, user);
        }
    }),
);


// router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/suppliers', suppliersRouter);
app.use('/customers', customersRouter);
app.use('/employees', employeesRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);
app.use('/upload', uploadRouter);


// connect database
connectDb();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})