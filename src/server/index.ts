import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import dotenv from 'dotenv'
import { type ResultSet, createClient } from '@libsql/client'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})
const db = createClient({
  url: process.env.DB_URL ?? 'libsql://db-name-username.turso.io',
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    username VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

io.on('connection', async (socket) => {
  console.log(`a user has CONNECTED! ${new Date().toLocaleDateString('es')}`)
  socket.on('disconnect', () => {
    console.log(`a user has DISCONNECTED! ${new Date().toLocaleDateString('es')}`)
  })
  socket.on('chat message', async (message) => {
    let result: ResultSet
    const username: string = socket.handshake.auth.username ?? 'anonymous'
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, username) VALUES (:message, :username)',
        args: { message, username }
      })
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Error while inserting new data into DB')
      } else {
        console.error(err)
      }
      return
    }
    io.emit('chat message', message, result.lastInsertRowid?.toString(), username)
  })
  if (!socket.recovered) {
    try {
      const serverOffset: number = socket.handshake.auth.serverOffset
      const results: ResultSet = await db.execute({
        sql: 'SELECT id, content, username FROM messages WHERE id > ?',
        args: [serverOffset]
      })
      for (let i = 0; i < results.rows.length; ++i) {
        socket.emit('chat message', results.rows[i].content, results.rows[i].id?.toString(), results.rows[i].username)
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Error while retrieving data from DB')
      } else {
        console.error(err)
      }
    }
  }
})

app.use(logger('dev'))
app.use(express.static('src/client'))

app.get('/', (_, res) => {
  res.sendFile(`${process.cwd()}/client/index.html`)
})

server.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`)
})
