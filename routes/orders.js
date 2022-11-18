const { default: mongoose } = require('mongoose');

const { Order } = require('../models')
// mongoose
mongoose.connect('mongodb://localhost:27017/api-fullstack');

const { findDocuments } = require('../helpers/MongoDbHelper');

const express = require('express');
const router = express.Router();


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



const lookupCustomer = {
    $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'customer',
    },
};

const lookupEmployee = {
    $lookup: {
        from: 'employee',
        localField: 'employeeId',
        foreignField: '_id',
        as: 'employee',
    },
};




// question 7
router.get('/question/7', function (req, res, next) {
    const query = {
        status: 'COMPLETED',
    };

    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json(err);
        })
});
// question 8
router.get('/question/8', function (req, res, next) {
    const today = moment();
    const query = {
        $and: [
            {
                status: 'COMPLETED',
            },
            {
                createdDate: new Date(today.format('YYYY-MM-DD')),
            },
        ],
    };
    findDocuments({ query }, 'orders')
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
// question 9
router.get('/question/9', function (req, res, next) {
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
router.get('/question/10', function (req, res, next) {
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
            $addFields: { customer: { $first: '$customer' }, employee: { $employee } },
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



module.exports = router;