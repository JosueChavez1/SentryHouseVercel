const mongoose = require('mongoose');
const UsuarioApp = require('../models/UsuarioApp');

module.exports = async(req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const { correo, contrasena } = req.body;

        const usuario = await UsuarioApp.findOne({ correo, contrasena });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        res.status(200).json({
            id: usuario._id,
            correo: usuario.correo,
            cotizacionId: usuario.cotizacionId || null
        });

    } catch (error) {
        console.error('Error en /api/login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};