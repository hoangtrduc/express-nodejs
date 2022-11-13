const express = require('express');
const router = express.Router();

let data = [
    { id: 1, name: 'thời trang' },
    { id: 2, name: 'Điện máy' },
    { id: 3, name: 'Máy tính' },
    { id: 4, name: 'Old Category' },
]


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send(data);
});

/* GET users listing. */
router.get('/:id', function (req, res, next) {
    if (req.params.id === 'search') {
        next();
        return;
    }
    const id = parseInt();

    const found = data.find((x) => {
        return x.id === id;
    });
    if (found) {
        res.send(found);
        return;
    }
    res.status(404).send({ message: 'Category not found' })
});

/* GET users listing. */

router.post('/', function (req, res, next) {
    const newCategory = req.body;
    data.push(newCategory);
    res.status(201).send({ message: 'Inserted' })
});


router.patch('/search', function (req, res, next) {
    const text = req.query.text;
    const price = req.query.price;
    res.send('ok')
});

router.patch('/:id', function (req, res, next) {
    const { id } = req.params;
    const { name, price } = req.body;

    let found = data.find((x) => {
        return x.id === parseInt(id);
    });

    found.name = name;
    found.price = price;

    res.send({ message: 'Updated' });
});

// Delete
router.delete(':/id', function (req, res, next) {
    const { id } = req.params;
    data = data.filter((x) => x.id !== parseInt(id));

    console.log(id)
    res.send({ message: 'Deleted' });
});
module.exports = router;