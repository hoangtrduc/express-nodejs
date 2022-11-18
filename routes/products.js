const { default: mongoose } = require('mongoose');
const { Product } = require('../models');

//MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-fullstack');



const { findDocuments } = require('../helpers/MongoDbHelper');

const express = require('express');
const router = express.Router();

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
router.get('/question/1', async (req, res, next) => {
    try {
        let query = { discount: { $lte: 10 } };
        const result = await findDocuments({ query: query }, 'products');
        res.json({ ok: true, result });
    } catch (error) {
        res.status(500).json(error);
    }
})

// question 2
router.get('/question/2', async (req, res, next) => {
    try {
        let query = { stock: { $lte: 5 } };
        const result = await findDocuments({ query: query }, 'products');
        res.json({ ok: true, result });
    } catch (error) {
        res.status(500).json(error);
    }
})

// question 3
router.get('/question/3', async (req, res, next) => {
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

module.exports = router;
