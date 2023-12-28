import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import prisma from '@/lib/prisma'
import { ScoreUpPayload, SocketInitResponse } from '@/lib/types'

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
    io.on('connection', (socket: any) => {
      console.log('User connected!')

      socket.on('init', async (userId: number) => {
        console.log('Initialized user with ID', userId)
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        const userWitTopScore = await prisma.user.findFirst({
          orderBy: {
            score: 'desc',
          },
        })

        if (user && userWitTopScore) {
          const response: SocketInitResponse = {
            yourScore: user.score,
            topScore: userWitTopScore?.score,
          }
          socket.emit('init', response)
        }
      })

      socket.on('scoreUp', async (payload: ScoreUpPayload) => {
        console.log('Update score', payload)
        const user = await prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        })

        if (user && user.score < payload.score) {
          console.log('Updating score...')
          try {
            const updatedUser = await prisma.user.update({
              where: { id: payload.id },
              data: { score: payload.score },
            })
            const userWitTopScore = await prisma.user.findFirst({
              orderBy: {
                score: 'desc',
              },
            })
            if (updatedUser && userWitTopScore) {
              console.log('Refresh top player...')
              const response: SocketInitResponse = {
                yourScore: updatedUser.score,
                topScore: userWitTopScore?.score,
              }
              socket.emit('init', response)
            }
          } catch (err) {
            console.error(err)
          } finally {
            console.log('Score updated!')
          }
        }
      })

      socket.on('error', (err: any) => {
        console.error('An error occurred: ', err)
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
