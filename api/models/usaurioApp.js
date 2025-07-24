const mongoose = require('mongoose');

const usuarioAppSchema = new mongoose.Schema({
    correo: String,
    contrasena: String,
    cotizacionId: Number,
    fechaCreacion: Date
}, { collection: 'usuario_app' });

module.exports = mongoose.models.UsuarioApp || mongoose.model('UsuarioApp', usuarioAppSchema);