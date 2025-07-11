require('dotenv').config();
const express = require('express');
const connectDB = require('./db');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/gas', require('./api/gas'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));