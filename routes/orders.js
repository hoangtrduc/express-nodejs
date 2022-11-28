const { default: mongoose } = require('mongoose');

const { Order } = require('../models')
// mongoose
mongoose.connect('mongodb://localhost:27017/api-fullstack');

const { findDocuments } = require('../helpers/MongoDbHelper');

const express = require('express');
const router = express.Router();



const lookupCustomer = {
    $lookup: {
        from: 'customers',
        localField: 'customersId',
        foreignField: '_id',
        as: 'customer'
    },
};

const lookupEmployee = {
    $lookup: {
        from: 'employee',
        localField: 'employeeId',
        foreignField: '_id',
        as: 'employee'
    },
};



// GET
router.get('/', function (req, res, next) {
    try {
        Order.find()
            .populate('orderDetails.product')
            .populate('customer')
            .populate('employee')
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (error) {
        res.sendStatus(500);
    }
});

// GET/:id
router.get('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        Order.findById(id)
            .populate('orderDetails.product')
            .populate('customer')
            .populate('employee')
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    } catch (error) {
        res.sendStatus(500);
    }
});

// POST
router.post('/', function (req, res, next) {
    try {
        const data = req.body;

        const newItem = new Order(data);
        newItem
            .save()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    } catch (err) {
        res.sendStatus(500);
    }
});

// PATCH/:id
router.patch('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;

        Order.findByIdAndUpdate(id, data, {
            new: true,
        })
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            })
    } catch (error) {
        res.sendStatus(500);
    }
});

// DELETE
router.delete('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        Order.findByIdAndDelete(id)
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (err) {
        res.sendStatus(500);
    }
});


// question 7
router.get('/questions/7', function (req, res, next) {
    try {
        const { status } = req.query;
        Order.find({ status: status }, { createdDate: 1, status: 1, paymentType: 1, orderDetails: 1, customerId: 1 })
            .populate({ path: 'orderDetails.product', select: { name: 1, price: 1, discount: 1, stock: 1 } })
            .populate({ path: 'customer', select: 'firstName lastName' })
            .populate('employee')
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// question 8
router.get('/questions/8', function (req, res, next) {
    try {
        const { status, date } = req.query;

        const fromDate = new Date(date);
        const toDate = new Date(new Date(date).setDate(fromDate.getDate() + 1));

        const compareStatus = { $eq: ['$status', status] };
        const compareFromDate = { $gte: ['$createdDate', fromDate] };
        const compareToDate = { $lt: ['$createdDate', toDate] };

        Order.aggregate([
            {
                $match: { $expr: { $and: [compareStatus, compareFromDate, compareToDate] } },
            },
        ])
            .project({ _id: 1, status: 1, paymentType: 1, createdDate: 1, orderDetails: 1, employeeId: 1, customerId: 1 })
            .then((result) => {
                Order.populate(result, [{ path: 'employee' }, { path: 'customer' }, { path: 'orderDetails.product', select: { name: 0, price: 1, discount: 1 } }])
                    .then((data) => {
                        res.send(data);
                    })
                    .catch((err) => {
                        res.status(400).send({ message: err.message });
                    });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (error) {
        console.log(err);
        res.sendStatus(500)
    }
});
// question 9
router.get('/questions/9', function (req, res, next) {
    const query = {
        status: 'CANCELED'
    }
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
// question 10 
router.get('/questions/10', function (req, res, next) {
    const today = moment();
    const query = {
        $and: [
            {
                status: 'CANCELED',
            },
            {
                createdDate: new Date(today.format('YYYY-MM-DD')),
            },
        ],
    };
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})

// question 11
router.get('/question/11', function (req, res, next) {
    const query = {
        paymentType: 'CASH',
    };
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
// question 12
router.get('/question/12', function (req, res, next) {
    const query = {
        paymentType: 'CREDIT CARD',
    }
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })

})
//  question 13
router.get('/question/13', function (req, res, next) {
    const text = 'Ha Noi';
    const query = { shippedDate: new RegExp(`${text}`) }
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
// question 16
router.get('/question/16', function (req, res, next) {
    const query = [
        lookupCustomer,
        lookupEmployee,
        {
            $addFields: { customer: { $first: '$customer' }, employee: { $first: '$employee' } },
        },
    ];
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.status(500).json(error);
        });
})
// questions 20
router.get('/question/20', function (req, res, next) {
    const aggregate = [
        {
            $lookup: {
                from: 'products',
                localField: 'orderDetails.productId',
                foreignField: '_id',
                as: 'products',
            },
        },
        {
            $unwind: {
                path: '$products',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: { products: 1 },
        },
    ];

    findDocuments({ aggregate: aggregate }, 'orders')
        .then((result) => {
            res.json(result)
        })
        .catch((error) => {
            res.status(500).json(error)
        })
})


module.exports = router;