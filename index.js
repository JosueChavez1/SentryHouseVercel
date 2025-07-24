const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

// Definición del modelo
const usuarioAppSchema = new mongoose.Schema({
    correo: String,
    contrasena: String,
    cotizacionId: Number,
    fechaCreacion: Date
}, { collection: 'usuario_app' });

const UsuarioApp = mongoose.models.UsuarioApp || mongoose.model('UsuarioApp', usuarioAppSchema);

// Handler Vercel
module.exports = async(req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(MONGODB_URI);
        }

        const { correo, contrasena } = req.body;
        const usuario = await UsuarioApp.findOne({ correo, contrasena });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        return res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                correo: usuario.correo,
                cotizacionId: usuario.cotizacionId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};