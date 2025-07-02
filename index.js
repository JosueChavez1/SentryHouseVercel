import mysql from 'mysql2/promise'

let ultimoValor = { valor: 0 }

// Credenciales de conexión (usa variables de entorno en producción)
const dbConfig = {
    host: '127.0.0.1:3306',
    user: 'Josue',
    password: 'password',
    database: 'SentryHosueGas'
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { valor } = req.body
        if (valor !== undefined) {
            ultimoValor.valor = valor

            // Conexión y guardado en DB
            try {
                const connection = await mysql.createConnection(dbConfig)
                const fecha = new Date().toISOString().slice(0, 19).replace("T", " ")
                await connection.execute(
                    "INSERT INTO registros_gas (valor, fecha) VALUES (?, ?)", [valor, fecha]
                )
                await connection.end()
                console.log("Valor guardado en DB:", valor)
                return res.status(200).json({ estado: "ok" })
            } catch (error) {
                console.error("Error en la DB:", error)
                return res.status(500).json({ estado: "error", mensaje: "DB error" })
            }
        } else {
            return res.status(400).json({ estado: "error", mensaje: "Dato no recibido" })
        }
    }

    if (req.method === "GET") {
        return res.status(200).json(ultimoValor)
    }

    return res.status(405).json({ error: "Método no permitido" })
}