// models/GasLectura.js
const mongoose = require('mongoose');

const GasLecturaSchema = new mongoose.Schema({
    valor: {
        type: Number,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('GasLectura', GasLecturaSchema);