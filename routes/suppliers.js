const { default: mongoose } = require('mongoose');
const { Supplier } = require('../models');

// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-fullstack');


const express = require('express');
const { findDocuments } = require('../helpers/MongoDbHelper');
const { aggregate } = require('../models/Category');
const router = express.Router();

// GET
router.get('/', function (req, res, next) {
    try {
        Supplier.find()
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

// GET:id
router.get('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        Supplier.findById(id)
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

        const newItem = new Supplier(data);
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

// PATCH: /id
router.patch('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;

        Supplier.findByIdAndUpdate(id, data, {
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
        Supplier.findByIdAndDelete(id)
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
// question 15
router.get('/questions/15', function (req, res, next) {
    findDocuments({
        query: {
            name: { $in: ['SONY', 'SAMSUNG', 'TOSHIBA', 'APPLE', 'NOKIA'] },
        }
    }, 'suppliers')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})
// questions 19
router.get('/questions/19', function (req, res, next) {
    const aggregate = [
        {
            $lookup: {
                from: 'products',
                let: { id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$$id', '$supplierId'] },
                        },
                    },
                ],
                as: 'products',
            }
        },
        {
            $addFields: { numberOfProducts: { $size: '$products' } },
        },

    ]
    findDocuments({ aggregate: aggregate }, 'suppliers')
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.status(400).json(err)
        });
})

module.exports = router;