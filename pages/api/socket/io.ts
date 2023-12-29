import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import { Event, ScoreUpPayload, SocketIOEvent } from '@/lib/types'
import { scoreUpHandler } from '@/lib/server/scoreUpHandler'
import { initHandler } from '@/lib/server/initHandler'

export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * This request handler creates socket.io server instance
 */
const ioHandler = (_: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    })

    console.log('[SocketIO] Server initialized!')

    // when connection is established initialize other topics
    io.on(SocketIOEvent.Connection, (socket) => {
      console.log('[SocketIO] User connected!')

      socket.on(Event.Init, (userId: number) => initHandler(socket, userId))

      socket.on(Event.ScoreUp, (payload: ScoreUpPayload) =>
        scoreUpHandler(socket, payload)
      )

      socket.on(SocketIOEvent.Error, (err: any) => {
        console.error('[SocketIO] An error occurred: ', err)
      })

      socket.on(SocketIOEvent.Disconnect, () => {
        console.log('[SocketIO] User disconnected!')
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
