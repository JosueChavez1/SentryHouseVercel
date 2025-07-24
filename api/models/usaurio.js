const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    correo: String,
    contrasena: String,
    cotizacionId: Number,
    fechaCreacion: Date
});

module.exports = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);