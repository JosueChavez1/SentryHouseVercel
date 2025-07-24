// api/login.js
const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'sentryhouse';

router.post('/login', async(req, res) => {
    const { correo, contrasena } = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('usuario_app');

        const usuario = await collection.findOne({ correo, contrasena });

        if (usuario) {
            res.status(200).json({ success: true, usuarioId: usuario._id });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;