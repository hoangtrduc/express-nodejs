const mongoose = require("mongoose");

async function connectDatbase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/api-fullstack')
        console.log('connect database success')
    } catch (error) {
        console.log('connect database fall', err)
    }
}

module.exports = connectDatbase;