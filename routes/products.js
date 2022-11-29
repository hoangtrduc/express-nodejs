const { default: mongoose } = require('mongoose');
const { Product } = require('../models');

//MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-fullstack');

const { findDocuments } = require('../helpers/MongoDbHelper');

const express = require('express');
const router = express.Router();

const lookupCategory = {
    $lookup: {
        from: 'categories', // foreign collection name
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category', // alias
    },
};

const lookupSupplier = {
    $lookup: {
        from: 'suppliers', // foreign collection name
        localField: 'supplierId',
        foreignField: '_id',
        as: 'supplier', // alias
    },
};

router.get('/', function (req, res, next) {
    const aggregate = [
        lookupCategory,
        lookupSupplier,
        {
            $addFields: { category: { $first: '$category' }, supplier: { $first: 'supplier' } }
        }
    ];

    findDocuments({ aggregate: aggregate }, 'products')
        .then((result) => {
            res.json({ ok: true, result })
        })
        .catch((err) => {
            res.sendStatus(500).json(err)
        });
});


// GET
router.get('/', function (req, res, next) {
    try {
        Product.find()
            .populate('category')
            .populate('supplier')
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
        Product.findById(id)
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

// POST
router.post('/', function (req, res, next) {
    try {
        const data = req.body;

        const newItem = new Product(data);
        newItem
            .save()
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

// PATCH/:id
router.patch('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;

        Product.findByIdAndUpdate(id, data, {
            new: true,
        })
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

// DELETE
router.delete('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        Product.findByIdAndDelete(id)
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

// ------------------------------------------------
// question 1
router.get('/questions/1', async (req, res, next) => {
    try {
        let query = { discount: { $lte: 10 } };
        const result = await findDocuments({ query: query }, 'products');
        res.json({ ok: true, result });
    } catch (error) {
        res.status(500).json(error);
    }
})





// question 2
router.get('/questions/2', async (req, res, next) => {
    try {
        let query = { stock: { $lte: 5 } };
        const result = await findDocuments({ query: query }, 'products');
        res.json({ ok: true, result });
    } catch (error) {
        res.status(500).json(error);
    }
})

// question 3
router.get('/questions/3', async (req, res, next) => {
    try {
        const s = { $subtract: [100, '$discount'] }; // (100 - 5)
        const m = { $multiply: ['$price', s] }; // price * 95
        const d = { $divide: [m, 100] } // price * 95 / 100

        let aggregate = [{ $match: { $expr: { $lte: [d, 100000] } } }];
        const result = await findDocuments({ aggregate }, 'products');
        res.json({ ok: true, result })
    } catch (error) {
        res.status(500).json(error);
    }
})

// questions 17
router.get('/questions/17', function (req, res, next) {
    const aggregate = [
        lookupCategory,
        lookupCategory,
        {
            $addFields: { category: { $first: '$category' }, supplier: { $first: '$supplier' } },
        },
    ];

    findDocuments({ aggregate: aggregate }, 'products')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        });
});

// questions 25
router.get('/questions/25', function (req, res, next) {
    const aggregate = [
        {
            $unwind: {
                path: '$orderDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        { $addFields: { productId: '$orderDetails.productId' } },
        {
            $group: {
                _id: null,
                productIds: { $addToSet: '$productId' }, // Tạo mảng đã mua
            },
        },
        {
            $lookup: {
                from: 'products',
                let: { productIds: '$productIds' },
                pipeline: [{ $match: { $expr: { $not: { $in: ['$_id', '$$productIds'] } } } }],
                as: 'productsNotInOrderDetails',
            },
        },
        {
            $project: { productsNotInOrderDetails: 1, _id: 0 }
        },
    ];

    findDocuments({ aggregate: aggregate }, 'orders')
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            res.status(500).json(error)
        });
});


module.exports = router;
