const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('❌ MONGODB_URI no está definida');
}

let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(uri);
    isConnected = true;
}

const LecturaSchema = new mongoose.Schema({
    valor: Number,
    fecha: { type: Date, default: Date.now }
});

const Lectura = mongoose.models.Lectura || mongoose.model('Lectura', LecturaSchema);

module.exports = async(req, res) => {
    try {
        await connectDB();

        if (req.method === 'GET') {
            const lectura = await Lectura.findOne().sort({ fecha: -1 });
            return res.status(200).json(lectura || { valor: 0 });
        }

        if (req.method === 'POST') {
            const body = req.body;
            if (!body || typeof body.valor !== 'number') {
                return res.status(400).json({ error: 'Falta o valor incorrecto en el cuerpo' });
            }

            const nueva = new Lectura({ valor: body.valor });
            await nueva.save();
            return res.status(201).json(nueva);
        }

        return res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
        console.error('❌ Error en función API:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};