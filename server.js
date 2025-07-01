import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
app.use(cors())
app.use(express.json())

let ultimoValor = { valor: 0 }

// ⚠️ Cambia esto según tu base de datos local
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password', // o la contraseña que tengas
    database: 'SentryHosueGas'
}

app.post('/api/gas', async(req, res) => {
    const { valor } = req.body
    if (valor !== undefined) {
        ultimoValor.valor = valor
        console.log("Valor recibido:", valor)

        try {
            const connection = await mysql.createConnection(dbConfig)
            const fecha = new Date().toISOString().slice(0, 19).replace("T", " ")
            await connection.execute(
                "INSERT INTO registros_gas (valor, fecha) VALUES (?, ?)", [valor, fecha]
            )
            await connection.end()
            return res.status(200).json({ estado: 'ok' })
        } catch (error) {
            console.error("Error DB:", error)
            return res.status(500).json({ estado: 'error', mensaje: 'DB error' })
        }
    } else {
        return res.status(400).json({ estado: 'error', mensaje: 'Dato no recibido' })
    }
})

app.get('/api/gas', (req, res) => {
    res.json(ultimoValor)
})

app.listen(5000, () => {
    console.log('Servidor escuchando en http://localhost:5000')
})