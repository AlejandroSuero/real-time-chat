import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000
const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log(`a user has CONNECTED! ${new Date().toLocaleDateString('es')}`)
  socket.on('disconnect', () => {
    console.log(`a user has DISCONNECTED! ${new Date().toLocaleDateString('es')}`)
  })
})

app.use(logger('dev'))
app.use(express.static('src/client'))

app.get('/', (_, res) => {
  res.sendFile(`${process.cwd()}/client/index.html`)
})

server.listen(port, () => {
  console.log(`Server running on http://127.0.0.1:${port}`)
})
