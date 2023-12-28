import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    })

    console.log('IO initialized!')

    // when connection is established initialize other topics
    io.on('connection', (socket) => {
      console.log('User connected!')

      socket.on('init', (data) => {
        console.log('Received message: ', data)
        socket.emit('init', 'Hello from server!')
      })

      socket.on('disconnect', () => {
        console.log('User disconnected!')
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
