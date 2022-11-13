const createError = require('http-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const port = 9000;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const suppliersRouter = require('./routes/suppliers');
const customersRouter = require('./routes/customers');
const employeesRouter = require('./routes/employees');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');


// HTTP logger
app.use(morgan('combined'));

app.use(
    cors({
        origin: '*',
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(400));
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})