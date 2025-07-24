const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Por favor define la variable de entorno MONGODB_URI');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then(mongoose => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const usuarioAppSchema = new mongoose.Schema({
    correo: String,
    contrasena: String,
    cotizacionId: Number,
    fechaCreacion: Date
}, { collection: 'usuario_app' });

const UsuarioApp = mongoose.models.UsuarioApp || mongoose.model('UsuarioApp', usuarioAppSchema);

module.exports = async(req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ mensaje: 'Método no permitido' });
    }

    try {
        await connectToDatabase();

        const { correo, contrasena } = req.body;

        const usuario = await UsuarioApp.findOne({ correo, contrasena });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        return res.status(200).json({
            id: usuario._id,
            correo: usuario.correo,
            cotizacionId: usuario.cotizacionId || null
        });

    } catch (error) {
        console.error('Error en /api/login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};