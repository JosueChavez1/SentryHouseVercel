const mongoose = require('mongoose');
const Usuario = require('../models/Usuario'); // Asegúrate de tener este modelo
mongoose.connect(process.env.MONGODB_URI);

module.exports = async(req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Método no permitido');

    const { correo, contrasena } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo, contrasena });

        if (!usuario) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

        res.status(200).json({
            id: usuario._id,
            correo: usuario.correo,
            cotizacionId: usuario.cotizacionId
        });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: err.message });
    }
};