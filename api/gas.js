import mysql from 'mysql2/promise'

let ultimoValor = { valor: 0 }

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { valor } = req.body
        if (valor !== undefined) {
            ultimoValor.valor = valor

            try {
                const connection = await mysql.createConnection(dbConfig)
                const fecha = new Date().toISOString().slice(0, 19).replace("T", " ")
                await connection.execute(
                    "INSERT INTO registros_gas (valor, fecha) VALUES (?, ?)", [valor, fecha]
                )
                await connection.end()
                return res.status(200).json({ estado: "ok" })
            } catch (error) {
                console.error("Error DB:", error)
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