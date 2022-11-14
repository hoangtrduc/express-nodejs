const { default: mongoose } = require('mongoose');

const { Category } = require('../models');

// MONGOOSE
mongoose.connect('mongodb://localhost:27017/api-fullstack');


const express = require('express');
const router = express.Router();




/* GET users listing. */
router.get('/', function (req, res, next) {
    try {
        Category.find()
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

/* GET users listing. */
router.get('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        Category.findById(id)
            .then((result) => {
                res.send(result);
                // console.log(result);
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    } catch (err) {
        // console.log(err);
        res.sendStatus(500);
    }
});

/* GET users listing. */

router.post('/', function (req, res, next) {
    try {
        const data = req.body;

        const newItem = new Category(data);
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

// PATCH
router.patch('/:id', function (req, res, next) {
    try {
        const { id } = req.params;
        const data = req.body;

        Category.findByIdAndUpdate(id, data, {
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
        Category.findByIdAndDelete(id)
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

module.exports = router;