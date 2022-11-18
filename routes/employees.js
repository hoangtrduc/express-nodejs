const { default: mongoose } = require('mongoose');

const { Employee } = require('../models');

// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-fullstack');

const { findDocuments } = require('../helpers/MongoDbHelper');

const express = require('express');
const router = express.Router();

// GET
router.get('/', function (req, res, next) {
    try {
        Employee.find()
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

// GET: /id
router.get('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        Employee.findById(id)
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

        const newItem = new Employee(data);
        newItem
            .save()
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

// PATCH/ :id
router.patch('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;
        Employee.findByIdAndUpdate(id, data, {
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
        Employee.findByIdAndDelete(id)
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

// question 14
router.get('/question/14', function (req, res, next) {
    const today = new Date();
    const eqDay = { $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }] };
    const eqMonth = { $eq: [{ $month: '$birthday' }, { $month: today }] };

    const query = {
        $expr: {
            $and: [eqDay, eqMonth],
        },
    };
    findDocuments({ query }, 'employees')
        .then((result) => {
            res.json(result)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
})


module.exports = router;